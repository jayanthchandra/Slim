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
    fs_1.default.writeFileSync((0, paths_1.getConfigHashFile)(), hash, 'utf-8');
}
function loadHash() {
    const file = (0, paths_1.getConfigHashFile)();
    if (fs_1.default.existsSync(file)) {
        return fs_1.default.readFileSync(file, 'utf-8');
    }
    return null;
}
