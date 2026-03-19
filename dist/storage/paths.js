import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
const SLIM_DIR = '.slim';
export function getSlimRoot() {
    const root = path.join(os.homedir(), SLIM_DIR);
    if (!fs.existsSync(root)) {
        fs.mkdirSync(root, { recursive: true });
    }
    return root;
}
export function getCliDir(cli) {
    const root = getSlimRoot();
    const cliDir = path.join(root, cli);
    if (!fs.existsSync(cliDir)) {
        fs.mkdirSync(cliDir, { recursive: true });
    }
    return cliDir;
}
export function getSkillDir(cli) {
    const cliDir = getCliDir(cli);
    const skillDir = path.join(cliDir, 'skills');
    if (!fs.existsSync(skillDir)) {
        fs.mkdirSync(skillDir, { recursive: true });
    }
    return skillDir;
}
export function getSchemaDir(cli) {
    const cliDir = getCliDir(cli);
    const schemaDir = path.join(cliDir, 'schemas');
    if (!fs.existsSync(schemaDir)) {
        fs.mkdirSync(schemaDir, { recursive: true });
    }
    return schemaDir;
}
export function getRegistryPath(cli) {
    const root = getSlimRoot();
    return path.join(root, `registry-${cli}.json`);
}
export function getCliConfigPath(cli) {
    const home = os.homedir();
    return path.join(home, `.${cli}`, 'settings.json');
}
