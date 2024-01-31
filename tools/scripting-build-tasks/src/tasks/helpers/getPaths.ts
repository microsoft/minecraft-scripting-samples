// Copyright (c) Mojang AB.  All rights reserved.

import { MinecraftProduct } from "../../platforms";
import { resolve } from "path";

export function getDeploymentRootPaths(): Record<
  MinecraftProduct,
  string | undefined
> {
  const localAppDataPath = process.env["LOCALAPPDATA"];
  const customDeploymentPath = process.env["CUSTOM_DEPLOYMENT_PATH"];
  return {
    BedrockUWP: localAppDataPath
      ? resolve(
          localAppDataPath,
          "Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/"
        )
      : undefined,
    PreviewUWP: localAppDataPath
      ? resolve(
          localAppDataPath,
          "Packages/Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe/LocalState/games/com.mojang/"
        )
      : undefined,
    Custom: customDeploymentPath ? customDeploymentPath : undefined,
  };
}
