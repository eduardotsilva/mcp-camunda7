#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CamundaClient } from "./camunda-client.js";
import * as processDefinitions from "./tools/process-definitions.js";
import * as processInstances from "./tools/process-instances.js";
import * as tasks from "./tools/tasks.js";
import * as history from "./tools/history.js";
import * as deployments from "./tools/deployments.js";
import * as incidentsJobs from "./tools/incidents-jobs.js";
import * as engine from "./tools/engine.js";

const client = new CamundaClient();

const server = new McpServer({
  name: "camunda7-server",
  version: "1.0.0",
});

processDefinitions.register(server, client);
processInstances.register(server, client);
tasks.register(server, client);
history.register(server, client);
deployments.register(server, client);
incidentsJobs.register(server, client);
engine.register(server, client);

const transport = new StdioServerTransport();
await server.connect(transport);
