import { detectCli } from '../core/cli-detector.js';
import { scanMcpServers } from '../core/mcp-scanner.js';
import { fetchTools } from '../core/schema-fetcher.js';
import { MCPTool, SkillDefinition } from '../types/mcp-types.js';
import { promises as fs } from 'fs';
import * as path from 'path';
import { generateSkill } from '../core/skill-generator.js';

async function generateSkillDescription(skill: SkillDefinition, tools: MCPTool[]): Promise<string> {
    let description = `This skill provides tools for interacting with the ${skill.server} service.`;
    description += ` It includes ${tools.length} tools for a variety of operations.`;
    description += ` Use this skill when you want to perform tasks related to ${skill.server}.`;
    return description;
}

async function generateToolDescription(tool: MCPTool): Promise<string> {
  // Use the tool's existing description as the base.
  let llmDescription = tool.description || `The \`${tool.name}\` tool is used to perform a specific operation.`;

  // Add more detail about when to use the tool, based on its name and schema.
  if (tool.name.includes('fetch') || tool.name.includes('get') || tool.name.includes('read')) {
    llmDescription += ` Use this tool when you need to retrieve or access data.`;
  } else if (tool.name.includes('create') || tool.name.includes('add') || tool.name.includes('write')) {
    llmDescription += ` Use this tool when you need to create or add new data.`;
  } else if (tool.name.includes('update') || tool.name.includes('modify')) {
    llmDescription += ` Use this tool to update or modify existing data.`;
  } else if (tool.name.includes('delete') || tool.name.includes('remove')) {
    llmDescription += ` Use this tool to delete or remove data.`;
  }

  // Describe the parameters.
  if (tool.inputSchema && tool.inputSchema.properties) {
    const params = tool.inputSchema.properties;
    const paramNames = Object.keys(params);
    if (paramNames.length > 0) {
      llmDescription += ' It accepts the following parameters:\n';
      for (const paramName of paramNames) {
        const paramInfo = params[paramName];
        const paramType = paramInfo.type || 'any';
        const paramDescription = paramInfo.description || `The \`${paramName}\` parameter.`;
        llmDescription += `  - \`${paramName}\` (${paramType}): ${paramDescription}\n`;
      }
    }
  }

  // Add requirements if any can be inferred.
  if (tool.name.includes('git')) {
    llmDescription += ' Requires the `git` command-line tool to be installed.';
  }

  return llmDescription;
}

export async function slimDoc() {
  try {
    const cli = detectCli();
    console.log(`\nGenerating documentation for ${cli}...\n`);

    const servers = await scanMcpServers(cli);
    const serverNames = Object.keys(servers);

    if (serverNames.length === 0) {
      console.log('No MCP servers found.');
      return;
    }

    const docsDir = path.join(process.cwd(), 'docs');
    await fs.mkdir(docsDir, { recursive: true });

    for (const name of serverNames) {
      const config = servers[name];
      process.stdout.write(`⏳ Processing ${name}... `);

      const tools = await fetchTools(name, config);
      if (tools.length === 0) {
        console.log('❌ (No tools found)');
        continue;
      }

      const skill = generateSkill(name, tools);
      const skillDescription = await generateSkillDescription(skill, tools);

      let markdownContent = `\`\`\`yaml\n---\nname: ${skill.skill}\ndescription: ${skillDescription}\n---\n\`\`\`\n\n`;
      markdownContent += `# ${name}\n\n`;
      markdownContent += `This document describes the skills and tools available from the **${name}** MCP server.\n\n`;
      markdownContent += `## Tools\n\n`;

      for (const tool of tools) {
        const toolDescription = await generateToolDescription(tool);
        markdownContent += `\`\`\`yaml\n---\nname: ${tool.name}\ndescription: ${toolDescription}\n---\n\`\`\`\n\n`;
      }

      const docPath = path.join(docsDir, `skill.${name}.md`);
      await fs.writeFile(docPath, markdownContent);

      console.log(`\r✅ Generated documentation for ${name}`);
    }

    console.log(`\n✨ Documentation generation complete!`);
    console.log(`Files saved in: ${docsDir}`);
    console.log(`--------------------------\n`);

  } catch (error: any) {
    console.error(`Error during documentation generation: ${error.message}`);
    process.exit(1);
  }
}
