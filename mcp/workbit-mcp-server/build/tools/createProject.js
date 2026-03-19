import { z } from 'zod';
import { makeWorkbitPostRequest } from '../utils/workbitClient.js';
import { logMcpError } from '../logging.js';
export function registerCreateProjectTool(server) {
    server.registerTool('createProject', {
        description: 'Create a new Workbit project. Requires a team ID; the project will be linked to that team.',
        inputSchema: {
            name: z.string().min(1).describe('The project name.'),
            teamId: z
                .string()
                .min(1)
                .describe('The team ID to associate the project with. Required.'),
            status: z
                .string()
                .optional()
                .describe("Optional project status (e.g. 'Active'). Defaults to 'Active' if omitted."),
        },
    }, async ({ name, teamId, status }) => {
        try {
            const payload = {
                name,
                teamId,
            };
            if (status != null && status !== '') {
                payload.status = status;
            }
            const result = await makeWorkbitPostRequest('/workspace/projects', payload);
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
            logMcpError(error, 'tools.createProject', { name, teamId });
            return {
                content: [
                    {
                        type: 'text',
                        text: `Failed to create project in Workbit API: ${error.message}`,
                    },
                ],
            };
        }
    });
}
