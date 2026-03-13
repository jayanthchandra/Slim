import fs from 'fs';
import path from 'path';
import { fetchSchemas } from '../core/schema-fetcher';
import { MCPServerConfig } from '../types/mcp';
import * as child_process from 'child_process';
import { EventEmitter } from 'events';

jest.mock('child_process');
jest.mock('fs');

describe('Schema Fetcher', () => {
    const mockConfig: MCPServerConfig = {
        command: 'npx',
        args: ['test-mcp']
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (fs.existsSync as jest.Mock).mockReturnValue(false);
        (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
    });

    test('should fetch tools from MCP server via stdio handshake', async () => {
        const mockChild: any = new EventEmitter();
        mockChild.stdin = { write: jest.fn() };
        mockChild.stdout = new EventEmitter();
        mockChild.stderr = new EventEmitter();
        mockChild.kill = jest.fn();

        (child_process.spawn as jest.Mock).mockReturnValue(mockChild);

        const fetchPromise = fetchSchemas('test-server', mockConfig);

        // 1. Simulate handshake response for 'initialize'
        mockChild.stdout.emit('data', JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            result: { protocolVersion: "2024-11-05" }
        }) + '\n');

        // 2. Simulate response for 'tools/list'
        setTimeout(() => {
            mockChild.stdout.emit('data', JSON.stringify({
                jsonrpc: "2.0",
                id: 2,
                result: {
                    tools: [
                        { name: "test_tool", description: "A test tool" }
                    ]
                }
            }) + '\n');
        }, 10);

        const tools = await fetchPromise;

        expect(tools).toHaveLength(1);
        expect(tools[0].name).toBe('test_tool');
        expect(mockChild.stdin.write).toHaveBeenCalledWith(expect.stringContaining('"method":"initialize"'));
        expect(mockChild.stdin.write).toHaveBeenCalledWith(expect.stringContaining('"method":"tools/list"'));
    });

    test('should return empty array if server fails', async () => {
        const mockChild: any = new EventEmitter();
        mockChild.stdin = { write: jest.fn() };
        mockChild.stdout = new EventEmitter();
        mockChild.stderr = new EventEmitter();
        mockChild.kill = jest.fn();

        (child_process.spawn as jest.Mock).mockReturnValue(mockChild);

        const fetchPromise = fetchSchemas('fail-server', mockConfig);

        // Simulate server exit before response
        mockChild.emit('exit', 1);

        const tools = await fetchPromise;
        expect(tools).toHaveLength(0);
    });

    test('should return cached tools if available', async () => {
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify([{ name: 'cached_tool' }]));

        const tools = await fetchSchemas('cached-server', mockConfig);
        expect(tools).toHaveLength(1);
        expect(tools[0].name).toBe('cached_tool');
        expect(child_process.spawn).not.toHaveBeenCalled();
    });
});
