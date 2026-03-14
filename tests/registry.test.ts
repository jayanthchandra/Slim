import fs from 'fs';
import { Registry } from '../core/registry';
import { REGISTRY_DB } from '../storage/paths';

jest.mock('fs');

describe('JSON Registry', () => {
  const dbPath = REGISTRY_DB.replace('.db', '.json');

  beforeEach(() => {
    jest.clearAllMocks();
    (fs.existsSync as jest.Mock).mockReturnValue(false); // Default to no file existing
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
  });

  test('should initialize with an empty registry if no file exists', () => {
    const registry = new Registry();
    expect(registry.getAllTools()).toEqual([]);
  });

  test('should load an existing registry file', () => {
    const mockData = {
      servers: { 'test-server': { hash: '123' } },
      tools: [{ serverId: 'test-server', toolName: 'test_tool', signature: 'test()', description: '', lastUpdated: 0 }]
    };
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockData));

    const registry = new Registry();
    expect(registry.getServerHash('test-server')).toBe('123');
    expect(registry.getAllTools()).toHaveLength(1);
  });

  test('should add tools and update server hash', async () => {
    const registry = new Registry();
    await registry.updateServer('test-server', 'abc');
    await registry.addTools('test-server', [
      { toolName: 'tool1', signature: 'tool1()', description: 'desc1' }
    ]);
    
    const writeSpy = fs.writeFileSync as jest.Mock;
    expect(writeSpy).toHaveBeenCalledTimes(2);

    const finalState = JSON.parse(writeSpy.mock.calls[1][1]);
    expect(finalState.servers['test-server'].hash).toBe('abc');
    expect(finalState.tools[0].toolName).toBe('tool1');
  });

  test('should overwrite existing tools for a server on add', async () => {
    const registry = new Registry();
    await registry.addTools('test-server', [{ toolName: 'tool1', signature: 'tool1()', description: '' }]);
    await registry.addTools('test-server', [{ toolName: 'tool2', signature: 'tool2()', description: '' }]);

    const finalTools = registry.getAllTools();
    expect(finalTools).toHaveLength(1);
    expect(finalTools[0].toolName).toBe('tool2');
  });
});
