import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { makeWorkbitRequest } from '../utils/workbitClient.js'
import { logMcpError } from '../logging.js'

export function registerGetDecisionTool(server: McpServer): void {
  server.registerTool(
    'getDecision',
    {
      description: 'Get a specific decision from a project by decision ID.',
      inputSchema: {
        projectId: z
          .string()
          .min(1)
          .describe('The project ID containing the decision.'),
        decisionId: z.string().min(1).describe('The decision ID to fetch.'),
      },
    },
    async ({ projectId, decisionId }) => {
      try {
        const decision = await makeWorkbitRequest<unknown>(
          `/projects/${encodeURIComponent(projectId)}/decisions/${encodeURIComponent(
            decisionId
          )}`
        )

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(decision, null, 2),
            },
          ],
        }
      } catch (error) {
        logMcpError(error, 'tools.getDecision', { projectId, decisionId })
        return {
          content: [
            {
              type: 'text',
              text: `Failed to fetch decision from Workbit API: ${
                (error as Error).message
              }`,
            },
          ],
        }
      }
    }
  )

  server.registerTool(
    'getProjectDecisions',
    {
      description: 'Get all decisions for a given project.',
      inputSchema: {
        projectId: z
          .string()
          .min(1)
          .describe('The project ID to fetch decisions for.'),
        status: z
          .enum(['proposed', 'approved', 'rejected', 'superseded', 'all'])
          .optional()
          .describe('Optional status filter (defaults to all).'),
        type: z
          .enum(['major', 'minor', 'all'])
          .optional()
          .describe('Optional type filter (defaults to all).'),
        limit: z
          .number()
          .int()
          .positive()
          .optional()
          .describe('Optional limit on number of results.'),
      },
    },
    async ({ projectId, status, type, limit }) => {
      try {
        let path = `/projects/${encodeURIComponent(projectId)}/decisions`
        const params: string[] = []

        if (status && status !== 'all') {
          params.push(`status=${encodeURIComponent(status)}`)
        }
        if (type && type !== 'all') {
          params.push(`type=${encodeURIComponent(type)}`)
        }
        if (limit) {
          params.push(`pageSize=${limit}`)
        }

        if (params.length > 0) {
          path += `?${params.join('&')}`
        }

        const decisions = await makeWorkbitRequest<unknown>(path)

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(decisions, null, 2),
            },
          ],
        }
      } catch (error) {
        logMcpError(error, 'tools.getProjectDecisions', {
          projectId,
          status,
          type,
        })
        return {
          content: [
            {
              type: 'text',
              text: `Failed to fetch decisions from Workbit API: ${
                (error as Error).message
              }`,
            },
          ],
        }
      }
    }
  )
}
