import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { makeWorkbitPatchRequest } from '../utils/workbitClient.js'
import { logMcpError } from '../logging.js'

export function registerUpdateMilestoneTool(server: McpServer): void {
  server.registerTool(
    'updateMilestone',
    {
      description:
        'Update an existing milestone. Provide team ID, milestone ID, and any fields to update.',
      inputSchema: {
        teamId: z
          .string()
          .min(1)
          .describe('The team ID that owns the milestone.'),
        milestoneId: z.string().min(1).describe('The milestone ID to update.'),
        name: z
          .string()
          .optional()
          .describe('Optional new name for the milestone.'),
        targetDate: z
          .string()
          .optional()
          .describe('Optional new target date (e.g. ISO date).'),
        description: z
          .string()
          .optional()
          .describe('Optional new description.'),
        progress: z.number().optional().describe('Optional progress value.'),
        total: z.number().optional().describe('Optional total value.'),
      },
    },
    async ({
      teamId,
      milestoneId,
      name,
      targetDate,
      description,
      progress,
      total,
    }) => {
      try {
        const payload: Record<string, unknown> = {}
        if (name !== undefined) payload.name = name
        if (targetDate !== undefined) payload.targetDate = targetDate
        if (description !== undefined) payload.description = description
        if (progress !== undefined) payload.progress = progress
        if (total !== undefined) payload.total = total

        if (Object.keys(payload).length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: 'No fields to update. Provide at least one of: name, targetDate, description, progress, total.',
              },
            ],
          }
        }

        const result = await makeWorkbitPatchRequest<unknown>(
          `/teams/${encodeURIComponent(teamId)}/project/milestones/${encodeURIComponent(milestoneId)}`,
          payload
        )
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        }
      } catch (error) {
        logMcpError(error, 'tools.updateMilestone', {
          teamId,
          milestoneId,
        })
        return {
          content: [
            {
              type: 'text',
              text: `Failed to update milestone in Workbit API: ${
                (error as Error).message
              }`,
            },
          ],
        }
      }
    }
  )
}
