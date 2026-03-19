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

  // Default fallback or error?
  // For now, default to 'gemini' if nothing found, or throw?
  // Let's throw to be safe, so user knows they need to specify.
  throw new Error('Could not detect CLI. Please use --cli [gemini|qwen|claude] or set env vars.');
}
