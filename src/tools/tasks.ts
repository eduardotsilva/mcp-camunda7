import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CamundaClient } from "../camunda-client.js";
import { toVariables } from "../types.js";

export function register(server: McpServer, client: CamundaClient) {
  server.tool(
    "list_tasks",
    "Listar tarefas de usuário (user tasks) no Camunda.",
    {
      assignee: z.string().optional().describe("Filtrar por responsável"),
      candidateGroup: z.string().optional().describe("Filtrar por grupo candidato"),
      processDefinitionKey: z.string().optional().describe("Filtrar por chave da definição de processo"),
      processInstanceId: z.string().optional().describe("Filtrar por ID da instância de processo"),
      name: z.string().optional().describe("Filtrar por nome da tarefa"),
      nameLike: z.string().optional().describe("Filtrar por nome (substring com %)"),
      maxResults: z.number().max(200).optional().default(50),
      firstResult: z.number().optional().default(0),
    },
    async ({ assignee, candidateGroup, processDefinitionKey, processInstanceId, name, nameLike, maxResults, firstResult }) => {
      const body: Record<string, unknown> = {};
      if (assignee !== undefined) body.assignee = assignee;
      if (candidateGroup !== undefined) body.candidateGroup = candidateGroup;
      if (processDefinitionKey !== undefined) body.processDefinitionKey = processDefinitionKey;
      if (processInstanceId !== undefined) body.processInstanceId = processInstanceId;
      if (name !== undefined) body.name = name;
      if (nameLike !== undefined) body.nameLike = nameLike;

      const result = await client.post(
        `/task?firstResult=${firstResult}&maxResults=${maxResults}`,
        body
      );
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_task",
    "Obter detalhes de uma tarefa específica.",
    {
      id: z.string().describe("ID da tarefa"),
    },
    async ({ id }) => {
      const result = await client.get(`/task/${id}`);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "complete_task",
    "Completar uma tarefa de usuário, opcionalmente fornecendo variáveis.",
    {
      id: z.string().describe("ID da tarefa"),
      variables: z
        .record(z.unknown())
        .optional()
        .describe("Variáveis para enviar ao completar (ex: {aprovado: true, comentario: 'ok'})"),
    },
    async ({ id, variables }) => {
      const body: Record<string, unknown> = {};
      if (variables) body.variables = toVariables(variables);
      await client.post(`/task/${id}/complete`, body);
      return { content: [{ type: "text" as const, text: `Tarefa ${id} completada com sucesso.` }] };
    }
  );

  server.tool(
    "claim_task",
    "Reivindicar (claim) uma tarefa para um usuário.",
    {
      id: z.string().describe("ID da tarefa"),
      userId: z.string().describe("ID do usuário que vai reivindicar"),
    },
    async ({ id, userId }) => {
      await client.post(`/task/${id}/claim`, { userId });
      return { content: [{ type: "text" as const, text: `Tarefa ${id} reivindicada por ${userId}.` }] };
    }
  );

  server.tool(
    "get_task_variables",
    "Obter as variáveis de uma tarefa específica.",
    {
      id: z.string().describe("ID da tarefa"),
    },
    async ({ id }) => {
      const result = await client.get(`/task/${id}/variables`);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );
}
