import * as mc from "@minecraft/server";

/**
 * Creates an explosion in the world.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/dimension#createexplosion
 */
export function createExplosion(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  const overworld = mc.world.getDimension("overworld");

  log("Creating an explosion of radius 10.");
  overworld.createExplosion(targetLocation, 10);
}

/**
 * Creates an explosion in the world that does not impact blocks.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/dimension#createexplosion
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/explosionOptions
 */
export function createNoBlockExplosion(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  const overworld = mc.world.getDimension("overworld");

  const explodeNoBlocksLoc = {
    x: Math.floor(targetLocation.x + 1),
    y: Math.floor(targetLocation.y + 2),
    z: Math.floor(targetLocation.z + 1)
  };

  log("Creating an explosion of radius 15 that does not break blocks.");
  overworld.createExplosion(explodeNoBlocksLoc, 15, { breaksBlocks: false });
}

/**
 * Creates a fire explosion and an underwater explosion in the world.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/dimension#createexplosion
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/explosionOptions
 */
export function createFireAndWaterExplosions(
  log: (message: string, status?: number) => void,
  targetLocation: mc.Vector3
) {
  const overworld = mc.world.getDimension("overworld");

  const explosionLoc = { x: targetLocation.x + 0.5, y: targetLocation.y + 0.5, z: targetLocation.z + 0.5};

  log("Creating an explosion of radius 15 that causes fire.");
  overworld.createExplosion(explosionLoc, 15, { causesFire: true });

  const belowWaterLoc = { x: targetLocation.x + 3, y: targetLocation.y + 1,z: targetLocation.z + 3};

  log("Creating an explosion of radius 10 that can go underwater.");
  overworld.createExplosion(belowWaterLoc, 10, { allowUnderwater: true });
}
