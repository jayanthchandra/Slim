#!/usr/bin/env node
import { router } from './cli/slim-router';

const args = process.argv.slice(2);
router(args).catch(console.error);
