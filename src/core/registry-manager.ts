import { getRegistryPath } from '../storage/paths.js';
import { readJsonFile, writeJsonFile } from '../storage/file-store.js';
import { SkillRegistry, SkillDefinition } from '../types/mcp-types.js';

export class RegistryManager {
  private cli: string;
  private registryPath: string;

  constructor(cli: string) {
    this.cli = cli;
    this.registryPath = getRegistryPath(cli);
  }

  async load(): Promise<SkillRegistry> {
    return (await readJsonFile<SkillRegistry>(this.registryPath)) || {};
  }

  async save(registry: SkillRegistry): Promise<void> {
    await writeJsonFile(this.registryPath, registry);
  }

  async updateRegistry(skillDef: SkillDefinition): Promise<void> {
    const registry = await this.load();
    const actionMap: Record<string, string> = {};
    
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
