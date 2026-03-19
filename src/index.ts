#!/usr/bin/env node
import { slimInit } from './cli/slim-init.js';
import { slimInspect } from './cli/slim-inspect.js';
import { slimStatus } from './cli/slim-status.js';
import { slimUpdate } from './cli/slim-update.js';
import { executeSkill } from './core/skill-router.js';
import { getSlimBinDir } from './storage/paths.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function bootstrap() {
  const binDir = getSlimBinDir();
  const currentDir = path.resolve(__dirname, '..'); // Assuming we are in dist/
  
  // If we are not running from the centralized bin dir, sync and redirect
  if (!__dirname.startsWith(binDir)) {
    console.log('🚀 Bootstrapping slim to ~/.slim/bin...');
    
    const filesToSync = ['dist', 'commands', 'hooks', 'gemini-extension.json', 'qwen-extension.json', 'claude-extension.json', 'README.md', 'slim.png'];
    
    for (const file of filesToSync) {
      const src = path.join(currentDir, file);
      const dest = path.join(binDir, '..', file); // Sync to ~/.slim/ root to keep structure
      
      if (fs.existsSync(src)) {
         // Using cp -r for simplicity in a shell command or recursive fs copy
         fs.cpSync(src, dest, { recursive: true, force: true });
      }
    }

    // Re-run the command from the centralized location
    const targetScript = path.join(binDir, 'index.js');
    const result = spawnSync('node', [targetScript, ...process.argv.slice(2)], {
      stdio: 'inherit',
      env: process.env
    });
    process.exit(result.status ?? 0);
  }
}

async function main() {
  // First, ensure we are running from the centralized location
  await bootstrap();

  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'init':
      await slimInit();
      break;
    case 'inspect':
      await slimInspect();
      break;
    case 'status':
      await slimStatus();
      break;
    case 'update':
      await slimUpdate();
      break;
    case 'execute':
      const [skill, action, paramsJson] = args.slice(1);
      if (!skill || !action || !paramsJson) {
        console.error('Usage: slim execute <skill> <action> <params_json>');
        process.exit(1);
      }
      try {
        const params = JSON.parse(paramsJson);
        const result = await executeSkill(skill, action, params);
        console.log(JSON.stringify(result, null, 2));
      } catch (e: any) {
        console.error(`Execution error: ${e.message}`);
        process.exit(1);
      }
      break;
    default:
      console.log(`
Usage: slim <command> [options]

Commands:
  init      Initialize slim and generate skills from MCP servers
  inspect   View generated skills and actions
  status    Show token usage and compression reports
  update    Sync changes from host CLI settings

Options:
  --cli <name>  Manually specify CLI (gemini, qwen, claude)
      `);
      break;
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
