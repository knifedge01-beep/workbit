import { convertToLexicalJson } from '@thedatablitz/text-editor';
import { z } from 'zod';
import { makeWorkbitPostRequest } from '../utils/workbitClient.js';
import { logMcpError } from '../logging.js';
function lexicalJsonHasBlockContent(serialized) {
    try {
        const parsed = JSON.parse(serialized);
        const children = parsed?.root?.children;
        return Array.isArray(children) && children.length > 0;
    }
    catch {
        return false;
    }
}
function plainTextToLexicalEditorState(raw) {
    const lines = raw.split(/\r?\n/);
    const text = lines.join('\n');
    return JSON.stringify({
        root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [
                {
                    type: 'paragraph',
                    format: '',
                    indent: 0,
                    version: 1,
                    direction: 'ltr',
                    textFormat: 0,
                    textStyle: '',
                    children: [
                        {
                            type: 'text',
                            detail: 0,
                            format: 0,
                            mode: 'normal',
                            style: '',
                            text,
                            version: 1,
                        },
                    ],
                },
            ],
        },
    });
}
function stringToLexicalEditorState(raw) {
    const s = raw ?? '';
    if (!s.trim()) {
        return '';
    }
    try {
        const parsed = JSON.parse(s);
        if (parsed && typeof parsed === 'object' && parsed.root != null) {
            return lexicalJsonHasBlockContent(s) ? s : '';
        }
    }
    catch {
        // not JSON; treat as markdown
    }
    try {
        const converted = convertToLexicalJson(s, 'markdown');
        if (lexicalJsonHasBlockContent(converted))
            return converted;
    }
    catch {
        // fallback to plain text lexical JSON
    }
    return plainTextToLexicalEditorState(s);
}
function countWords(input) {
    return input.trim().split(/\s+/).filter(Boolean).length;
}
function buildElaborateDescription(title, description) {
    const createdByLine = 'Created by: AI Generated';
    const userText = (description ?? '').trim();
    const base = userText.length > 0
        ? userText
        : `Deliver the "${title}" work item with clear implementation details and expected outcome.`;
    // Ensure generated descriptions are substantial and actionable.
    if (countWords(base) >= 40) {
        return `${createdByLine}\n\n${base}`;
    }
    return `${createdByLine}

Context:
${base}

Implementation outline:
- Define the scope and key deliverables for "${title}".
- Break work into concrete implementation steps with dependencies.
- Note edge cases, constraints, and assumptions relevant to execution.

Acceptance criteria:
- Outcome is testable and aligned with project goals.
- Required dependencies, risks, and follow-up items are documented.
- Completion state and next steps are clear for the team.`;
}
export function registerCreateIssueTool(server) {
    server.registerTool('createIssue', {
        description: 'Create a new Workbit issue. Optionally link it to a project and/or team. For bulk work (many parents + sub-issues): create all parent issues first without parentIssueId; only then use createSubIssue per parent. One create per turn is preferred.',
        inputSchema: {
            title: z.string().min(1).describe('The issue title.'),
            description: z
                .string()
                .optional()
                .describe('Optional issue description.'),
            projectId: z
                .string()
                .optional()
                .describe('Optional project ID to associate the issue with.'),
            teamId: z
                .string()
                .optional()
                .describe('Optional team ID. When provided, the issue is created under this team.'),
            parentIssueId: z
                .string()
                .optional()
                .describe('Optional parent issue ID to nest this as a sub-issue.'),
        },
    }, async ({ title, description, projectId, teamId, parentIssueId }) => {
        try {
            const descriptionWithSource = buildElaborateDescription(title, description);
            const lexicalDescription = stringToLexicalEditorState(descriptionWithSource);
            const payload = { title, description: lexicalDescription };
            if (projectId != null && projectId !== '') {
                payload.projectId = projectId;
            }
            if (teamId != null && teamId !== '') {
                payload.teamId = teamId;
            }
            if (parentIssueId != null && parentIssueId !== '') {
                payload.parentIssueId = parentIssueId;
            }
            const path = teamId
                ? `/teams/${encodeURIComponent(teamId)}/issues`
                : '/issues';
            const issue = await makeWorkbitPostRequest(path, payload);
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(issue, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            logMcpError(error, 'tools.createIssue', { title });
            return {
                content: [
                    {
                        type: 'text',
                        text: `Failed to create issue in Workbit API: ${error.message}`,
                    },
                ],
            };
        }
    });
    server.registerTool('createSubIssue', {
        description: 'Create a new sub-issue under an existing parent issue. Use this (not createIssue) when nesting work under a parent. The parent must already exist—use parentIssueId from a prior successful createIssue (or getIssue). After bulk parent creation, add all sub-issues for one parent before moving to the next parent.',
        inputSchema: {
            title: z.string().min(1).describe('The sub-issue title.'),
            description: z
                .string()
                .optional()
                .describe('Optional sub-issue description.'),
            projectId: z
                .string()
                .optional()
                .describe('Optional project ID. If provided, it should match the parent issue project.'),
            parentIssueId: z
                .string()
                .min(1)
                .describe('Required parent issue ID to attach this sub-issue to.'),
        },
    }, async ({ title, description, projectId, parentIssueId }) => {
        try {
            const descriptionWithSource = buildElaborateDescription(title, description);
            const lexicalDescription = stringToLexicalEditorState(descriptionWithSource);
            const payload = {
                title,
                description: lexicalDescription,
                parentIssueId,
            };
            if (projectId != null && projectId !== '') {
                payload.projectId = projectId;
            }
            const path = '/issues';
            const issue = await makeWorkbitPostRequest(path, payload);
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(issue, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            logMcpError(error, 'tools.createSubIssue', { title, parentIssueId });
            return {
                content: [
                    {
                        type: 'text',
                        text: `Failed to create sub-issue in Workbit API: ${error.message}`,
                    },
                ],
            };
        }
    });
}
