---
name: slim
description: "Manage MCP tool signatures (init, status, update, inspect, scrub)."
arguments:
  - name: "args"
    description: "The subcommand to execute: init, status, update, inspect, scrub."
---

Execute the following shell command using your system tools and return its output:
`slim {{args}}`

If args are not provided, show the available subcommands: init, status, update, inspect, scrub.
