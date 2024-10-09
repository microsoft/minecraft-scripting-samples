import SampleManager from "./SampleManager";

import * as sdf1 from "./Chat";
import { DimensionLocation } from "@minecraft/server";

const mojangMinecraftFuncs: {
  [name: string]: Array<(log: (message: string, status?: number) => void, location: DimensionLocation) => void>;
} = {
  chat: [sdf1.customCommand],
};

export function register(sampleManager: SampleManager) {
  sampleManager.registerSamples(mojangMinecraftFuncs);
}
