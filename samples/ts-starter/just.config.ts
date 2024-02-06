import { argv, parallel, series, task, tscTask } from "just-scripts";
import {
  BundleTaskParams,
  CleanCollateralTaskParams,
  CopyTaskParameters,
  bundleTask,
  cleanCollateralTask,
  copyTask,
  coreLint,
  generateContentsJsonTask,
  setupEnvironment,
} from "@minecraft/core-build-tasks";
import rimraf from "rimraf";
import path from "path";

const buildTaskOptions: BundleTaskParams = {
  entryPoint: path.join(__dirname, "./scripts/main.ts"),
  external: ["@minecraft/server", "@minecraft/server-ui"],
  outfile: path.resolve(__dirname, "./dist/scripts/main.js"),
  minifyWhitespace: false,
  sourcemap: true,
};

const cleanTaskOptions: CleanCollateralTaskParams = {
  pathsToClean: [
    "LOCALAPPDATA/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_behavior_packs/PROJECT_NAME",
    "LOCALAPPDATA/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_resource_packs/PROJECT_NAME",
    "LOCALAPPDATA/Packages/Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe/LocalState/games/com.mojang/development_behavior_packs/PROJECT_NAME",
    "LOCALAPPDATA/Packages/Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe/LocalState/games/com.mojang/development_resource_packs/PROJECT_NAME",
  ],
};

const copyTaskOptions: CopyTaskParameters = {
  copyToBehaviorPacks: ["./assets/behavior_pack", "./dist/behavior_pack/contents.json"],
  copyToScripts: ["./dist/scripts"],
};

// Setup env variables
setupEnvironment(path.resolve(__dirname, ".env"));

// Lint
task("lint", coreLint(["scripts/**/*.ts"], argv().fix));

// Build
task("typescript", tscTask());
task("bundle", bundleTask(buildTaskOptions));
task("build", series("typescript", "bundle"));

// Clean
task("clean-local", () => {
  rimraf("lib", {}, () => {
    // Silent failure on failing to clean
  });
  rimraf("dist", {}, () => {
    // Silent failure on failing to clean
  });
});
task("clean-collateral", cleanCollateralTask(cleanTaskOptions));
task("clean", parallel("clean-local", "clean-collateral"));

// Package
task(
  "generateContentsJsonBehaviorPack",
  generateContentsJsonTask({ targetPath: "./assets/behavior_pack", outputFile: "./dist/behavior_pack/contents.json" })
);
task(
  "generateContentsJsonResourcePack",
  generateContentsJsonTask({
    targetPath: "./assets/resource_pack",
    outputFile: "./dist/resource_pack/contents.json",
    ignoreTargetFolderExists: true,
  })
);
task("copyArtifacts", copyTask(copyTaskOptions));
task(
  "package",
  series("generateContentsJsonBehaviorPack", "generateContentsJsonResourcePack", "clean-collateral", "copyArtifacts")
);

// Local Deploy used for deploying local changes directly to output via the bundler. It does a full build and package first just in case.
task("local-deploy", series("build", "package"));
