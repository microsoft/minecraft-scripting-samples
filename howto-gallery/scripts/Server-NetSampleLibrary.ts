import * as mc from "@minecraft/server";
import * as mcnet from "@minecraft/server-net"; // keep in for net samples

import SampleManager from "./SampleManager";

import * as sdf1 from "./NetUse";

const mojangNetAdminTestFuncs: {
  [name: string]: Array<(log: (message: string, status?: number) => void, location: mc.Location) => void>;
} = {
  updateScore: [sdf1.updateScore],
};

export function register(sampleManager: SampleManager) {
  sampleManager.registerSamples(mojangNetAdminTestFuncs);
}
