import fs from 'fs';
import path from 'path';
import { Registry } from '../core/registry';
import { SCHEMA_DIR, SKILL_DIR } from '../storage/paths';

export async function statusCommand() {
  const registry = new Registry();
  await registry.init();

  const servers = await registry.getServers();
  const tools = await registry.getAllTools();
  
  let originalBytes = 0;
  let compressedBytes = 0;

  for (const server of servers) {
    const schemaPath = path.join(SCHEMA_DIR, `${server.id}.json`);
    const skillPath = path.join(SKILL_DIR, `${server.id}.tools`);

    if (fs.existsSync(schemaPath)) {
      originalBytes += fs.statSync(schemaPath).size;
    }
    if (fs.existsSync(skillPath)) {
      compressedBytes += fs.statSync(skillPath).size;
    }
  }

  const reduction = originalBytes > 0 ? ((1 - (compressedBytes / originalBytes)) * 100).toFixed(1) : '0.0';

  console.log('Status Report:');
  console.log(`Servers: ${servers.length}`);
  console.log(`Tools: ${tools.length}`);
  console.log(`Estimated Token Savings: ~${reduction}%`);
  
  await registry.close();
}
