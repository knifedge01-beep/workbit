import { z } from 'zod';
import { makeWorkbitPostRequest } from '../utils/workbitClient.js';
import { logMcpError } from '../logging.js';
export function registerCreateProjectStatusUpdateTool(server) {
    server.registerTool('createProjectStatusUpdate', {
        description: 'Create a project status update for a team. Use this at the end of an agent run to summarize overall changes made in the request.',
        inputSchema: {
            teamId: z
                .string()
                .min(1)
                .describe('Team ID that owns the project update stream.'),
            projectId: z
                .string()
                .min(1)
                .describe('Project ID this update belongs to.'),
            content: z
                .string()
                .min(1)
                .describe('Status update body summarizing completed actions, current state after changes, and next steps.'),
            status: z
                .enum(['on-track', 'at-risk', 'off-track'])
                .optional()
                .describe('Optional project health status (defaults to on-track).'),
        },
    }, async ({ teamId, projectId, content, status }) => {
        try {
            const payload = {
                content,
                projectId,
                status: status ?? 'on-track',
            };
            const update = await makeWorkbitPostRequest(`/teams/${encodeURIComponent(teamId)}/project/updates`, payload);
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(update, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            logMcpError(error, 'tools.createProjectStatusUpdate', {
                teamId,
                projectId,
            });
            return {
                content: [
                    {
                        type: 'text',
                        text: `Failed to create project status update in Workbit API: ${error.message}`,
                    },
                ],
            };
        }
    });
}
