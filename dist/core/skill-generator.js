export function generateSkill(serverName, tools) {
    const skillName = `${serverName.replace(/-/g, '_')}_tools`;
    const toolNames = tools.map(t => t.name);
    return {
        skill: skillName,
        server: serverName,
        signature: `${skillName}(action, params)`,
        actions: toolNames,
        description: `Operations provided by ${serverName} MCP server`
    };
}
