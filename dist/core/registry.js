"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Registry = void 0;
const sqlite_1 = require("../storage/sqlite");
class Registry {
    db;
    constructor() {
        this.db = new sqlite_1.DB();
    }
    async init() {
        await this.db.init();
    }
    async updateServer(serverId, hash) {
        await this.db.run('INSERT OR REPLACE INTO servers (id, config_hash, last_sync) VALUES (?, ?, ?)', [serverId, hash, Date.now()]);
    }
    async addTools(serverId, tools) {
        await this.db.run('DELETE FROM tools WHERE server_id = ?', [serverId]);
        for (const tool of tools) {
            await this.db.run('INSERT INTO tools (server_id, tool_name, signature, description) VALUES (?, ?, ?, ?)', [serverId, tool.name, tool.signature, tool.description]);
        }
    }
    async getAllTools() {
        return this.db.all('SELECT server_id as serverId, tool_name as toolName, signature, description FROM tools');
    }
    async getServers() {
        return this.db.all('SELECT * FROM servers');
    }
    async close() {
        this.db.close();
    }
}
exports.Registry = Registry;
