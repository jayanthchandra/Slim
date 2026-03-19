import { readJsonFile } from '../storage/file-store.js';
import { getRegistryPath } from '../storage/paths.js';
import { detectCli } from '../core/cli-detector.js';
async function inject() {
    try {
        const cli = detectCli();
        const registryPath = getRegistryPath(cli);
        const registry = await readJsonFile(registryPath);
        if (!registry)
            return;
        let skillPrompt = '\n\nAvailable Skills (Compressed MCP):\n';
        const skillNames = Object.keys(registry);
        for (const skillName of skillNames) {
            const skill = registry[skillName];
            const actions = Object.keys(skill.actions).join(', ');
            skillPrompt += `- ${skillName}(action, params): [${actions}]\n`;
        }
        skillPrompt += '\nTo use a tool, call the skill with the action name. Example: github_tools("create_issue", { ... })\n';
        // The hook receives the llm_request on stdin and should output the modified request to stdout
        let input = '';
        process.stdin.on('data', chunk => { input += chunk; });
        process.stdin.on('end', async () => {
            if (!input)
                return;
            const request = JSON.parse(input);
            // Inject skills into the system instruction or the last message
            if (request.messages && request.messages.length > 0) {
                const lastMsg = request.messages[request.messages.length - 1];
                if (lastMsg.role === 'user' || lastMsg.role === 'system') {
                    lastMsg.content += skillPrompt;
                }
            }
            process.stdout.write(JSON.stringify(request));
        });
    }
    catch (e) {
        // Fail silently to avoid breaking the CLI if slim isn't initialized
        process.exit(0);
    }
}
inject();
