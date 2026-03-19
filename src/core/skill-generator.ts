import { MCPTool, SkillDefinition } from '../types/mcp-types.js';

export function generateSkill(serverName: string, tools: MCPTool[]): SkillDefinition {
  const skillName = `${serverName.replace(/-/g, '_')}_tools`;
  const toolNames = tools.map(t => t.name);

  return {
    skill: skillName,
    server: serverName,
    signature: `${skillName}(action, params)`,
    actions: toolNames,
    description: `Operations provided by ${serverName} MCP server`
  };
}
