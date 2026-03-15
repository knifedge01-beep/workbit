import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerGetProjectTool } from "./tools/getProject.js";
import { registerGetIssueTool } from "./tools/getIssue.js";
import { registerCreateIssueTool } from "./tools/createIssue.js";
import { registerCreateProjectTool } from "./tools/createProject.js";
import { registerCreateMilestoneTool } from "./tools/createMilestone.js";
import { registerUpdateIssueTool } from "./tools/updateIssue.js";
import { registerUpdateProjectTool } from "./tools/updateProject.js";
import { registerUpdateMilestoneTool } from "./tools/updateMilestone.js";
import { initLogging, logMcpError } from "./logging.js";
const server = new McpServer({
    name: "workbit",
    version: "1.0.0",
});
registerGetProjectTool(server);
registerGetIssueTool(server);
registerCreateIssueTool(server);
registerCreateProjectTool(server);
registerCreateMilestoneTool(server);
registerUpdateIssueTool(server);
registerUpdateProjectTool(server);
registerUpdateMilestoneTool(server);
async function main() {
    initLogging();
    const transport = new StdioServerTransport();
    await server.connect(transport);
    // Keep a stderr message for quick diagnostics in dev
    console.error("Workbit MCP Server running on stdio");
}
main().catch((error) => {
    logMcpError(error, "mcp.main");
    console.error("Fatal error in main():", error);
    process.exit(1);
});
