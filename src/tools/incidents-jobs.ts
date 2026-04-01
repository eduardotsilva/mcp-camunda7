import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CamundaClient } from "../camunda-client.js";

export function register(server: McpServer, client: CamundaClient) {
  server.tool(
    "list_incidents",
    "Listar incidentes no Camunda (erros em instâncias de processo).",
    {
      processInstanceId: z.string().optional().describe("Filtrar por ID da instância"),
      incidentType: z.string().optional().describe("Tipo de incidente (ex: failedJob, failedExternalTask)"),
      maxResults: z.number().max(200).optional().default(50),
      firstResult: z.number().optional().default(0),
    },
    async (params) => {
      const result = await client.get("/incident", params);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_jobs",
    "Listar jobs (tarefas assíncronas/timers) no Camunda.",
    {
      processInstanceId: z.string().optional().describe("Filtrar por ID da instância"),
      withRetriesLeft: z.boolean().optional().describe("Apenas jobs com retries restantes"),
      noRetriesLeft: z.boolean().optional().describe("Apenas jobs sem retries (falhados)"),
      maxResults: z.number().max(200).optional().default(50),
      firstResult: z.number().optional().default(0),
    },
    async (params) => {
      const result = await client.get("/job", params);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "set_job_retries",
    "Definir o número de retries de um job (útil para reprocessar jobs falhados).",
    {
      id: z.string().describe("ID do job"),
      retries: z.number().describe("Número de retries a definir"),
    },
    async ({ id, retries }) => {
      await client.put(`/job/${id}/retries`, { retries });
      return { content: [{ type: "text" as const, text: `Retries do job ${id} definidos para ${retries}.` }] };
    }
  );

  server.tool(
    "execute_job",
    "Executar um job manualmente.",
    {
      id: z.string().describe("ID do job"),
    },
    async ({ id }) => {
      await client.post(`/job/${id}/execute`);
      return { content: [{ type: "text" as const, text: `Job ${id} executado com sucesso.` }] };
    }
  );
}
