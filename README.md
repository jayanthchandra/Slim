# ⚡️ mcp-slim

![mcp-slim](./slim.png)

**mcp-slim** is an open-source developer tool designed to dramatically reduce the token usage of Model Context Protocol (MCP) tool schemas. It compresses verbose JSON schemas into lightweight "skill signatures," allowing your AI CLI (like Gemini or Claude) to handle more tools while keeping your context window focused and efficient.

---

## 🚀 The Problem
MCP tool schemas are often extremely verbose, consuming thousands of tokens just to describe a few tools. This leads to:
- Faster context window exhaustion.
- Increased latency.
- Higher costs for LLM API usage.

## 🛠 The Solution
`mcp-slim` reads your existing MCP configurations and generates **Skill Signatures**. Instead of a 20-line JSON object for a single tool, it produces a single-line signature:
`create_issue(repo, title, body)`

This results in an estimated **~90% reduction** in tool-related token overhead.

---

## ✨ Features
- **Zero-Modification**: Reads your MCP configs without changing them.
- **Native Integration**: Works as a native slash command (`/slim`) in Gemini and Claude CLIs.
- **Auto-Sync**: Background hooks keep your tool signatures in sync with your actual MCP servers.
- **Lightweight**: Built with TypeScript and SQLite for fast, local-only performance.
- **Transparent**: Inspect raw schemas and generated signatures at any time.

---

## 📦 Installation

### 1. Build and Link
```bash
git clone https://github.com/your-username/mcp-slim.git
cd mcp-slim
npm install
npm run build
npm link
```

### 2. Initialize
Run the initialization command to detect your MCP servers and generate the local registry.
```bash
slim init
```

## 📦 Installation as AI CLI Extension

Install `mcp-slim` natively in your favorite AI CLI using these commands:

<details>
<summary><b>♊️ Gemini CLI / 📜 Codex</b></summary>

```bash
# Install as a native extension
gemini extensions install https://github.com/your-username/mcp-slim
```
*Note: This automatically registers the `/slim` slash command.*
</details>

<details>
<summary><b>👤 Claude Code</b></summary>

```bash
# Add as a plugin
claude plugin add https://github.com/your-username/mcp-slim
```
*Note: This enables `/slim` as a native plugin command.*
</details>

<details>
<summary><b>🤖 Qwen CLI</b></summary>

```bash
# Install as a native extension
qwen extensions install https://github.com/your-username/mcp-slim
```
*Note: This enables `/slim` using the Qwen-native markdown command format.*
</details>

---

## 🤖 How to Setup in AI CLIs

Select your preferred AI CLI to see specific integration instructions for the `/slim` command.

<details>
<summary><b>♊️ Gemini CLI</b></summary>

Gemini CLI uses a `.toml` configuration file to map native slash commands to binaries.

1.  **Initialize**: Run `slim init` to generate the configuration file at `~/.mcp-slim/gemini.toml`.
2.  **Import**: Add the following line to your global `gemini.toml` or project configuration:
    ```toml
    import = "~/.mcp-slim/gemini.toml"
    ```
3.  **Use**: You can now type `/slim status` directly in your Gemini CLI session.
</details>

<details>
<summary><b>👤 Claude (Claude Code)</b></summary>

Claude Code (Anthropic's CLI) integrates with your system shell.

1.  **Alias**: `mcp-slim` automatically adds `alias /slim='slim'` to your `.zshrc` or `.bashrc` during `slim init`.
2.  **Reload**: Restart your terminal or run `source ~/.zshrc`.
3.  **Execution**: Claude can execute `/slim` via its shell capabilities. Simply type:
    > "Run /slim status"
</details>

<details>
<summary><b>🤖 Qwen (Shell Integration)</b></summary>

Qwen-based agents typically interact with the environment via shell execution tools.

1.  **Global Path**: Ensure the `slim` binary is in your system path (run `npm link`).
2.  **Alias Support**: If your agent environment supports shell aliases, the automatically created `/slim` alias will work.
3.  **Command**: You can invoke the tool as:
    ```bash
    slim init
    # or if aliased
    /slim status
    ```
</details>

<details>
<summary><b>📜 Codex / Terminal Agents</b></summary>

For other terminal-based LLM agents:

1.  **Command Discovery**: Provide the `mcp-slim` signatures to the agent by running `/slim inspect`.
2.  **Automation**: Add `slim update` to your session pre-hook to ensure the agent always has access to the most recent MCP tool signatures without the full JSON overhead.
</details>

---

## 🎮 Usage

Once integrated, you can use the following commands directly in your AI CLI or terminal:

| Command | Description |
| :--- | :--- |
| `/slim init` | Full initialization and registry build. |
| `/slim update` | Rebuild signatures if MCP config has changed. |
| `/slim status` | Show servers, tools, and estimated token savings. |
| `/slim inspect` | Display all currently generated signatures. |
| `/slim scrub` | Reset the system and delete local state. |

---

## 📂 Project Structure
- `cli/`: Command handlers and the main router.
- `core/`: Core logic for compression, hashing, and configuration.
- `storage/`: SQLite registry and file path management.
- `hooks/`: Background sync hooks.
- `tests/`: Comprehensive Jest test suite.

---

## 🛠 Development
To run tests:
```bash
npm test
```

To watch for changes during development:
```bash
npx tsc -w
```

---

## 📄 License
MIT License - feel free to use, modify, and distribute.

---

**Built with ❤️ for the MCP ecosystem.**
