import { argv, parallel, series, task, tscTask } from "just-scripts";
import {
  BundleTaskParams,
  CleanCollateralTaskParams,
  CopyTaskParameters,
  bundleTask,
  cleanTask,
  cleanCollateralTask,
  copyTask,
  coreLint,
  generateContentsJsonTask,
  mcaddonTask,
  setupEnvironment,
  ZipTaskParameters,
  GenerateContentsJsonParameters,
} from "@minecraft/core-build-tasks";
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

const generateBehaviorPackContentsJsonOptions: GenerateContentsJsonParameters = {
  targetPath: "./behavior_packs/cotta",
  outputFile: "./dist/behavior_pack/contents.json",
};

const generateResourcePackContentsJsonOptions: GenerateContentsJsonParameters = {
  targetPath: "./resource_packs/cotta",
  outputFile: "./dist/resource_packs/contents.json",
  ignoreTargetFolderExists: true,
};

const copyTaskOptions: CopyTaskParameters = {
  copyToBehaviorPacks: ["./behavior_packs/cotta", "./dist/behavior_pack/contents.json"],
  copyToScripts: ["./dist/scripts"],
};

const mcaddonTaskOptions: ZipTaskParameters = {
  ...copyTaskOptions,
  outputFile: "./dist/packages/buildchallenge.mcaddon",
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
task("clean-local", cleanTask(["lib", "dist"]));
task("clean-collateral", cleanCollateralTask(cleanTaskOptions));
task("clean", parallel("clean-local", "clean-collateral"));

// Package
task("generateContentsJsonBehaviorPack", generateContentsJsonTask(generateBehaviorPackContentsJsonOptions));
task("generateContentsJsonResourcePack", generateContentsJsonTask(generateResourcePackContentsJsonOptions));
task("generateJsonContentsFiles", parallel("generateContentsJsonBehaviorPack", "generateContentsJsonResourcePack"));
task("copyArtifacts", copyTask(copyTaskOptions));
task("package", series("generateJsonContentsFiles", "clean-collateral", "copyArtifacts"));

// Local Deploy used for deploying local changes directly to output via the bundler. It does a full build and package first just in case.
task("local-deploy", series("build", "package"));

// Mcaddon
task("createMcaddonFile", series("generateJsonContentsFiles", mcaddonTask(mcaddonTaskOptions)));
task("mcaddon", series("clean-local", "build", "createMcaddonFile"));
