import fs from 'fs';
import path from 'path';
import { REGISTRY_DB } from '../storage/paths'; // We'll reuse this path, but it will point to a .json file
import { ToolRegistryEntry } from '../types/mcp';

interface JsonRegistry {
  servers: Record<string, { hash: string }>;
  tools: ToolRegistryEntry[];
}

export class Registry {
  private db: JsonRegistry;
  private dbPath: string;

  constructor() {
    this.dbPath = REGISTRY_DB.endsWith('.db') ? REGISTRY_DB.replace('.db', '.json') : REGISTRY_DB;
    this.db = this.load();
  }

  private load(): JsonRegistry {
    if (fs.existsSync(this.dbPath)) {
      try {
        const content = fs.readFileSync(this.dbPath, 'utf-8');
        return JSON.parse(content) as JsonRegistry;
      } catch (e) {
        // Corrupt file, start fresh
      }
    }
    return { servers: {}, tools: [] };
  }

  private save() {
    fs.writeFileSync(this.dbPath, JSON.stringify(this.db, null, 2));
  }

  async init() {
    // No-op for JSON file
  }

  async close() {
    // No-op for JSON file
  }

  async updateServer(serverName: string, hash: string) {
    this.db.servers[serverName] = { hash };
    this.save();
  }

  async addTools(serverName: string, tools: Omit<ToolRegistryEntry, 'serverId' | 'lastUpdated'>[]) {
    // Remove existing tools for this server
    this.db.tools = this.db.tools.filter(t => t.serverId !== serverName);

    // Add new tools
    const now = Date.now();
    for (const tool of tools) {
      this.db.tools.push({
        ...tool,
        serverId: serverName,
        lastUpdated: now,
      });
    }
    this.save();
  }

  getServerHash(serverName: string): string | null {
    return this.db.servers[serverName]?.hash || null;
  }

  async getServers(): Promise<{ id: string, config_hash: string }[]> {
    return Object.entries(this.db.servers).map(([id, data]) => ({
      id,
      config_hash: data.hash
    }));
  }

  getAllTools() {
    return this.db.tools;
  }
}
