"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const paths_1 = require("./paths");
class DB {
    db;
    constructor() {
        this.db = new sqlite3_1.default.Database(paths_1.REGISTRY_DB);
    }
    async init() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run(`
          CREATE TABLE IF NOT EXISTS servers (
            id TEXT PRIMARY KEY,
            config_hash TEXT,
            last_sync INTEGER
          )
        `);
                this.db.run(`
          CREATE TABLE IF NOT EXISTS tools (
            server_id TEXT,
            tool_name TEXT,
            signature TEXT,
            description TEXT,
            FOREIGN KEY(server_id) REFERENCES servers(id)
          )
        `, (err) => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
            });
        });
    }
    async run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
    async all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err)
                    reject(err);
                else
                    resolve(rows);
            });
        });
    }
    close() {
        this.db.close();
    }
}
exports.DB = DB;
