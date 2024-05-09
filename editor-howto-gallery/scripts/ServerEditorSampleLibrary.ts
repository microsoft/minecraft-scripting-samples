import * as mc from "@minecraft/server";
import SampleManager from "./SampleManager";

import * as sdf3 from "./Empty";

const mojangEditorRegisterFuncs: {
  [name: string]: Array<(log: (message: string, status?: number) => void, location: mc.DimensionLocation) => void>;
} = {
  empty: [sdf3.registerEmptyExtension],
};

export function register(sampleManager: SampleManager) {
  sampleManager.registerSamples(mojangEditorRegisterFuncs);
}
