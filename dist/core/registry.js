"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Registry = void 0;
const fs_1 = __importDefault(require("fs"));
const paths_1 = require("../storage/paths"); // We'll reuse this path, but it will point to a .json file
class Registry {
    db;
    dbPath;
    constructor() {
        this.dbPath = paths_1.REGISTRY_DB.endsWith('.db') ? paths_1.REGISTRY_DB.replace('.db', '.json') : paths_1.REGISTRY_DB;
        this.db = this.load();
    }
    load() {
        if (fs_1.default.existsSync(this.dbPath)) {
            try {
                const content = fs_1.default.readFileSync(this.dbPath, 'utf-8');
                return JSON.parse(content);
            }
            catch (e) {
                // Corrupt file, start fresh
            }
        }
        return { servers: {}, tools: [] };
    }
    save() {
        fs_1.default.writeFileSync(this.dbPath, JSON.stringify(this.db, null, 2));
    }
    async init() {
        // No-op for JSON file
    }
    async close() {
        // No-op for JSON file
    }
    async updateServer(serverName, hash) {
        this.db.servers[serverName] = { hash };
        this.save();
    }
    async addTools(serverName, tools) {
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
    getServerHash(serverName) {
        return this.db.servers[serverName]?.hash || null;
    }
    async getServers() {
        return Object.entries(this.db.servers).map(([id, data]) => ({
            id,
            config_hash: data.hash
        }));
    }
    getAllTools() {
        return this.db.tools;
    }
}
exports.Registry = Registry;
