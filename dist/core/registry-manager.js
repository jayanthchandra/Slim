import { getRegistryPath } from '../storage/paths.js';
import { readJsonFile, writeJsonFile } from '../storage/file-store.js';
export class RegistryManager {
    cli;
    registryPath;
    constructor(cli) {
        this.cli = cli;
        this.registryPath = getRegistryPath(cli);
    }
    async load() {
        return (await readJsonFile(this.registryPath)) || {};
    }
    async save(registry) {
        await writeJsonFile(this.registryPath, registry);
    }
    async updateRegistry(skillDef) {
        const registry = await this.load();
        const actionMap = {};
        for (const action of skillDef.actions) {
            actionMap[action] = action; // Direct mapping for now
        }
        registry[skillDef.skill] = {
            server: skillDef.server,
            actions: actionMap
        };
        await this.save(registry);
    }
}
