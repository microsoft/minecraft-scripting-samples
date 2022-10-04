import * as mc from "@minecraft/server";

/**
 * A simple tick timer that runs a command every minute.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/@minecraft/server/tickevent
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/@minecraft/server/tickeventsignal
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/@minecraft/server/events#tick
 */
let ticks = 0;

export function trapTick() {
  const overworld = mc.world.getDimension("overworld");

  try {
    // Minecraft runs at 20 ticks per second
    if (ticks % 1200 === 0) {
      overworld.runCommandAsync("say Another minute passes...");
    }

    ticks++;
  } catch (e) {
    console.warn("Error: " + e);
  }

  mc.system.run(trapTick);
}

trapTick();
