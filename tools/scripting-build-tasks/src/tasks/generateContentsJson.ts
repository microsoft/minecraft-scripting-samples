// Copyright (c) Mojang AB.  All rights reserved.

import { FileSystem } from "@rushstack/node-core-library";
import path from "path";

/**
 * Parameters for the generate contents json task.
 */
export type GenerateContentsJsonParameters = {
  /**
   * The path to the target directory to generate the contents.json file for.
   */
  targetPath: string;
  /**
   * The path to the output file to write the contents.json file to.
   */
  outputFile: string;
  /**
   * If true, the task will not throw an error if the target directory does not exist.
   */
  ignoreTargetFolderExists?: boolean;
};

interface Entry {
  path: string;
}

interface ContentsData {
  content: Entry[];
}

/**
 * At a given target, runs build script to generate a contents.json for a behavior_pack or resource_pack.
 */
export function generateContentsJsonTask(
  params: GenerateContentsJsonParameters
) {
  return async () => {
    // Skip if target directory does not exist and it is possible.
    const pathExists = await FileSystem.existsAsync(params.targetPath);
    if (params.ignoreTargetFolderExists === true && !pathExists) {
      return;
    }

    // Make sure target directory is valid.
    const dirStats = await FileSystem.getLinkStatisticsAsync(params.targetPath);
    if (!dirStats.isDirectory()) {
      throw new Error(`Target path not valid: ${params.targetPath}`);
    }

    // If the contents.json file already exists, remove it.
    if (await FileSystem.existsAsync(params.outputFile)) {
      await FileSystem.deleteFileAsync(params.outputFile);
    }

    const generateContentsCallback = async (
      rootPath: string,
      targetPath: string
    ): Promise<Entry[]> => {
      const resultEntries: Entry[] = [];
      const folderItems = await FileSystem.readFolderItemNamesAsync(
        targetPath,
        { absolutePaths: true }
      );
      for (const entry of folderItems) {
        const stats = await FileSystem.getLinkStatisticsAsync(entry);
        if (stats.isFile()) {
          const relativePath = path
            .relative(rootPath, entry)
            .replace("\\", "/");
          resultEntries.push({ path: relativePath });
        } else if (stats.isDirectory()) {
          const subContentsData = await generateContentsCallback(
            rootPath,
            entry
          );
          resultEntries.push(...subContentsData);
        }
      }

      return resultEntries;
    };

    const entries = await generateContentsCallback(
      params.targetPath,
      params.targetPath
    );
    const contentsData: ContentsData = { content: entries };

    // Write the contents.json file.
    await FileSystem.writeFileAsync(
      params.outputFile,
      JSON.stringify(contentsData, null, 4),
      { ensureFolderExists: true }
    );
  };
}
