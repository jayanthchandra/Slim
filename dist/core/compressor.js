"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compressTool = compressTool;
function compressTool(tool) {
    const params = tool.inputSchema?.properties ? Object.keys(tool.inputSchema.properties).join(',') : '';
    const signature = `${tool.name}(${params})`;
    const description = tool.description ? (tool.description.length > 60 ? tool.description.substring(0, 57) + '...' : tool.description) : '';
    return {
        signature,
        description
    };
}
