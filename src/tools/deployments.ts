import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CamundaClient } from "../camunda-client.js";

export function register(server: McpServer, client: CamundaClient) {
  server.tool(
    "list_deployments",
    "Listar deployments no Camunda.",
    {
      name: z.string().optional().describe("Filtrar por nome exato"),
      nameLike: z.string().optional().describe("Filtrar por nome (substring com %)"),
      maxResults: z.number().max(200).optional().default(50),
      firstResult: z.number().optional().default(0),
    },
    async (params) => {
      const result = await client.get("/deployment", params);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "deploy_bpmn",
    "Fazer deploy de um arquivo BPMN no Camunda. Envie o conteúdo XML BPMN diretamente.",
    {
      name: z.string().describe("Nome do deployment"),
      bpmnXml: z.string().describe("Conteúdo XML BPMN completo"),
      enableDuplicateFiltering: z
        .boolean()
        .optional()
        .default(false)
        .describe("Evitar deploy duplicado se não houver mudanças"),
    },
    async ({ name, bpmnXml, enableDuplicateFiltering }) => {
      const formData = new FormData();
      formData.set("deployment-name", name);
      formData.set("deployment-source", "mcp-camunda7");
      formData.set(
        "enable-duplicate-filtering",
        String(enableDuplicateFiltering)
      );
      const blob = new Blob([bpmnXml], { type: "application/octet-stream" });
      formData.set("data", blob, `${name}.bpmn`);

      const result = await client.postMultipart("/deployment/create", formData);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );
}
