import fs from 'fs';
import path from 'path';
import os from 'os';

export function installPrehook(): string | null {
  const home = os.homedir();
  const shell = process.env.SHELL || '';
  let profile = '';

  if (shell.includes('zsh')) {
    profile = path.join(home, '.zshrc');
  } else if (shell.includes('bash')) {
    profile = fs.existsSync(path.join(home, '.bash_profile')) 
      ? path.join(home, '.bash_profile') 
      : path.join(home, '.bashrc');
  }

  if (!profile || !fs.existsSync(profile)) {
    return null;
  }

  // Add pre-hook and alias
  const hookCommand = `\n# mcp-slim prehook\nif command -v slim >/dev/null 2>&1; then\n  slim update > /dev/null 2>&1 &\n  alias /slim='slim'\nfi\n`;

  try {
    const content = fs.readFileSync(profile, 'utf-8');
    if (!content.includes('mcp-slim prehook')) {
      fs.appendFileSync(profile, hookCommand);
      return profile;
    }
    return 'already-installed';
  } catch (e) {
    console.error(`Failed to update shell profile ${profile}:`, e);
    return null;
  }
}
