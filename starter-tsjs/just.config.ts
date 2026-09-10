import { argv, parallel, series, task, tscTask } from "just-scripts";
import {
  bundleTask,
  BundleTaskParameters,
  CopyTaskParameters,
  cleanTask,
  cleanCollateralTask,
  copyTask,
  coreLint,
  mcaddonTask,
  setupEnvironment,
  ZipTaskParameters,
  STANDARD_CLEAN_PATHS,
  DEFAULT_CLEAN_DIRECTORIES,
  getOrThrowFromProcess,
  watchTask,
} from "@minecraft/core-build-tasks";
import path from "path";
import fs from "fs";
// Setup env variables
setupEnvironment(path.resolve(__dirname, ".env"));
const projectName = getOrThrowFromProcess("PROJECT_NAME");

let entryPointPath = path.join(__dirname, "./scripts/main.ts");
if (!fs.existsSync(entryPointPath)) {
  entryPointPath = path.join(__dirname, "./scripts/main.js");
}
const bundleTaskOptions: BundleTaskParameters = {
  entryPoint: entryPointPath,
  external: ["@minecraft/server", "@minecraft/server-gametest", "@minecraft/server-ui"],
  outfile: path.resolve(__dirname, "./dist/scripts/main.js"),
  minifyWhitespace: false,
  sourcemap: true,
  outputSourcemapPath: path.resolve(__dirname, "./dist/debug"),
};

const copyTaskOptions: CopyTaskParameters = {
  copyToBehaviorPacks: [`./behavior_packs/${projectName}`],
  copyToScripts: ["./dist/scripts"],
  copyToResourcePacks: [`./resource_packs/${projectName}`],
};

const mcaddonTaskOptions: ZipTaskParameters = {
  ...copyTaskOptions,
  outputFile: `./dist/packages/${projectName}.mcaddon`,
};

// Lint
task("lint", coreLint(["scripts/**/*.{ts,js}"], argv().fix));
// Build
task("typescript", tscTask());
task("bundle", bundleTask(bundleTaskOptions));
task("build", series("typescript", "bundle"));

// Clean
task("clean-local", cleanTask(DEFAULT_CLEAN_DIRECTORIES));
task("clean-collateral", cleanCollateralTask(STANDARD_CLEAN_PATHS));
task("clean", parallel("clean-local", "clean-collateral"));

// Package
task("copyArtifacts", copyTask(copyTaskOptions));
task("package", series("clean-collateral", "copyArtifacts"));

// Local Deploy used for deploying local changes directly to output via the bundler. It does a full build and package first just in case.
task(
  "local-deploy",
  watchTask(
    ["scripts/**/*.{ts,js}", "behavior_packs/**/*.{json,lang,png}", "resource_packs/**/*.{json,lang,png}"],
    series("clean-local", "build", "package")
  )
);

// Mcaddon
task("createMcaddonFile", mcaddonTask(mcaddonTaskOptions));
task("mcaddon", series("clean-local", "build", "createMcaddonFile"));
