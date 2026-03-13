import { initCommand } from './init';
import { updateCommand } from './update';
import { scrubCommand } from './scrub';
import { statusCommand } from './status';
import { inspectCommand } from './inspect';

export async function router(args: string[]) {
  // args might be ["/slim", "init"] or ["init"]
  if (args.length === 0) {
    console.log(`
mcp-slim - Compress MCP tool schemas into signatures

Usage: slim <command>

Available commands:
  init     Initialize and fetch MCP tools
  update   Sync changes and refresh signatures
  status   Show token reduction stats
  inspect  Visualize tool signatures
  scrub    Reset all local state
    `);
    return;
  }
  
  let command = args[0];
  
  if (command === '/slim' || command === '/slash') {
    command = args[1];
  }

  switch (command) {
    case 'init':
      await initCommand();
      break;
    case 'update':
      await updateCommand();
      break;
    case 'scrub':
      scrubCommand();
      break;
    case 'status':
      await statusCommand();
      break;
    case 'inspect':
      await inspectCommand();
      break;
    default:
      console.log('Unknown command. Available commands: init, update, scrub, status, inspect');
      break;
  }
}
