import { z } from 'zod';
import { makeWorkbitRequest } from '../utils/workbitClient.js';
import { logMcpError } from '../logging.js';
export function registerGetIssueTool(server) {
    server.registerTool('getIssue', {
        description: 'Get a Workbit issue by ID.',
        inputSchema: {
            issueId: z.string().min(1).describe('The issue ID to fetch.'),
        },
    }, async ({ issueId }) => {
        try {
            const issue = await makeWorkbitRequest(`/issues/${encodeURIComponent(issueId)}`);
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
            logMcpError(error, 'tools.getIssue', { issueId });
            return {
                content: [
                    {
                        type: 'text',
                        text: `Failed to fetch issue from Workbit API: ${error.message}`,
                    },
                ],
            };
        }
    });
    server.registerTool('getIssuesByProject', {
        description: 'Get all issues for a given project.',
        inputSchema: {
            projectId: z
                .string()
                .min(1)
                .describe('The project ID to fetch issues for.'),
        },
    }, async ({ projectId }) => {
        try {
            const issues = await makeWorkbitRequest(`/projects/${encodeURIComponent(projectId)}`);
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(issues, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            logMcpError(error, 'tools.getIssuesByProject', { projectId });
            return {
                content: [
                    {
                        type: 'text',
                        text: `Failed to fetch issues from Workbit API: ${error.message}`,
                    },
                ],
            };
        }
    });
}
