import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CamundaClient } from "../camunda-client.js";

export function register(server: McpServer, client: CamundaClient) {
  server.tool(
    "list_process_instances",
    "Listar instâncias de processo em execução no Camunda.",
    {
      processDefinitionKey: z.string().optional().describe("Filtrar por chave da definição"),
      businessKey: z.string().optional().describe("Filtrar por chave de negócio"),
      active: z.boolean().optional().describe("Apenas instâncias ativas"),
      suspended: z.boolean().optional().describe("Apenas instâncias suspensas"),
      maxResults: z.number().max(200).optional().default(50),
      firstResult: z.number().optional().default(0),
    },
    async (params) => {
      const result = await client.get("/process-instance", params);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_process_instance",
    "Obter detalhes de uma instância de processo específica.",
    {
      id: z.string().describe("ID da instância de processo"),
    },
    async ({ id }) => {
      const result = await client.get(`/process-instance/${id}`);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_activity_instances",
    "Obter árvore de atividades de uma instância (mostra onde o processo está atualmente).",
    {
      id: z.string().describe("ID da instância de processo"),
    },
    async ({ id }) => {
      const result = await client.get(`/process-instance/${id}/activity-instances`);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_process_instance_variables",
    "Obter todas as variáveis de uma instância de processo.",
    {
      id: z.string().describe("ID da instância de processo"),
    },
    async ({ id }) => {
      const result = await client.get(`/process-instance/${id}/variables`);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "delete_process_instance",
    "Deletar uma instância de processo. ATENÇÃO: esta ação é irreversível.",
    {
      id: z.string().describe("ID da instância de processo"),
      skipCustomListeners: z.boolean().optional().default(false).describe("Pular listeners customizados"),
      skipIoMappings: z.boolean().optional().default(false).describe("Pular mapeamentos de I/O"),
    },
    async ({ id, skipCustomListeners, skipIoMappings }) => {
      await client.del(`/process-instance/${id}`, {
        skipCustomListeners,
        skipIoMappings,
      });
      return { content: [{ type: "text" as const, text: `Instância ${id} deletada com sucesso.` }] };
    }
  );
}
