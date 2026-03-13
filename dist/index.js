#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const slim_router_1 = require("./cli/slim-router");
const args = process.argv.slice(2);
(0, slim_router_1.router)(args).catch(console.error);
