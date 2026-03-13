export type MCPTool = {
  name: string;
  description?: string;
  inputSchema?: {
    properties?: Record<string, any>;
    required?: string[];
  };
};

export type MCPServerConfig = {
  command: string;
  args?: string[];
  env?: Record<string, string>;
};

export type MCPConfig = {
  mcpServers: Record<string, MCPServerConfig>;
};

export type CompressedTool = {
  signature: string;
  description: string;
};

export type ToolRegistryEntry = {
  serverId: string;
  toolName: string;
  signature: string;
  description: string;
  lastUpdated: number;
};
