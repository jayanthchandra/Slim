import { computeHash } from '../core/hash';
import { MCPConfig } from '../types/mcp';

describe('Hash', () => {
  test('should generate a consistent SHA256 hash for a given config', () => {
    const config: MCPConfig = {
      mcpServers: {
        github: {
          command: 'npx',
          args: ['@modelcontextprotocol/server-github']
        }
      }
    };
    const hash1 = computeHash(config);
    const hash2 = computeHash(config);
    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64);
  });

  test('should change the hash if config changes', () => {
    const config1: MCPConfig = {
      mcpServers: {
        github: {
          command: 'npx',
          args: ['@modelcontextprotocol/server-github']
        }
      }
    };
    const config2: MCPConfig = {
      mcpServers: {
        github: {
          command: 'npx',
          args: ['@modelcontextprotocol/server-github', '--debug']
        }
      }
    };
    const hash1 = computeHash(config1);
    const hash2 = computeHash(config2);
    expect(hash1).not.toBe(hash2);
  });
});
