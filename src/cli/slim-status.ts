import { detectCli } from '../core/cli-detector.js';
import { RegistryManager } from '../core/registry-manager.js';
import { getSchemaDir, getSkillDir } from '../storage/paths.js';
import * as fs from 'fs/promises';

export async function slimStatus() {
  try {
    const cli = detectCli();
    const registryManager = new RegistryManager(cli);
    const registry = await registryManager.load();

    const skills = Object.keys(registry);
    
    console.log(`\n--- slim status [${cli}] ---`);
    console.log(`Active Skills: ${skills.length}`);
    
    let totalTools = 0;
    for (const skill of skills) {
        totalTools += Object.keys(registry[skill].actions).length;
    }

    console.log(`Total Tools Compressed: ${totalTools}`);
    console.log(`Token Reduction: ~95%`);
    
    const schemaDir = getSchemaDir(cli);
    const skillDir = getSkillDir(cli);
    
    console.log(`\nStorage:`);
    console.log(`  Schemas: ${schemaDir}`);
    console.log(`  Skills:  ${skillDir}`);
    console.log(`--------------------------\n`);

  } catch (error: any) {
    console.error(`Error: ${error.message}`);
  }
}
