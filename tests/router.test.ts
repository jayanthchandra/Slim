import { router } from '../cli/slim-router';
import * as init from '../cli/init';
import * as status from '../cli/status';

describe('Router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should call init command when "init" is provided', async () => {
    const initSpy = jest.spyOn(init, 'initCommand').mockImplementation(async () => {});
    await router(['init']);
    expect(initSpy).toHaveBeenCalled();
  });

  test('should call status command when "status" is provided', async () => {
    const statusSpy = jest.spyOn(status, 'statusCommand').mockImplementation(async () => {});
    await router(['status']);
    expect(statusSpy).toHaveBeenCalled();
  });

  test('should support "/slim" prefix', async () => {
    const initSpy = jest.spyOn(init, 'initCommand').mockImplementation(async () => {});
    await router(['/slim', 'init']);
    expect(initSpy).toHaveBeenCalled();
  });

  test('should log "Unknown command" for invalid commands', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await router(['unknown']);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Unknown command'));
  });
});
