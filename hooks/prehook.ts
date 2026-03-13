import { readConfig } from '../core/config-reader';
import { computeHash, loadHash } from '../core/hash';
import { updateCommand } from '../cli/update';

export async function prehook() {
  const config = readConfig();
  if (!config) return;

  const currentHash = computeHash(config);
  const storedHash = loadHash();

  if (currentHash !== storedHash) {
    console.log('Configuration change detected. Running update...');
    await updateCommand();
  }
}

// Allow running directly if executed as script
if (require.main === module) {
  prehook().catch(console.error);
}
