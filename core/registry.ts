import { DB } from '../storage/sqlite';
import { ToolRegistryEntry } from '../types/mcp';

export class Registry {
  private db: DB;

  constructor() {
    this.db = new DB();
  }

  async init() {
    await this.db.init();
  }

  async updateServer(serverId: string, hash: string) {
    await this.db.run('INSERT OR REPLACE INTO servers (id, config_hash, last_sync) VALUES (?, ?, ?)', [serverId, hash, Date.now()]);
  }

  async addTools(serverId: string, tools: { name: string, signature: string, description: string }[]) {
    await this.db.run('DELETE FROM tools WHERE server_id = ?', [serverId]);
    for (const tool of tools) {
      await this.db.run('INSERT INTO tools (server_id, tool_name, signature, description) VALUES (?, ?, ?, ?)', [serverId, tool.name, tool.signature, tool.description]);
    }
  }

  async getAllTools(): Promise<ToolRegistryEntry[]> {
    return this.db.all<ToolRegistryEntry>('SELECT server_id as serverId, tool_name as toolName, signature, description FROM tools');
  }

  async getServers(): Promise<{ id: string, config_hash: string, last_sync: number }[]> {
    return this.db.all('SELECT * FROM servers');
  }

  async close() {
    this.db.close();
  }
}
