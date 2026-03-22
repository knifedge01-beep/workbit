import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { makeWorkbitPostRequest } from '../utils/workbitClient.js'
import { logMcpError } from '../logging.js'

export function registerCreateIssueTool(server: McpServer): void {
  server.registerTool(
    'createIssue',
    {
      description:
        'Create a new Workbit issue. Optionally link it to a project and/or team.',
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
          .describe(
            'Optional team ID. When provided, the issue is created under this team.'
          ),
      },
    },
    async ({ title, description, projectId, teamId }) => {
      try {
        const createdByLine = 'Created by: AI Generated'
        const descriptionWithSource =
          description != null && description !== ''
            ? `${createdByLine}\n\n${description}`
            : createdByLine

        const payload: {
          title: string
          description?: string
          projectId?: string
          teamId?: string
        } = { title, description: descriptionWithSource }
        if (projectId != null && projectId !== '') {
          payload.projectId = projectId
        }
        if (teamId != null && teamId !== '') {
          payload.teamId = teamId
        }

        const path = teamId
          ? `/teams/${encodeURIComponent(teamId)}/issues`
          : '/issues'
        const issue = await makeWorkbitPostRequest<unknown>(path, payload)

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(issue, null, 2),
            },
          ],
        }
      } catch (error) {
        logMcpError(error, 'tools.createIssue', { title })
        return {
          content: [
            {
              type: 'text',
              text: `Failed to create issue in Workbit API: ${
                (error as Error).message
              }`,
            },
          ],
        }
      }
    }
  )
  server.registerTool(
    'createSubIssue',
    {
      description:
        'Create a new sub issue. Optionally link it to a project and/or team.',
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
          .describe(
            'Optional team ID. When provided, the issue is created under this team.'
          ),
        parentIssueId: z
          .string()
          .optional()
          .describe(
            'Optional parent issue ID to associate the sub issue with.'
          ),
      },
    },
    async ({ title, description, projectId, teamId }) => {
      try {
        const createdByLine = 'Created by: AI Generated'
        const descriptionWithSource =
          description != null && description !== ''
            ? `${createdByLine}\n\n${description}`
            : createdByLine

        const payload: {
          title: string
          description?: string
          projectId?: string
          teamId?: string
        } = { title, description: descriptionWithSource }
        if (projectId != null && projectId !== '') {
          payload.projectId = projectId
        }
        if (teamId != null && teamId !== '') {
          payload.teamId = teamId
        }

        const path = teamId
          ? `/teams/${encodeURIComponent(teamId)}/issues`
          : '/issues'
        const issue = await makeWorkbitPostRequest<unknown>(path, payload)

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(issue, null, 2),
            },
          ],
        }
      } catch (error) {
        logMcpError(error, 'tools.createIssue', { title })
        return {
          content: [
            {
              type: 'text',
              text: `Failed to create issue in Workbit API: ${
                (error as Error).message
              }`,
            },
          ],
        }
      }
    }
  )
}
