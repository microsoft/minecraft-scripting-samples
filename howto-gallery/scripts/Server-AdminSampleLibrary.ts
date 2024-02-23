// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as mc from "@minecraft/server";
import * as mcsa from "@minecraft/server-admin";
import * as mcnet from "@minecraft/server-net"; // keep in for net samples

import SampleManager from "./SampleManager";

import * as sdf1 from "./ServerAdmin";

const mojangServerAdminTestFuncs: {
  [name: string]: Array<(log: (message: string, status?: number) => void, location: mc.Vector3) => void>;
} = {
  getPlayerProfile: [sdf1.getPlayerProfile],
};

export function register(sampleManager: SampleManager) {
  sampleManager.registerSamples(mojangServerAdminTestFuncs);
}
