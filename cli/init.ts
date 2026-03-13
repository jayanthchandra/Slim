import fs from 'fs';
import path from 'path';
import { ensureDirs, SKILL_DIR } from '../storage/paths';
import { readConfig } from '../core/config-reader';
import { computeHash, saveHash } from '../core/hash';
import { Registry } from '../core/registry';
import { fetchSchemas, saveSchemas } from '../core/schema-fetcher';
import { compressTool } from '../core/compressor';
import { CompressedTool } from '../types/mcp';
import { installPrehook } from '../core/hook-installer';
import { generateGeminiConfig, generateQwenConfig, generateClaudeConfig } from '../core/cli-config-generator';

export async function initCommand() {
  ensureDirs();
  
  const config = readConfig();
  if (!config) {
    console.error('No MCP configuration found.');
    return;
  }

  const hash = computeHash(config);
  saveHash(hash);
  
  const registry = new Registry();
  await registry.init();

  let totalServers = 0;
  let totalTools = 0;
  let originalSize = 0;
  let compressedSize = 0;

  for (const [serverName, serverConfig] of Object.entries(config.mcpServers)) {
    console.log(`Processing server: ${serverName}...`);
    totalServers++;
    
    // update registry for server
    await registry.updateServer(serverName, computeHash({ mcpServers: { [serverName]: serverConfig } }));

    const tools = await fetchSchemas(serverName, serverConfig);
    if (tools.length === 0) {
       console.log(`  No tools found for ${serverName}.`);
       continue;
    }
    
    // Save raw schema (as fetched/simulated)
    saveSchemas(serverName, tools);

    const compressedTools: CompressedTool[] = [];
    const toolEntries = [];

    let skillFileContent = `${serverName}\n`;
    
    for (const tool of tools) {
      totalTools++;
      originalSize += JSON.stringify(tool).length;
      
      const compressed = compressTool(tool);
      compressedSize += compressed.signature.length + compressed.description.length;
      
      compressedTools.push(compressed);
      toolEntries.push({
          name: tool.name, 
          signature: compressed.signature, 
          description: compressed.description
      });
      
      skillFileContent += `${compressed.signature}\n`;
    }

    // Write skill file
    const skillPath = path.join(SKILL_DIR, `${serverName}.tools`);
    fs.writeFileSync(skillPath, skillFileContent);

    // Update registry tools
    await registry.addTools(serverName, toolEntries);
  }

  await registry.close();

  const reduction = originalSize > 0 ? ((1 - (compressedSize / originalSize)) * 100).toFixed(1) : '0.0';
  
  console.log('\nInitialization Complete.');
  console.log(`Servers found: ${totalServers}`);
  console.log(`Tools found: ${totalTools}`);
  console.log(`Token reduction estimate: ~${reduction}%`);

  const configPath = generateGeminiConfig();
  generateQwenConfig();
  generateClaudeConfig();
  console.log(`\nConfigurations generated for Gemini, Qwen, and Claude in: ${path.dirname(configPath)}`);

  const hookProfile = installPrehook();
  console.log('\n--- Setup Instructions ---');
  console.log('To enable the global "slim" command (required for Gemini CLI slash commands):');
  console.log('1. Run: npm link (in this directory)');
  console.log('2. Restart your terminal.');
  
  if (hookProfile === 'already-installed') {
    console.log('\nPre-hook is already configured in your shell.');
  } else if (hookProfile) {
    console.log(`\nSuccessfully registered pre-hook in ${hookProfile}.`);
    console.log('To activate it, run "npm link" in this directory, and restart your terminal.');
  } else {
    console.log('\nCould not automatically install pre-hook. Please add "slim update > /dev/null 2>&1 &" to your shell profile.');
  }
}
