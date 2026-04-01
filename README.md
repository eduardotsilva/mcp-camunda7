# mcp-camunda7

MCP (Model Context Protocol) server for **Camunda 7 REST API**. Enables AI assistants like Claude to interact with Camunda 7 process engines — managing process definitions, instances, tasks, history, deployments, incidents, and more.

## Installation

```bash
npx mcp-camunda7
```

### Claude Code / Claude Desktop

Add to your MCP configuration (`.mcp.json` or Claude Desktop settings):

```json
{
  "mcpServers": {
    "camunda7": {
      "command": "npx",
      "args": ["-y", "mcp-camunda7"],
      "env": {
        "CAMUNDA_BASE_URL": "http://localhost:8080/engine-rest",
        "CAMUNDA_USERNAME": "demo",
        "CAMUNDA_PASSWORD": "demo"
      }
    }
  }
}
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `CAMUNDA_BASE_URL` | Yes | Camunda 7 REST API base URL (e.g. `http://localhost:8080/engine-rest`) |
| `CAMUNDA_USERNAME` | Yes | Username for Basic Auth |
| `CAMUNDA_PASSWORD` | Yes | Password for Basic Auth |

## Available Tools (23)

### Process Definitions
- **list_process_definitions** — List process definitions with filtering by key, name, version, and status
- **get_process_definition_xml** — Retrieve BPMN XML of a process definition
- **start_process_instance** — Start a new process instance with variables and business key

### Process Instances
- **list_process_instances** — List running instances with filtering by definition key, business key, status
- **get_process_instance** — Get details of a specific process instance
- **get_activity_instances** — Get the activity tree (current execution state)
- **get_process_instance_variables** — Retrieve all variables from a process instance
- **delete_process_instance** — Delete a process instance

### User Tasks
- **list_tasks** — List user tasks with filtering by assignee, group, process
- **get_task** — Get task details
- **complete_task** — Complete a task with optional variables
- **claim_task** — Claim/assign a task to a user
- **get_task_variables** — Retrieve task variables

### History
- **list_history_process_instances** — Query historical process instances
- **list_history_activity_instances** — Query historical activities
- **list_history_tasks** — Query historical tasks

### Deployments
- **list_deployments** — List deployments with filtering
- **deploy_bpmn** — Deploy a BPMN process definition

### Incidents & Jobs
- **list_incidents** — List process incidents/errors
- **list_jobs** — List asynchronous jobs and timers
- **set_job_retries** — Set retry count for failed jobs
- **execute_job** — Manually execute a job

### Engine
- **get_engine_info** — Retrieve engine name and version

## Development

```bash
git clone https://github.com/eduardotsilva/mcp-camunda7.git
cd mcp-camunda7
npm install
npm run build
```

## License

MIT
