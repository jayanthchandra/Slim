import { compressTool } from '../core/compressor';
import { MCPTool } from '../types/mcp';

describe('Compressor', () => {
  test('should generate a signature for a tool with parameters', () => {
    const tool: MCPTool = {
      name: 'create_issue',
      description: 'Create a GitHub issue',
      inputSchema: {
        properties: {
          repo: { type: 'string' },
          title: { type: 'string' },
          body: { type: 'string' }
        }
      }
    };
    const result = compressTool(tool);
    expect(result.signature).toBe('create_issue(repo,title,body)');
    expect(result.description).toBe('Create a GitHub issue');
  });

  test('should generate a signature for a tool without parameters', () => {
    const tool: MCPTool = {
      name: 'list_repos',
      description: 'List GitHub repositories'
    };
    const result = compressTool(tool);
    expect(result.signature).toBe('list_repos()');
  });

  test('should truncate long descriptions', () => {
    const tool: MCPTool = {
      name: 'test',
      description: 'This is a very long description that should be truncated because it exceeds sixty characters in length.'
    };
    const result = compressTool(tool);
    expect(result.description.length).toBeLessThanOrEqual(60);
    expect(result.description.endsWith('...')).toBe(true);
  });
});
