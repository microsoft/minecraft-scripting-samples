import * as mc from "@minecraft/server";

/**
 * Creates an explosion in the world.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/@minecraft/server/dimension#createexplosion
 */
export function createExplosion(log: (message: string, status?: number) => void, targetLocation: mc.Location) {
  const overworld = mc.world.getDimension("overworld");

  log("Creating an explosion of radius 10.");
  overworld.createExplosion(targetLocation, 10);
}

/**
 * Creates an explosion in the world that does not impact blocks.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/@minecraft/server/dimension#createexplosion
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/@minecraft/server/explosionOptions
 */
export function createNoBlockExplosion(log: (message: string, status?: number) => void, targetLocation: mc.Location) {
  const overworld = mc.world.getDimension("overworld");

  const explodeNoBlocksLoc = new mc.Location(
    Math.floor(targetLocation.x + 1),
    Math.floor(targetLocation.y + 2),
    Math.floor(targetLocation.z + 1)
  );

  log("Creating an explosion of radius 15 that does not break blocks.");
  overworld.createExplosion(explodeNoBlocksLoc, 15, { breaksBlocks: false });
}

/**
 * Creates a fire explosion and an underwater explosion in the world.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/@minecraft/server/dimension#createexplosion
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/@minecraft/server/explosionOptions
 */
export function createFireAndWaterExplosions(
  log: (message: string, status?: number) => void,
  targetLocation: mc.Location
) {
  const overworld = mc.world.getDimension("overworld");

  const explosionLoc = new mc.Location(targetLocation.x + 0.5, targetLocation.y + 0.5, targetLocation.z + 0.5);

  log("Creating an explosion of radius 15 that causes fire.");
  overworld.createExplosion(explosionLoc, 15, { causesFire: true });

  const belowWaterLoc = new mc.Location(targetLocation.x + 3, targetLocation.y + 1, targetLocation.z + 3);

  log("Creating an explosion of radius 10 that can go underwater.");
  overworld.createExplosion(belowWaterLoc, 10, { allowUnderwater: true });
}
