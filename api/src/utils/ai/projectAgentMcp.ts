import type { WorkbitUpstreamAuth } from '../../middleware/auth.js'
import { runMcpLlmLoop } from './mcpLlmLoop.js'
import { nvidiaOpenAiChatCompletion } from './nvedia.js'

/** Tools the project agent may use (project, issues, decisions, status update). */
export const PROJECT_AGENT_TOOL_ALLOWLIST = [
  'getProject',
  'getIssuesByProject',
  'getIssue',
  'getProjectDecisions',
  'updateProjectDecision',
  'createProjectDecision',
  'updateIssue',
  'createSubIssue',
  'createIssue',
  'createMilestone',
  'getProjectStatusUpdates',
  'getProjectStatusComment',
  'getProjectStatusUpdateComments',
  'createProjectStatusUpdateComment',
  'createProjectStatusUpdate',
] as const

const DEFAULT_AGENT_MAX_ROUNDS = 36

const PROJECT_AGENT_SYSTEM_PROMPT = `You are a Workbit project agent. You work only inside the project ID given in the user message.

Rules:
- For project questions (analysis / planning / status), always load full project context before answering: getProject (project + milestones), getIssuesByProject (issues + sub-issue relationships), getProjectDecisions, and getProjectStatusUpdates. For each relevant update, inspect comments using getProjectStatusUpdateComments and getProjectStatusComment when needed.
- For each issue you plan to modify (and for parent issues where you may add sub-issues), call getIssue first and read both title and description before deciding actions.
- Plan actions from issue/sub-issue semantics, not title alone: use both title and description content to infer intent, scope, and acceptance criteria.
- Use at most one tool per assistant turn.
- Never use placeholder IDs (e.g. literal "issueId"). Use real ids from tool results.
- Every createIssue/createSubIssue call must include a non-empty description, not just a title.
- For nested work under an existing issue, prefer createSubIssue with parentIssueId set to the parent's issue id.
- For new top-level tasks in the project, use createIssue and set projectId when the API expects it.
- If decisions already exist for the project, treat them as constraints and follow them while planning/executing issue work.
- Use createProjectDecision to call out key decisions the user must make during plan execution.
- If missing decisions are blocking execution, create a project decision that captures the pending choice, rationale, and impact.
- For creation-heavy requests, consider a complete project update package when appropriate: createIssue/createSubIssue for execution work, createMilestone for timeline checkpoints, createProjectDecision for key choices, and createProjectStatusUpdate to communicate progress/outcome.
- If no extra user instructions are provided, do not stop after loading context. Act autonomously:
  1) infer concrete next tasks from the project goal and current issues,
  2) add actionable sub-issues under existing parent issues where helpful,
  3) create top-level issues only when no suitable parent exists.
- Avoid duplicate work: before creating an issue/sub-issue, inspect existing issues and only add missing, clearly new tasks.
- Before finishing, create one project status update via createProjectStatusUpdate summarizing overall changes made in this request (completed actions, current state, and next steps).
- If an instruction is unclear or unsafe, say so in your final summary instead of guessing.
- When you are done with the requested work (or cannot proceed), end with a short, concrete summary of actions taken or blockers.`

const PLANNER_SYSTEM_PROMPT = `You are a planning assistant for Workbit. You do NOT call tools. You only output a clear numbered plan (markdown or plain text) that a separate worker will execute using Workbit tools (getProject, getIssuesByProject, getIssue, getProjectDecisions, updateProjectDecision, updateIssue, createSubIssue, createIssue, createMilestone, getProjectStatusUpdates, getProjectStatusComment, getProjectStatusUpdateComments, createProjectStatusUpdateComment, createProjectDecision, createProjectStatusUpdate).

The plan must:
- Reference the project by ID.
- Be ordered: observe state first (including milestones, decisions, updates/comments), then propose specific edits or new issues/sub-issues/milestones.
- Include steps to observe project status updates and their comments where relevant.
- Include a step to inspect relevant issues with getIssue and use both title + description as planning inputs.
- Include a step to record user-facing decision callouts using createProjectDecision when needed.
- Include a final step to create one project status update summarizing overall changes made during execution.
- Use no placeholder IDs; say "use id from getIssuesByProject" where needed.`

const WORKER_AFTER_PLAN_SYSTEM_PROMPT = `You are a Workbit project worker. Execute the numbered plan from the user message using MCP tools only for the given project. One tool per turn. Use real issue and project IDs from tool results. Before modifying an issue or adding sub-issues under a parent, call getIssue and consider both title and description. Prefer createSubIssue for work under an existing parent issue. Respect existing project decisions while executing. Every createIssue/createSubIssue call must include a non-empty description. Use createProjectDecision for key decisions the user must make, createMilestone for meaningful timeline checkpoints, and createProjectStatusUpdate for user-facing progress summaries. Read and use relevant project updates/comments using getProjectStatusUpdates, getProjectStatusUpdateComments, getProjectStatusComment, and createProjectStatusUpdateComment when needed. When the plan is done or blocked, reply with a concise summary.`

export type AgentRunMode = 'single' | 'planner_worker'

export type RunProjectAgentOptions = {
  projectId: string
  instructions?: string
  maxRounds?: number
  mode?: AgentRunMode
}

export type RunProjectAgentResult = {
  summary: string
  finishedReason: 'max_rounds' | 'model_done' | 'empty_reply' | 'no_message'
  mode: AgentRunMode
  plan?: string
}

function buildInitialUserMessage(
  projectId: string,
  instructions?: string
): string {
  const trimmedInstructions = instructions?.trim()
  const extra = trimmedInstructions
    ? `Additional instructions from the user:\n${trimmedInstructions}\n\n`
    : `No additional instructions were provided.
Run in autonomous mode for this project: after loading context, execute sensible issue/sub-issue actions that move the project forward.\n\n`
  return `Project ID: ${projectId}

${extra}Your workflow:
1) Call getProject with projectId "${projectId}".
2) Call getIssuesByProject with projectId "${projectId}".
3) Call getProjectDecisions with projectId "${projectId}" and consider all listed decisions as constraints.
4) From getProject, include milestone context in your reasoning. Identify teamId and call getProjectStatusUpdates; inspect related comments with getProjectStatusUpdateComments and getProjectStatusComment when useful for context.
5) Before planning changes for a specific issue or parent issue, call getIssue and read both title and description (including sub-issue context if present).
6) Carry out changes that match the project goal and any additional instructions, using one tool per turn.
7) Use createProjectDecision or updateProjectDecision to record/refine key decisions the user must make during execution when needed.
8) For creation-focused work, consider creating the right artifacts: issues/sub-issues, milestones, and decision records where appropriate.
9) If context gaps remain in existing updates, add clarifying notes with createProjectStatusUpdateComment.
10) Create one project status update using createProjectStatusUpdate. Include:
   - Completed actions
   - Current state after changes
   - Next actions
11) Finish with a brief summary of what you did or why you stopped.`
}

export async function runProjectAgent(
  auth: WorkbitUpstreamAuth,
  options: RunProjectAgentOptions
): Promise<RunProjectAgentResult> {
  const mode = options.mode ?? 'single'
  const maxRounds = options.maxRounds ?? DEFAULT_AGENT_MAX_ROUNDS
  const projectId = options.projectId.trim()

  if (mode === 'planner_worker') {
    const planUser = `Project ID: ${projectId}

${options.instructions?.trim() ? `Goal / context:\n${options.instructions.trim()}\n\n` : ''}Produce a numbered plan for improving or maintaining this project using Workbit issues and sub-issues. The worker can only call tools; do not assume hidden state.`

    const planCompletion = await nvidiaOpenAiChatCompletion({
      messages: [
        { role: 'system', content: PLANNER_SYSTEM_PROMPT },
        { role: 'user', content: planUser },
      ],
    })

    const planMsg = planCompletion.choices?.[0]?.message
    const planText =
      typeof planMsg?.content === 'string' ? planMsg.content.trim() : ''
    if (!planText) {
      return {
        summary: 'Planner returned no plan text.',
        finishedReason: 'no_message',
        mode,
      }
    }

    const workerUser = `Project ID: ${projectId}

Execute this plan using tools. One tool per turn.

---
${planText}
---`

    const workerResult = await runMcpLlmLoop({
      auth,
      systemPrompt: WORKER_AFTER_PLAN_SYSTEM_PROMPT,
      initialUserMessage: workerUser,
      toolNameAllowlist: [...PROJECT_AGENT_TOOL_ALLOWLIST],
      maxRounds,
      enableChatNudges: false,
    })

    return {
      summary: workerResult.text,
      finishedReason: workerResult.finishedReason,
      mode,
      plan: planText,
    }
  }

  const result = await runMcpLlmLoop({
    auth,
    systemPrompt: PROJECT_AGENT_SYSTEM_PROMPT,
    initialUserMessage: buildInitialUserMessage(
      projectId,
      options.instructions
    ),
    toolNameAllowlist: [...PROJECT_AGENT_TOOL_ALLOWLIST],
    maxRounds,
    enableChatNudges: false,
  })

  return {
    summary: result.text,
    finishedReason: result.finishedReason,
    mode: 'single',
  }
}
