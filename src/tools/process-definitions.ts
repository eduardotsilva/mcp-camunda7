import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CamundaClient } from "../camunda-client.js";
import { toVariables } from "../types.js";

export function register(server: McpServer, client: CamundaClient) {
  server.tool(
    "list_process_definitions",
    "Listar definições de processo no Camunda. Use latestVersion=true para ver apenas a versão mais recente de cada processo.",
    {
      key: z.string().optional().describe("Filtrar por chave exata da definição"),
      name: z.string().optional().describe("Filtrar por nome exato"),
      nameLike: z.string().optional().describe("Filtrar por nome (substring, ex: %nome%)"),
      latestVersion: z.boolean().optional().describe("Retornar apenas a versão mais recente"),
      active: z.boolean().optional().describe("Filtrar por status ativo"),
      suspended: z.boolean().optional().describe("Filtrar por status suspenso"),
      maxResults: z.number().max(200).optional().default(50).describe("Máximo de resultados"),
      firstResult: z.number().optional().default(0).describe("Offset para paginação"),
    },
    async (params) => {
      const result = await client.get("/process-definition", params);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_process_definition_xml",
    "Obter o XML BPMN de uma definição de processo. Forneça id OU key.",
    {
      id: z.string().optional().describe("ID da definição de processo"),
      key: z.string().optional().describe("Chave da definição de processo (retorna a versão mais recente)"),
    },
    async ({ id, key }) => {
      if (!id && !key) {
        return { content: [{ type: "text" as const, text: "Erro: forneça 'id' ou 'key'" }], isError: true };
      }
      const path = id
        ? `/process-definition/${id}/xml`
        : `/process-definition/key/${key}/xml`;
      const result = await client.get<{ id: string; bpmn20Xml: string }>(path);

      let xml = result.bpmn20Xml;
      if (xml && xml.length > 100_000) {
        xml = xml.substring(0, 100_000) + "\n<!-- ... XML truncado (>100KB) -->";
      }
      return { content: [{ type: "text" as const, text: xml }] };
    }
  );

  server.tool(
    "start_process_instance",
    "Iniciar uma nova instância de processo. Forneça key OU id da definição.",
    {
      key: z.string().optional().describe("Chave da definição de processo"),
      id: z.string().optional().describe("ID da definição de processo"),
      variables: z
        .record(z.unknown())
        .optional()
        .describe("Variáveis iniciais do processo (ex: {nome: 'valor', quantidade: 10})"),
      businessKey: z.string().optional().describe("Chave de negócio para a instância"),
    },
    async ({ key, id, variables, businessKey }) => {
      if (!key && !id) {
        return { content: [{ type: "text" as const, text: "Erro: forneça 'key' ou 'id'" }], isError: true };
      }
      const path = key
        ? `/process-definition/key/${key}/start`
        : `/process-definition/${id}/start`;
      const body: Record<string, unknown> = {};
      if (variables) body.variables = toVariables(variables);
      if (businessKey) body.businessKey = businessKey;
      const result = await client.post(path, body);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );
}
