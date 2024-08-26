import { DimensionLocation, system, world } from "@minecraft/server";
import { MinecraftDimensionTypes } from "@minecraft/vanilla-data";

/**
 * A simple tick timer that runs a command every minute.
 * This sample uses only stable APIs.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/system#run
 */
export function trapTick() {
  try {
    // Minecraft runs at 20 ticks per second.
    if (system.currentTick % 1200 === 0) {
      world.sendMessage("Another minute passes...");
    }
  } catch (e) {
    console.warn("Error: " + e);
  }

  system.run(trapTick);
}

trapTick();

/**
 * An alternate interval timer that runs a command every 30 seconds.
 * This sample uses only stable APIs.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/system#runInterval
 */
export function every30Seconds(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  let intervalRunIdentifier = Math.floor(Math.random() * 10000);

  system.runInterval(() => {
    world.sendMessage("This is an interval run " + intervalRunIdentifier + " sending a message every 30 seconds.");
  }, 600);
}
