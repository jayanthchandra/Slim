import { detectCli } from '../core/cli-detector.js';
import { RegistryManager } from '../core/registry-manager.js';
export async function slimInspect() {
    try {
        const cli = detectCli();
        const registryManager = new RegistryManager(cli);
        const registry = await registryManager.load();
        const skillNames = Object.keys(registry);
        if (skillNames.length === 0) {
            console.log(`No skills found for ${cli}. Run 'slim init' first.`);
            return;
        }
        console.log(`\nAvailable skills for ${cli}:\n`);
        for (const skillName of skillNames) {
            const skill = registry[skillName];
            console.log(`${skillName}`);
            console.log(`  server: ${skill.server}`);
            console.log(`  actions:`);
            for (const action of Object.keys(skill.actions)) {
                console.log(`    - ${action}`);
            }
            console.log('');
        }
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
    }
}
