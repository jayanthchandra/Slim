import fs from 'fs';
import { readConfig } from '../core/config-reader';

describe('Config Reader', () => {
  const mockConfig = {
    mcpServers: {
      github: { command: 'npx', args: [] }
    }
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should return config if file exists and is valid', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(mockConfig));
    
    const config = readConfig();
    expect(config).toEqual(mockConfig);
  });

  test('should return null if no config is found', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    
    const config = readConfig();
    expect(config).toBeNull();
  });

  test('should return null and log error for invalid JSON', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue('invalid json');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const config = readConfig();
    expect(config).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
  });
});
