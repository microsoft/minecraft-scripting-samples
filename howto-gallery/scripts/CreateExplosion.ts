import * as mc from "@minecraft/server";
import * as math from "@minecraft/math";

/**
 * Creates an explosion in the world.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/dimension#createexplosion
 */
export function createExplosion(log: (message: string, status?: number) => void, targetLocation: mc.DimensionLocation) {
  log("Creating an explosion of radius 10.");
  targetLocation.dimension.createExplosion(targetLocation, 10);
}

/**
 * Creates an explosion in the world that does not impact blocks.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/dimension#createexplosion
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/explosionOptions
 */
export function createNoBlockExplosion(
  log: (message: string, status?: number) => void,
  targetLocation: mc.DimensionLocation
) {
  const explodeNoBlocksLoc = math.Vector3Utils.floor(math.Vector3Utils.add(targetLocation, { x: 1, y: 2, z: 1 }));

  log("Creating an explosion of radius 15 that does not break blocks.");
  targetLocation.dimension.createExplosion(explodeNoBlocksLoc, 15, { breaksBlocks: false });
}

/**
 * Creates a fire explosion and an underwater explosion in the world.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/dimension#createexplosion
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/explosionOptions
 */
export function createExplosions(
  log: (message: string, status?: number) => void,
  targetLocation: mc.DimensionLocation
) {
  const explosionLoc = math.Vector3Utils.add(targetLocation, { x: 0.5, y: 0.5, z: 0.5 });

  log("Creating an explosion of radius 15 that causes fire.");
  targetLocation.dimension.createExplosion(explosionLoc, 15, { causesFire: true });

  const belowWaterLoc = math.Vector3Utils.add(targetLocation, { x: 3, y: 1, z: 3 });

  log("Creating an explosion of radius 10 that can go underwater.");
  targetLocation.dimension.createExplosion(belowWaterLoc, 10, { allowUnderwater: true });
}
