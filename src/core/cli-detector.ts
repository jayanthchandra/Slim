export function detectCli(): string {
  // 1. Check arguments
  const args = process.argv.slice(2);
  const cliFlagIndex = args.indexOf('--cli');
  if (cliFlagIndex !== -1 && args[cliFlagIndex + 1]) {
    return args[cliFlagIndex + 1];
  }

  // 2. Check environment variables
  if (process.env.GEMINI_CLI) return 'gemini';
  if (process.env.QWEN_CLI) return 'qwen';
  if (process.env.CLAUDE_CLI) return 'claude';

  // 3. Check installation path (e.g., ~/.gemini/extensions/slim/...)
  const currentPath = process.argv[1] || '';
  if (currentPath.includes('.gemini')) return 'gemini';
  if (currentPath.includes('.qwen')) return 'qwen';
  if (currentPath.includes('.claude')) return 'claude';

  // Default fallback or error
  throw new Error('Could not detect CLI. Please use --cli [gemini|qwen|claude] or set env vars.');
}
