import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CamundaClient } from "../camunda-client.js";

export function register(server: McpServer, client: CamundaClient) {
  server.tool(
    "get_engine_info",
    "Obter informações do engine Camunda (nome e versão).",
    {},
    async () => {
      const result = await client.get("/engine");
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );
}
