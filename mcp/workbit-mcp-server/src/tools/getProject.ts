import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { makeWorkbitRequest } from '../utils/workbitClient.js'
import { logMcpError } from '../logging.js'

export function registerGetProjectTool(server: McpServer): void {
  server.registerTool(
    'getProject',
    {
      description:
        'Get a Workbit project by ID, or list all projects when no ID is provided.',
      inputSchema: {
        projectId: z
          .string()
          .optional()
          .describe(
            'Optional project ID. When omitted, all projects are returned.'
          ),
      },
    },
    async ({ projectId }) => {
      try {
        const projects = await makeWorkbitRequest<unknown[]>(
          '/workspace/projects'
        )

        let result: unknown = projects

        if (projectId) {
          if (Array.isArray(projects)) {
            const match = projects.find(
              (p) =>
                p &&
                typeof p === 'object' &&
                (p as { id?: string })?.id === projectId
            )
            result = match ?? {
              error: `Project not found for id: ${projectId}`,
            }
          } else {
            result = {
              error:
                'Unexpected projects payload; expected an array from /workspace/projects.',
            }
          }
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        }
      } catch (error) {
        logMcpError(error, 'tools.getProject', { projectId })
        return {
          content: [
            {
              type: 'text',
              text: `Failed to fetch project(s) from Workbit API: ${
                (error as Error).message
              }`,
            },
          ],
        }
      }
    }
  )
}
