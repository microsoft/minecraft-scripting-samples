import * as mc from "@minecraft/server";
import * as mcui from "@minecraft/server-ui"; // keep in for ui samples

import SampleManager from "./SampleManager";

import * as sdf1 from "./ServerUserInterface";

const mojangMinecraftUIFuncs: {
  [name: string]: Array<(log: (message: string, status?: number) => void, location: mc.DimensionLocation) => void>;
} = {
  showActionForm: [sdf1.showActionForm],
  showFavoriteMonth: [sdf1.showFavoriteMonth],
  showBasicMessageForm: [sdf1.showBasicMessageForm],
  showBasicModalForm: [sdf1.showBasicModalForm],
  showTranslatedMessageForm: [sdf1.showTranslatedMessageForm],
};

export function register(sampleManager: SampleManager) {
  sampleManager.registerSamples(mojangMinecraftUIFuncs);
}
