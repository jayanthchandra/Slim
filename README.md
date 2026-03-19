# <img src="slim.png" width="400" alt="slim logo">

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)

**slim** is a lightweight TypeScript-based extension for AI CLIs (Gemini, Qwen, Claude) that dramatically reduces Model Context Protocol (MCP) token usage by compressing tool exposure.

---

## 🚀 The Problem: Token Bloat
When you use multiple MCP servers, AI CLIs inject every single tool schema into the LLM prompt. For large servers like `github` or `filesystem`, this can consume **thousands of tokens** before you even start typing.

**Example Raw Exposure:**
- `read_file`, `write_file`, `list_directory`, `search_code`, `git_diff`, `create_issue`, `get_pull_request`... (50+ tools)

## 💎 The Solution: Skill Compression
**slim** consolidates an entire MCP server into a single **Skill Signature**. Instead of 50 schemas, the LLM sees one:

`github_tools(action, params)`

When the LLM calls `github_tools("create_issue", { ... })`, the **slim** runtime routes the call to the correct MCP tool. 

**Result: ~95% reduction in MCP-related token overhead.**

---

## 🛠 Features

- **Native CLI Detection:** Automatically identifies if you are running in Gemini, Qwen, or Claude environments.
- **Automated Discovery:** Scans your host CLI `settings.json` to find and connect to your MCP servers.
- **On-the-fly Generation:** Spawns MCP servers via JSON-RPC to fetch tool lists and generate skill definitions.
- **Safe Execution:** Manages MCP process lifecycles and standardizes routing via a local registry.
- **Zero Latency:** High-performance TypeScript implementation with minimal dependencies.

---

## 📦 Installation

1. **Clone and Build:**
   ```bash
   git clone https://github.com/your-repo/slim.git
   cd slim
   npm install
   npm run build
   ```

2. **Link Globally:**
   ```bash
   npm link
   ```

---

## 🚦 Usage

### 1. Initialize
Scan your host CLI settings and generate compressed skills.
```bash
slim init
```
*Note: You can specify a CLI manually with `--cli [gemini|qwen|claude]`.*

### 2. Inspect
View your generated skills and the actions they contain.
```bash
slim inspect
```

### 3. Usage in Prompt
Once initialized, you can reference the skills in your AI CLI:
> "Use `github_tools` to create a new issue for the bug we found."

---

## 📂 Project Structure

- `src/cli/`: Command handlers (`init`, `inspect`, `status`).
- `src/core/`: Business logic for MCP scanning, tool fetching, and skill generation.
- `src/storage/`: Path management and JSON persistence.
- `src/types/`: Shared TypeScript interfaces.
- `~/.slim/`: Local state directory where registries and schemas are stored.

---

## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) (coming soon) for details on our code of conduct and the process for submitting pull requests.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **ISC License**. See `LICENSE` for more information.

---
*Built with ❤️ for the AI Engineer community.*
