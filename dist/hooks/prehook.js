"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prehook = prehook;
const config_reader_1 = require("../core/config-reader");
const hash_1 = require("../core/hash");
const update_1 = require("../cli/update");
async function prehook() {
    const config = (0, config_reader_1.readConfig)();
    if (!config)
        return;
    const currentHash = (0, hash_1.computeHash)(config);
    const storedHash = (0, hash_1.loadHash)();
    if (currentHash !== storedHash) {
        console.log('Configuration change detected. Running update...');
        await (0, update_1.updateCommand)();
    }
}
// Allow running directly if executed as script
if (require.main === module) {
    prehook().catch(console.error);
}
