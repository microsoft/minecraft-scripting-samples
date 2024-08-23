import { argv, parallel, series, task, tscTask } from "just-scripts";
import {
  bundleTask,
  BundleTaskParameters,
  CopyTaskParameters,
  STANDARD_CLEAN_PATHS,
  ZipTaskParameters,
  cleanCollateralTask,
  cleanTask,
  copyTask,
  coreLint,
  mcaddonTask,
  setupEnvironment,
  updateWorldTask,
  zipTask,
  copyFiles,
  DEFAULT_CLEAN_DIRECTORIES,
  getOrThrowFromProcess,
  watchTask,
} from "@minecraft/core-build-tasks";
import path from "path";

// Setup env variables
setupEnvironment(path.resolve(__dirname, ".env"));
const projectName = getOrThrowFromProcess("PROJECT_NAME");

const bundleTaskOptions: BundleTaskParameters = {
  entryPoint: path.join(__dirname, "./scripts/main.ts"),
  external: ["@minecraft/server", "@minecraft/server-ui"],
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
task("lint", coreLint(["scripts/**/*.ts"], argv().fix));

// Build
task("typescript", tscTask());
task("bundle", bundleTask(bundleTaskOptions));
task("build", series("typescript", "bundle"));

// Clean
task("clean-local", cleanTask([...DEFAULT_CLEAN_DIRECTORIES]));
task("clean-collateral", cleanCollateralTask(STANDARD_CLEAN_PATHS));
task("clean", parallel("clean-local", "clean-collateral"));

// Package
task("copyArtifacts", copyTask(copyTaskOptions));
task("package", series("clean-collateral", "copyArtifacts"));

// Local Deploy used for deploying local changes directly to output via the bundler. It does a full build and package first just in case.
task(
  "local-deploy",
  watchTask(
    ["scripts/**/*.ts", "behavior_packs/**/*.{json,lang,png}", "resource_packs/**/*.{json,lang,png}"],
    series("clean-local", "build", "package")
  )
);

// Mcaddon
task("createMcaddonFile", mcaddonTask(mcaddonTaskOptions));
task("mcaddon", series("clean-local", "build", "createMcaddonFile"));

// Update world
task("update-world", updateWorldTask({ backupPath: "backups/worlds/", devWorldPath: "worlds/default" }));

// Pack World
task("copy_world_to_build", () => {
  copyFiles(["worlds/default"], "build/worlds/default");
});
task("build_world", series("clean-local", "build", "copy_world_to_build"));
task(
  "pack-world",
  series(
    "clean-local",
    "build",
    zipTask(`dist/worlds/${projectName}.mcworld`, [
      { contents: ["./worlds/default"] },
      { contents: [`./behavior_packs/${projectName}`], targetPath: `behavior_packs/${projectName}` },
      { contents: [`./resource_packs/${projectName}`], targetPath: `resource_packs/${projectName}` },
      { contents: ["./dist/scripts"], targetPath: `behavior_packs/${projectName}/scripts` },
    ])
  )
);
