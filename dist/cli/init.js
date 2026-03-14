"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCommand = initCommand;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const paths_1 = require("../storage/paths");
const config_reader_1 = require("../core/config-reader");
const hash_1 = require("../core/hash");
const registry_1 = require("../core/registry");
const schema_fetcher_1 = require("../core/schema-fetcher");
const compressor_1 = require("../core/compressor");
const hook_installer_1 = require("../core/hook-installer");
const cli_config_generator_1 = require("../core/cli-config-generator");
async function initCommand() {
    (0, paths_1.ensureDirs)();
    const config = (0, config_reader_1.readConfig)();
    if (!config) {
        console.error('No MCP configuration found.');
        return;
    }
    const hash = (0, hash_1.computeHash)(config);
    (0, hash_1.saveHash)(hash);
    const registry = new registry_1.Registry();
    await registry.init();
    let totalServers = 0;
    let totalTools = 0;
    let originalSize = 0;
    let compressedSize = 0;
    for (const [serverName, serverConfig] of Object.entries(config.mcpServers)) {
        console.log(`Processing server: ${serverName}...`);
        totalServers++;
        // update registry for server
        await registry.updateServer(serverName, (0, hash_1.computeHash)({ mcpServers: { [serverName]: serverConfig } }));
        const tools = await (0, schema_fetcher_1.fetchSchemas)(serverName, serverConfig);
        if (tools.length === 0) {
            console.log(`  No tools found for ${serverName}.`);
            continue;
        }
        // Save raw schema (as fetched/simulated)
        (0, schema_fetcher_1.saveSchemas)(serverName, tools);
        const compressedTools = [];
        const toolEntries = [];
        let skillFileContent = `${serverName}\n`;
        for (const tool of tools) {
            totalTools++;
            originalSize += JSON.stringify(tool).length;
            const compressed = (0, compressor_1.compressTool)(tool);
            compressedSize += compressed.signature.length + compressed.description.length;
            compressedTools.push(compressed);
            toolEntries.push({
                toolName: tool.name,
                signature: compressed.signature,
                description: compressed.description
            });
            skillFileContent += `${compressed.signature}\n`;
        }
        // Write skill file
        const skillPath = path_1.default.join(paths_1.SKILL_DIR, `${serverName}.tools`);
        fs_1.default.writeFileSync(skillPath, skillFileContent);
        // Update registry tools
        await registry.addTools(serverName, toolEntries);
    }
    await registry.close();
    const reduction = originalSize > 0 ? ((1 - (compressedSize / originalSize)) * 100).toFixed(1) : '0.0';
    console.log('\nInitialization Complete.');
    console.log(`Servers found: ${totalServers}`);
    console.log(`Tools found: ${totalTools}`);
    console.log(`Token reduction estimate: ~${reduction}%`);
    const configPath = (0, cli_config_generator_1.generateGeminiConfig)();
    (0, cli_config_generator_1.generateQwenConfig)();
    (0, cli_config_generator_1.generateClaudeConfig)();
    console.log(`\nConfigurations generated for Gemini, Qwen, and Claude in: ${path_1.default.dirname(configPath)}`);
    const hookProfile = (0, hook_installer_1.installPrehook)();
    console.log('\n--- Setup Instructions ---');
    console.log('To enable the global "slim" command (required for Gemini CLI slash commands):');
    console.log('1. Run: npm link (in this directory)');
    console.log('2. Restart your terminal.');
    if (hookProfile === 'already-installed') {
        console.log('\nPre-hook is already configured in your shell.');
    }
    else if (hookProfile) {
        console.log(`\nSuccessfully registered pre-hook in ${hookProfile}.`);
        console.log('To activate it, run "npm link" in this directory, and restart your terminal.');
    }
    else {
        console.log('\nCould not automatically install pre-hook. Please add "slim update > /dev/null 2>&1 &" to your shell profile.');
    }
}
