---
name: slim
description: "Manage MCP tool signatures (init, status, update, inspect, scrub)."
arguments:
  - name: "args"
    description: "The subcommand to execute: init, status, update, inspect, scrub."
---

I need to execute a command for the `mcp-slim` extension.

1. **Check the internal extension path first**: `~/.mcp-slim/skills/[server].tools` (Just kidding, for the actual command runner it's `~/.gemini/extensions/mcp-slim/dist/index.js`, or `~/.qwen/extensions/mcp-slim/dist/index.js`, or `~/.claude/extensions/mcp-slim/dist/index.js`, or `~/.codex/extensions/mcp-slim/dist/index.js`). 
   - A good rule of thumb: check `~/.<your_cli_name>/extensions/mcp-slim/dist/index.js`.
2. **If found**, execute: `node [path-to-index.js] {{args}}`
3. **If not found**, search the workspace for `mcp-slim/dist/index.js` and execute with node.
4. If still not found, try: `slim {{args}}`

Return the final output.
