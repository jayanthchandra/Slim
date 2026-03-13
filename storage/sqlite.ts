import sqlite3 from 'sqlite3';
import { REGISTRY_DB } from './paths';

export class DB {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(REGISTRY_DB);
  }

  async init() {
    return new Promise<void>((resolve, reject) => {
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
          if (err) reject(err);
          else resolve();
        });
      });
    });
  }

  async run(sql: string, params: any[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async all<T>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows as T[]);
      });
    });
  }
  
  close() {
    this.db.close();
  }
}
