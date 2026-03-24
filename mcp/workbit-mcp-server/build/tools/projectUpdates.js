import { z } from 'zod';
import { makeWorkbitPostRequest, makeWorkbitRequest, } from '../utils/workbitClient.js';
import { logMcpError } from '../logging.js';
export function registerProjectUpdateTools(server) {
    server.registerTool('getProjectStatusUpdates', {
        description: 'Read project status updates for a team, optionally scoped to a projectId.',
        inputSchema: {
            teamId: z.string().min(1).describe('The team ID that owns the project.'),
            projectId: z
                .string()
                .optional()
                .describe('Optional project ID filter for updates.'),
        },
    }, async ({ teamId, projectId }) => {
        try {
            const teamProject = await makeWorkbitRequest(`/teams/${encodeURIComponent(teamId)}/project`);
            const nodes = teamProject?.project?.statusUpdates?.nodes;
            const updates = Array.isArray(nodes) ? nodes : [];
            const filtered = projectId && projectId.trim() !== ''
                ? updates.filter((u) => u &&
                    typeof u === 'object' &&
                    u.projectId === projectId)
                : updates;
            return {
                content: [{ type: 'text', text: JSON.stringify(filtered, null, 2) }],
            };
        }
        catch (error) {
            logMcpError(error, 'tools.getProjectStatusUpdates', { teamId, projectId });
            return {
                content: [
                    {
                        type: 'text',
                        text: `Failed to fetch project status updates from Workbit API: ${error.message}`,
                    },
                ],
            };
        }
    });
    server.registerTool('getProjectStatusComment', {
        description: 'Read a single comment from a project status update.',
        inputSchema: {
            teamId: z.string().min(1).describe('The team ID that owns the update.'),
            updateId: z.string().min(1).describe('The status update ID.'),
            commentId: z.string().min(1).describe('The status comment ID.'),
        },
    }, async ({ teamId, updateId, commentId }) => {
        try {
            const comments = await makeWorkbitRequest(`/teams/${encodeURIComponent(teamId)}/project/updates/${encodeURIComponent(updateId)}/comments`);
            const item = Array.isArray(comments)
                ? comments.find((c) => c && typeof c === 'object' && c.id === commentId)
                : null;
            const result = item ?? {
                error: `Project status comment not found for id: ${commentId}`,
            };
            return {
                content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            };
        }
        catch (error) {
            logMcpError(error, 'tools.getProjectStatusComment', {
                teamId,
                updateId,
                commentId,
            });
            return {
                content: [
                    {
                        type: 'text',
                        text: `Failed to fetch project status comment from Workbit API: ${error.message}`,
                    },
                ],
            };
        }
    });
    server.registerTool('getProjectStatusUpdateComments', {
        description: 'Read comments for a project status update.',
        inputSchema: {
            teamId: z.string().min(1).describe('The team ID that owns the update.'),
            updateId: z.string().min(1).describe('The status update ID.'),
        },
    }, async ({ teamId, updateId }) => {
        try {
            const comments = await makeWorkbitRequest(`/teams/${encodeURIComponent(teamId)}/project/updates/${encodeURIComponent(updateId)}/comments`);
            return {
                content: [{ type: 'text', text: JSON.stringify(comments, null, 2) }],
            };
        }
        catch (error) {
            logMcpError(error, 'tools.getProjectStatusUpdateComments', {
                teamId,
                updateId,
            });
            return {
                content: [
                    {
                        type: 'text',
                        text: `Failed to fetch project status update comments from Workbit API: ${error.message}`,
                    },
                ],
            };
        }
    });
    server.registerTool('createProjectStatusUpdateComment', {
        description: 'Create a comment on a project status update.',
        inputSchema: {
            teamId: z.string().min(1).describe('The team ID that owns the update.'),
            updateId: z.string().min(1).describe('The status update ID.'),
            content: z.string().min(1).describe('Comment text.'),
        },
    }, async ({ teamId, updateId, content }) => {
        try {
            const comment = await makeWorkbitPostRequest(`/teams/${encodeURIComponent(teamId)}/project/updates/${encodeURIComponent(updateId)}/comments`, { content });
            return {
                content: [{ type: 'text', text: JSON.stringify(comment, null, 2) }],
            };
        }
        catch (error) {
            logMcpError(error, 'tools.createProjectStatusUpdateComment', {
                teamId,
                updateId,
            });
            return {
                content: [
                    {
                        type: 'text',
                        text: `Failed to create project status update comment in Workbit API: ${error.message}`,
                    },
                ],
            };
        }
    });
}
