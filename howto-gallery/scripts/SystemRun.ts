// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as mc from "@minecraft/server";

/**
 * A simple tick timer that runs a command every minute.
 * This sample uses only stable APIs.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/system#run
 */
export function trapTick() {
  const overworld = mc.world.getDimension("overworld");

  try {
    // Minecraft runs at 20 ticks per second.
    if (mc.system.currentTick % 1200 === 0) {
      mc.world.sendMessage("Another minute passes...");
    }
  } catch (e) {
    console.warn("Error: " + e);
  }

  mc.system.run(trapTick);
}

trapTick();

/**
 * An alternate interval timer that runs a command every 30 seconds.
 * This sample uses only stable APIs.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/system#runInterval
 */
export function every30Seconds(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  let intervalRunIdentifier = Math.floor(Math.random() * 10000);

  mc.system.runInterval(() => {
    mc.world.sendMessage("This is an interval run " + intervalRunIdentifier + " sending a message every 30 seconds.");
  }, 600);
}
