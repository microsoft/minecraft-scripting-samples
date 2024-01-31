// Copyright (c) Mojang AB.  All rights reserved.

import { task, tscTask } from "just-scripts";
import { cleanTask } from "@minecraft/core-build-tasks";

// Build
task("build", tscTask());

// Cleans the actual code that is used for build. After running this, build is needed
// to run any command in the workspace
task("clean", cleanTask(["lib", "publish"]));
