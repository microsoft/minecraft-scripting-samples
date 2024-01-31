// Copyright (c) Mojang AB.  All rights reserved.

import { FileSystem, JsonFile } from "@rushstack/node-core-library";
import path, * as Path from "path";
import { getOrThrowFromProcess } from "./helpers/getOrThrowFromProcess";
import { getDeploymentRootPaths } from "./helpers/getPaths";
import { MinecraftProduct } from "../platforms/MinecraftProduct";

/**
 * For each output path, this is the configuration for the files to copy.
 * Folders will be copied to the output folder entirely.
 */
export type FilesToCopy = { files?: string[]; folders?: string[] };

/**
 * Format for configuration files. There are sets of files to copy for each output path specified.
 *
 * These should be a scheme for validation purposes
 */
export type ConfigurationFormat = {
  [outputPath: string]: FilesToCopy | FilesToCopy[];
};

const COPY_CONFIG_DEFAULT = "./config/copyTask.config.json";

export type CopyTaskParameters = {
  packageRoot: string;
  /**
   * if not specified, defaults to config/copyTask.config.json under current package folder
   */
  copyTaskConfigPath?: string;
};

/**
 * A just task which copies files to a specified output location. The configuration passed in uses the following format:
 * {
 *   [outputPath]: string[]
 * }
 *
 * Where there may be multiple output paths, and for each output path there may be multiple files. The Output Path accepts
 * defined constants:
 *
 *   PROJECT_NAME
 *
 * These constants are replaced at task execution with a value provided by the process environment.
 *
 * Files to copy must be specified relative to the location of the configuration file. Only files may be specified. For files, the
 * following constants will be replaced:
 *
 *   PACKAGE_VERSION
 *
 */
export function copyTask(params: CopyTaskParameters) {
  return () => {
    const configPath =
      params.copyTaskConfigPath ?? Path.resolve(__dirname, COPY_CONFIG_DEFAULT);
    const config = JsonFile.load(configPath) as ConfigurationFormat | undefined;

    if (!config) {
      throw new Error(
        "Unable to process copy configuration, please review configuration file."
      );
    }

    const projectName = getOrThrowFromProcess("PROJECT_NAME");

    // Load package.json for current package
    const packageJson = JsonFile.load(
      Path.resolve(params.packageRoot, "./package.json")
    ) as { version: string };
    const packageVersion = packageJson["version"];
    if (!packageVersion) {
      throw new Error(
        "Unable to get current package version. Make sure to configure package root correctly."
      );
    }

    let deploymentPath: string | undefined = undefined;
    try {
      const product =
        getOrThrowFromProcess<MinecraftProduct>("MINECRAFT_PRODUCT");
      deploymentPath = getDeploymentRootPaths()[product];
    } catch (_) {
      throw new Error(
        "Unable to get deployment path. Make sure to configure package root correctly."
      );
    }

    if (deploymentPath === undefined) {
      throw new Error(
        "Deployment path is undefined. Make sure to configure package root correctly."
      );
    }

    // For each output path, replace tokens with env values
    for (const outputDirectoryRaw of Object.keys(config)) {
      const rawFiles = config[outputDirectoryRaw];
      const filesToCopy = Array.isArray(rawFiles) ? rawFiles : [rawFiles];
      for (const fileToCopyConfig of filesToCopy) {
        // Note: order of replacement matters to avoid replacing partial matches initially
        const outputPath = path.join(
          deploymentPath,
          outputDirectoryRaw.replace("PROJECT_NAME", projectName)
        );

        // Folders
        if (fileToCopyConfig.folders !== undefined) {
          const folders = fileToCopyConfig.folders.map<string>((val) => {
            return val.replace("PACKAGE_VERSION", packageVersion);
          });

          for (const folder of folders) {
            const destinationPath = Path.resolve(outputPath);
            const inputFolder = Path.resolve(folder);
            console.log(`Copying folder ${inputFolder} to ${destinationPath}`);

            FileSystem.copyFiles({
              sourcePath: inputFolder,
              destinationPath: destinationPath,
            });
          }
        }

        // Files
        if (fileToCopyConfig.files !== undefined) {
          const files = fileToCopyConfig.files.map<string>((val) => {
            return val.replace("PACKAGE_VERSION", packageVersion);
          });

          for (const file of files) {
            // Each file is a static path here, so resolve, get file name, and copy to location
            const resolvedFile = Path.resolve(params.packageRoot, file);
            const filename = Path.parse(resolvedFile).base;
            const destinationPath = Path.resolve(outputPath, filename);

            console.log(`Copying file to ${destinationPath}`);

            FileSystem.copyFiles({
              sourcePath: Path.resolve(params.packageRoot, file),
              destinationPath,
            });
          }
        }
      }
    }
  };
}
