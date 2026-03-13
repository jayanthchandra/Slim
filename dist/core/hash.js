"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeHash = computeHash;
exports.saveHash = saveHash;
exports.loadHash = loadHash;
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const paths_1 = require("../storage/paths");
function computeHash(config) {
    const str = JSON.stringify(config.mcpServers);
    return crypto_1.default.createHash('sha256').update(str).digest('hex');
}
function saveHash(hash) {
    fs_1.default.writeFileSync(paths_1.CONFIG_HASH_FILE, hash, 'utf-8');
}
function loadHash() {
    if (fs_1.default.existsSync(paths_1.CONFIG_HASH_FILE)) {
        return fs_1.default.readFileSync(paths_1.CONFIG_HASH_FILE, 'utf-8');
    }
    return null;
}
