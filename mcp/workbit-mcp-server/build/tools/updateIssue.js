import { z } from 'zod';
import { makeWorkbitPatchRequest } from '../utils/workbitClient.js';
import { logMcpError } from '../logging.js';
export function registerUpdateIssueTool(server) {
    server.registerTool('updateIssue', {
        description: 'Update an existing Workbit issue. Provide the issue ID and any fields to update.',
        inputSchema: {
            issueId: z.string().min(1).describe('The issue ID to update.'),
            status: z
                .string()
                .optional()
                .describe('Optional new status for the issue.'),
            assigneeId: z
                .string()
                .optional()
                .describe('Optional assignee member ID.'),
            assigneeName: z
                .string()
                .optional()
                .describe('Optional assignee display name.'),
            projectId: z
                .string()
                .nullable()
                .optional()
                .describe('Optional project ID to link the issue to, or null to unlink.'),
            description: z
                .string()
                .optional()
                .describe('Optional new description for the issue.'),
            parentIssueId: z
                .string()
                .nullable()
                .optional()
                .describe('Optional parent issue ID to set or change the parent, or null to remove it.'),
        },
    }, async ({ issueId, status, assigneeId, assigneeName, projectId, description, parentIssueId, }) => {
        try {
            const payload = {};
            if (status !== undefined)
                payload.status = status;
            if (assigneeId !== undefined)
                payload.assigneeId = assigneeId;
            if (assigneeName !== undefined)
                payload.assigneeName = assigneeName;
            if (projectId !== undefined)
                payload.projectId = projectId;
            if (description !== undefined)
                payload.description = description;
            if (parentIssueId !== undefined)
                payload.parentIssueId = parentIssueId;
            if (Object.keys(payload).length === 0) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: 'No fields to update. Provide at least one of: status, assigneeId, assigneeName, projectId, description, parentIssueId.',
                        },
                    ],
                };
            }
            const result = await makeWorkbitPatchRequest(`/issues/${encodeURIComponent(issueId)}`, payload);
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
            logMcpError(error, 'tools.updateIssue', { issueId });
            return {
                content: [
                    {
                        type: 'text',
                        text: `Failed to update issue in Workbit API: ${error.message}`,
                    },
                ],
            };
        }
    });
}
