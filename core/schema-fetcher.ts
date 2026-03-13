import fs from 'fs';
import path from 'path';
import { MCPServerConfig, MCPTool } from '../types/mcp';
import { SCHEMA_DIR } from '../storage/paths';

export async function fetchSchemas(serverName: string, config: MCPServerConfig): Promise<MCPTool[]> {
  // For V1, we assume schemas might be provided externally or we simulate a fetch for known types.
  // In a real implementation, this would connect to the MCP server via stdio.
  
  const schemaPath = path.join(SCHEMA_DIR, `${serverName}.json`);
  
  if (fs.existsSync(schemaPath)) {
    try {
      const content = fs.readFileSync(schemaPath, 'utf-8');
      const data = JSON.parse(content);
      if (Array.isArray(data)) return data as MCPTool[];
      if (data.tools) return data.tools as MCPTool[];
    } catch (e) {
      console.error(`Failed to read schema for ${serverName}`, e);
    }
  }

  // Fallback/Mock for demonstration if 'github'
  if (serverName === 'github') {
    return [
      {
        name: "create_issue",
        description: "Create GitHub issue",
        inputSchema: {
          properties: {
            repo: {"type":"string"},
            title: {"type":"string"},
            body: {"type":"string"}
          }
        }
      },
      {
         name: "list_issues",
         description: "List issues in a repository",
         inputSchema: {
             properties: {
                 repo: {"type": "string"}
             }
         }
      }
    ];
  }

  return [];
}

export function saveSchemas(serverName: string, tools: MCPTool[]) {
    const schemaPath = path.join(SCHEMA_DIR, `${serverName}.json`);
    fs.writeFileSync(schemaPath, JSON.stringify(tools, null, 2));
}
