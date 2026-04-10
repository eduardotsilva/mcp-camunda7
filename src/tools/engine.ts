import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CamundaClient } from "../camunda-client.js";

export function register(server: McpServer, client: CamundaClient) {
  server.tool(
    "get_engine_info",
    "Obter informações do engine Camunda (nome, versão e URL conectada).",
    {},
    async () => {
      const engines = await client.get("/engine");
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            baseUrl: client.getBaseUrl(),
            engines,
          }, null, 2)
        }]
      };
    }
  );
}
