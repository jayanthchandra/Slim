import { slimInit } from './cli/slim-init.js';
import { slimInspect } from './cli/slim-inspect.js';

async function main() {
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
      console.log('Status command coming soon...');
      break;
    case 'update':
      console.log('Update command coming soon...');
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
