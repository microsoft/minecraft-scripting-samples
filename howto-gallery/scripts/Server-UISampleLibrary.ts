import * as mc from "@minecraft/server";
import * as mcui from "@minecraft/server-ui"; // keep in for ui samples

import SampleManager from "./SampleManager";

import * as sdf1 from "./ServerUserInterface";

const mojangMinecraftUIFuncs: {
  [name: string]: Array<(log: (message: string, status?: number) => void, location: mc.Vector3) => void>;
} = {
  showActionForm: [sdf1.showActionForm],
  showFavoriteMonth: [sdf1.showFavoriteMonth],
};

export function register(sampleManager: SampleManager) {
  sampleManager.registerSamples(mojangMinecraftUIFuncs);
}
