// Copyright (c) Mojang AB.  All rights reserved.

import { JsonFile } from "@rushstack/node-core-library";
import * as fs from "fs";
import * as Path from "path";
import rimraf from "rimraf";
import { getOrThrowFromProcess } from "./helpers/getOrThrowFromProcess";

/**
 * Format for configuration file.
 */
export type CleanCollateralConfigurationFormat = {
  toClean: string[];
};

const CLEAN_CONFIG_DEFAULT = "./config/cleanCollateralTask.config.json";

export type CleanCollateralTaskParams = {
  cleanCollateralTaskConfigPath: string;
};

/**
 * Cleans the specified outputs. Outputs could be either folders or files. Has support for the following variable replacements
 *
 *   APPDATA, LOCALAPPDATA, PROJECT_NAME
 *
 * This constant is replaced at task execution with a value provided by the process environment.
 *
 */
export function cleanCollateralTask(params: CleanCollateralTaskParams) {
  return () => {
    const configPath =
      params.cleanCollateralTaskConfigPath ??
      Path.resolve(process.cwd(), CLEAN_CONFIG_DEFAULT);
    const config = JsonFile.load(configPath) as
      | CleanCollateralConfigurationFormat
      | undefined;

    if (!config) {
      throw new Error(
        "Unable to process copy configuration, please review configuration file."
      );
    }

    const projectName = getOrThrowFromProcess("PROJECT_NAME");

    // The following variables are not used on all platforms. In those cases, set up an error token so that if the
    // config requires these on the platform, we error out immediately.
    const errorToken = "$ERROR_TOKEN$";
    let appData = process.env.APPDATA;
    if (!appData) {
      console.warn(
        "Proceeding without APPDATA on this platform. File copy will fail if APPDATA is required."
      );
      appData = errorToken;
    }

    let localAppData = process.env.LOCALAPPDATA;
    if (!localAppData) {
      console.warn(
        "Proceeding without LOCALAPPDATA on this platform. File copy will fail if LOCALAPPDATA is required."
      );
      localAppData = errorToken;
    }

    // For each output path, replace tokens with env values
    for (const cleanPathRaw of config.toClean) {
      const cleanPath = cleanPathRaw
        .replace("LOCALAPPDATA", localAppData)
        .replace("APPDATA", appData)
        .replace("PROJECT_NAME", projectName);

      if (cleanPath.includes(errorToken)) {
        console.warn(
          `Skipping clean of ${cleanPath} on current platform due to APPDATA or LOCALAPPDATA being missing.`
        );
        continue;
      }

      try {
        const stats = fs.statSync(cleanPath);
        console.log(
          `Cleaning ${
            stats.isDirectory() ? "directory" : "file"
          } ${Path.resolve(cleanPath)}.`
        );
        rimraf.sync(cleanPath);
      } catch (_: unknown) {
        // File or directory did not exist, so we no-op
      }
    }
  };
}
