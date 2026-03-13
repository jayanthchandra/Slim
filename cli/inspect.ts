import fs from 'fs';
import path from 'path';
import { Registry } from '../core/registry';
import { SKILL_DIR } from '../storage/paths';

export async function inspectCommand() {
  const registry = new Registry();
  await registry.init();

  const servers = await registry.getServers();

  if (servers.length === 0) {
    console.log('No servers found.');
    await registry.close();
    return;
  }

  for (const server of servers) {
    const skillPath = path.join(SKILL_DIR, `${server.id}.tools`);
    if (fs.existsSync(skillPath)) {
      console.log(fs.readFileSync(skillPath, 'utf-8'));
      console.log(); // extra newline for separation
    }
  }

  await registry.close();
}
