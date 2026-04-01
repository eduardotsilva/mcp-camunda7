import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CamundaClient } from "../camunda-client.js";

export function register(server: McpServer, client: CamundaClient) {
  server.tool(
    "list_history_process_instances",
    "Consultar instâncias de processo históricas (finalizadas ou em andamento).",
    {
      processDefinitionKey: z.string().optional().describe("Filtrar por chave da definição"),
      finished: z.boolean().optional().describe("Apenas finalizadas"),
      unfinished: z.boolean().optional().describe("Apenas em andamento"),
      startedAfter: z.string().optional().describe("Iniciadas após (ISO 8601, ex: 2024-01-01T00:00:00.000+0000)"),
      startedBefore: z.string().optional().describe("Iniciadas antes (ISO 8601)"),
      maxResults: z.number().max(200).optional().default(50),
      firstResult: z.number().optional().default(0),
    },
    async (params) => {
      const result = await client.get("/history/process-instance", params);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_history_activity_instances",
    "Consultar atividades históricas de instâncias de processo.",
    {
      processInstanceId: z.string().optional().describe("Filtrar por ID da instância"),
      activityType: z.string().optional().describe("Tipo de atividade (ex: userTask, serviceTask, startEvent)"),
      finished: z.boolean().optional().describe("Apenas finalizadas"),
      maxResults: z.number().max(200).optional().default(50),
      firstResult: z.number().optional().default(0),
    },
    async (params) => {
      const result = await client.get("/history/activity-instance", params);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_history_tasks",
    "Consultar tarefas históricas.",
    {
      processInstanceId: z.string().optional().describe("Filtrar por ID da instância"),
      taskDefinitionKey: z.string().optional().describe("Filtrar por chave da definição da tarefa"),
      finished: z.boolean().optional().describe("Apenas finalizadas"),
      maxResults: z.number().max(200).optional().default(50),
      firstResult: z.number().optional().default(0),
    },
    async (params) => {
      const result = await client.get("/history/task", params);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );
}
