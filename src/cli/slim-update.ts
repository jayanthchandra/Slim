import { slimInit } from './slim-init.js';

export async function slimUpdate() {
  console.log('🔄 Updating skills from host configuration...');
  // Update is essentially a re-run of init to sync changes
  await slimInit();
}
