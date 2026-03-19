import { z } from 'zod';
import { makeWorkbitPostRequest } from '../utils/workbitClient.js';
import { logMcpError } from '../logging.js';
export function registerCreateMilestoneTool(server) {
    server.registerTool('createMilestone', {
        description: "Create a new milestone for a team's project. The team must already have a project.",
        inputSchema: {
            teamId: z
                .string()
                .min(1)
                .describe('The team ID that owns the project to add the milestone to.'),
            name: z.string().min(1).describe('The milestone name. Required.'),
            targetDate: z
                .string()
                .optional()
                .describe('Optional target date for the milestone (e.g. ISO date string).'),
            description: z
                .string()
                .optional()
                .describe('Optional milestone description.'),
        },
    }, async ({ teamId, name, targetDate, description }) => {
        try {
            const payload = { name };
            if (targetDate != null && targetDate !== '') {
                payload.targetDate = targetDate;
            }
            if (description != null && description !== '') {
                payload.description = description;
            }
            const result = await makeWorkbitPostRequest(`/teams/${encodeURIComponent(teamId)}/project/milestones`, payload);
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(result, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            logMcpError(error, 'tools.createMilestone', { teamId, name });
            return {
                content: [
                    {
                        type: 'text',
                        text: `Failed to create milestone in Workbit API: ${error.message}`,
                    },
                ],
            };
        }
    });
}
