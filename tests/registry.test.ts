import fs from 'fs';
import path from 'path';

// Set environment variable BEFORE importing Registry
const testDbPath = path.join(__dirname, 'test-registry.db');
process.env.REGISTRY_DB = testDbPath;

import { Registry } from '../core/registry';

describe('Registry', () => {
  let registry: Registry;

  beforeAll(async () => {
    registry = new Registry();
    await registry.init();
  });

  afterAll(async () => {
    await registry.close();
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  test('should insert and retrieve a server', async () => {
    const serverId = 'test-server';
    const hash = 'abc-123';
    await registry.updateServer(serverId, hash);
    
    const servers = await registry.getServers();
    expect(servers.some(s => s.id === serverId && s.config_hash === hash)).toBe(true);
  });

  test('should add and retrieve tools', async () => {
    const serverId = 'test-server';
    const tools = [
      { name: 'tool1', signature: 'tool1()', description: 'desc1' },
      { name: 'tool2', signature: 'tool2(arg)', description: 'desc2' }
    ];
    await registry.addTools(serverId, tools);
    
    const allTools = await registry.getAllTools();
    const serverTools = allTools.filter(t => t.serverId === serverId);
    expect(serverTools).toHaveLength(2);
    expect(serverTools[0].toolName).toBe('tool1');
    expect(serverTools[1].signature).toBe('tool2(arg)');
  });
});
