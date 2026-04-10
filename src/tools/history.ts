import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CamundaClient } from "../camunda-client.js";

export function register(server: McpServer, client: CamundaClient) {
  server.tool(
    "list_history_process_instances",
    "Consultar instâncias de processo históricas (finalizadas ou em andamento).",
    {
      processDefinitionKey: z.string().optional().describe("Filtrar por chave da definição"),
      businessKey: z.string().optional().describe("Filtrar por chave de negócio"),
      finished: z.boolean().optional().describe("Apenas finalizadas"),
      unfinished: z.boolean().optional().describe("Apenas em andamento"),
      startedAfter: z.string().optional().describe("Iniciadas após (ISO 8601, ex: 2024-01-01T00:00:00.000+0000)"),
      startedBefore: z.string().optional().describe("Iniciadas antes (ISO 8601)"),
      maxResults: z.number().max(200).optional().default(50),
      firstResult: z.number().optional().default(0),
    },
    async ({ processDefinitionKey, businessKey, finished, unfinished, startedAfter, startedBefore, maxResults, firstResult }) => {
      const body: Record<string, unknown> = {};
      if (processDefinitionKey !== undefined) body.processDefinitionKey = processDefinitionKey;
      if (businessKey !== undefined) body.businessKey = businessKey;
      if (finished !== undefined) body.finished = finished;
      if (unfinished !== undefined) body.unfinished = unfinished;
      if (startedAfter !== undefined) body.startedAfter = startedAfter;
      if (startedBefore !== undefined) body.startedBefore = startedBefore;

      const result = await client.post(
        `/history/process-instance?firstResult=${firstResult}&maxResults=${maxResults}`,
        body
      );
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
    async ({ processInstanceId, activityType, finished, maxResults, firstResult }) => {
      const body: Record<string, unknown> = {};
      if (processInstanceId !== undefined) body.processInstanceId = processInstanceId;
      if (activityType !== undefined) body.activityType = activityType;
      if (finished !== undefined) body.finished = finished;

      const result = await client.post(
        `/history/activity-instance?firstResult=${firstResult}&maxResults=${maxResults}`,
        body
      );
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
    async ({ processInstanceId, taskDefinitionKey, finished, maxResults, firstResult }) => {
      const body: Record<string, unknown> = {};
      if (processInstanceId !== undefined) body.processInstanceId = processInstanceId;
      if (taskDefinitionKey !== undefined) body.taskDefinitionKey = taskDefinitionKey;
      if (finished !== undefined) body.finished = finished;

      const result = await client.post(
        `/history/task?firstResult=${firstResult}&maxResults=${maxResults}`,
        body
      );
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );
}
