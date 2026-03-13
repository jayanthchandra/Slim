import fs from 'fs';
import path from 'path';
import { MCP_SLASH_ROOT } from '../storage/paths';

export function generateGeminiConfig() {
  const tomlContent = `
[commands]
# Gemini CLI native slash commands for mcp-slim
"/slim init" = "slim init"
"/slim update" = "slim update"
"/slim status" = "slim status"
"/slim inspect" = "slim inspect"
"/slim scrub" = "slim scrub"

[hooks]
pre_session = "slim update"
`;

  const configPath = path.join(MCP_SLASH_ROOT, 'gemini.toml');
  fs.writeFileSync(configPath, tomlContent);
  return configPath;
}
