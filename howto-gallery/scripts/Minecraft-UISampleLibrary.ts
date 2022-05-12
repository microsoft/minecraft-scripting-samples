import * as mc from "mojang-minecraft";
import * as mcui from "mojang-minecraft-ui";
import SampleManager from "./SampleManager";

import * as sdf1 from "./ServerUserInterface";

const mojangMinecraftUIFuncs: {
  [name: string]: Array<(log: (message: string, status?: number) => void, location: mc.Location) => void>;
} = {
  showActionForm: [sdf1.showActionForm],
  showFavoriteMonth: [sdf1.showFavoriteMonth],
};

export function register(sampleManager: SampleManager) {
  sampleManager.registerSamples(mojangMinecraftUIFuncs);
}
