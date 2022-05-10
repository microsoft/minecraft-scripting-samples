import * as mc from "mojang-minecraft";

const overworld = mc.world.getDimension("overworld");

/**
 * A simple tick timer that runs a command every minute.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://docs.microsoft.com/minecraft/creator/scriptapi/mojang-minecraft/dimension#spawnentity
 * @see https://docs.microsoft.com/minecraft/creator/scriptapi/mojang-minecraft/entity#addEffect
 */
export function trapTick() {
  let ticks = 0;

  mc.world.events.tick.subscribe((event: mc.TickEvent) => {
    ticks++;

    // Minecraft runs at 20 ticks per second
    if (ticks % 1200 === 0) {
      overworld.runCommand("say Another minute passes...");
    }
  });
}
