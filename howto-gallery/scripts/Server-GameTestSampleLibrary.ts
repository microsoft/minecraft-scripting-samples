import * as mc from "@minecraft/server";
import * as gt from "@minecraft/server-gametest"; // keep in for gametest samples

import SampleManager from "./SampleManager";

import * as sdf1 from "./SimpleGameTests";

const mojangGameTestFuncs: {
  [name: string]: Array<(log: (message: string, status?: number) => void, location: mc.Location) => void>;
} = {
  simpleMobTest: [sdf1.simpleMobTest],
};

export function register(sampleManager: SampleManager) {
  sampleManager.registerSamples(mojangGameTestFuncs);
}
