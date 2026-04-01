# mcp-camunda7

MCP (Model Context Protocol) server for **Camunda 7 REST API**. Enables AI assistants like Claude to interact with Camunda 7 process engines — managing process definitions, instances, tasks, history, deployments, incidents, and more.

## Quick Start

### Claude Code (CLI)

```bash
claude mcp add camunda7-server -s user \
  -e CAMUNDA_BASE_URL=http://localhost:8080/engine-rest \
  -e CAMUNDA_USERNAME=demo \
  -e CAMUNDA_PASSWORD=demo \
  -- npx mcp-camunda7
```

### Claude Desktop / JSON config

Add to your MCP configuration (`.mcp.json`, `claude_desktop_config.json`, or `settings.json`):

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

### Global install (alternative)

```bash
npm install -g mcp-camunda7
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `CAMUNDA_BASE_URL` | Yes | Camunda 7 REST API base URL (e.g. `http://localhost:8080/engine-rest`) |
| `CAMUNDA_USERNAME` | No | Username for Basic Auth |
| `CAMUNDA_PASSWORD` | No | Password for Basic Auth |

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

## Usage Examples

Once installed, you can ask Claude things like:

- *"List all deployed process definitions"*
- *"Show me running instances of the invoice process"*
- *"What tasks are assigned to user john?"*
- *"Complete task X with variable approved=true"*
- *"Show the BPMN XML for process definition invoice"*
- *"Are there any incidents in the engine?"*
- *"Deploy this BPMN file to Camunda"*
- *"Show the history of completed process instances from the last 7 days"*

## How It Works

This MCP server acts as a bridge between AI assistants (via the Model Context Protocol) and the Camunda 7 REST API. It translates natural language requests into REST API calls, allowing you to manage your BPM engine conversationally.

```
Claude / AI Assistant  <-->  MCP Protocol  <-->  mcp-camunda7  <-->  Camunda 7 REST API
```

## Development

```bash
git clone https://github.com/eduardotsilva/mcp-camunda7.git
cd mcp-camunda7
npm install
npm run build
npm start
```

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

MIT
