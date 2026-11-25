const { createRequire } = require("node:module");

const requireBuildTasks = createRequire(require.resolve("@minecraft/core-build-tasks"));
process.env.TS_NODE_COMPILER = requireBuildTasks.resolve("typescript");

require("just-scripts/bin/just-scripts.js");