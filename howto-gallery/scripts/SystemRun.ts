import { BlockPermutation, DimensionLocation, system, world } from "@minecraft/server";
import { MinecraftDimensionTypes } from "@minecraft/vanilla-data";

/**
 * A simple tick timer that runs a command every minute.
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
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/system#runInterval
 */
export function every30Seconds(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const intervalRunIdentifier = Math.floor(Math.random() * 10000);

  system.runInterval(() => {
    world.sendMessage("This is an interval run " + intervalRunIdentifier + " sending a message every 30 seconds.");
  }, 600);
}

/**
 * Uses a generator function to, over the span of multiple ticks, provision blocks in a cube.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/system#runJob
 */
export function cubeGenerator(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const blockPerm = BlockPermutation.resolve("minecraft:cobblestone");

  system.runJob(blockPlacingGenerator(blockPerm, targetLocation, 15));
}

function* blockPlacingGenerator(blockPerm: BlockPermutation, startingLocation: DimensionLocation, size: number) {
  for (let x = startingLocation.x; x < startingLocation.x + size; x++) {
    for (let y = startingLocation.y; y < startingLocation.y + size; y++) {
      for (let z = startingLocation.z; z < startingLocation.z + size; z++) {
        const block = startingLocation.dimension.getBlock({ x: x, y: y, z: z });
        if (block) {
          block.setPermutation(blockPerm);
        }
        yield;
      }
    }
  }
}
