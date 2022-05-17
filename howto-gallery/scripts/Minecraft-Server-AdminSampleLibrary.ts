import * as mc from "mojang-minecraft";
import * as mcsa from "mojang-minecraft-server-admin";
import * as mcnet from "mojang-net";
import SampleManager from "./SampleManager";

import * as sdf1 from "./ServerAdmin";

const mojangServerAdminTestFuncs: {
  [name: string]: Array<(log: (message: string, status?: number) => void, location: mc.Location) => void>;
} = {
  getPlayerProfile: [sdf1.getPlayerProfile],
};

export function register(sampleManager: SampleManager) {
  sampleManager.registerSamples(mojangServerAdminTestFuncs);
}
