import * as mc from "mojang-minecraft";

const overworld = mc.world.getDimension("overworld");

/**
 * Creates an explosion in the world.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://docs.microsoft.com/minecraft/creator/scriptapi/mojang-minecraft/dimension#createexplosion
 */
export function createExplosion(log: (message: string, status?: number) => void, targetLocation: mc.Location) {
  overworld.createExplosion(targetLocation, 10, new mc.ExplosionOptions());
}

/**
 * Creates an explosion in the world that does not impact blocks.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://docs.microsoft.com/minecraft/creator/scriptapi/mojang-minecraft/dimension#createexplosion
 * @see https://docs.microsoft.com/minecraft/creator/scriptapi/mojang-minecraft/explosionOptions
 */
export function createNoBlockExplosion(log: (message: string, status?: number) => void, targetLocation: mc.Location) {
  const explosionOptions = new mc.ExplosionOptions();

  // Start by exploding without breaking blocks
  explosionOptions.breaksBlocks = false;

  const explodeNoBlocksLoc = new mc.Location(
    Math.floor(targetLocation.x + 1),
    Math.floor(targetLocation.y + 2),
    Math.floor(targetLocation.z + 1)
  );

  overworld.createExplosion(explodeNoBlocksLoc, 15, explosionOptions);
}

/**
 * Creates a fire explosion and an underwater explosion in the world.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://docs.microsoft.com/minecraft/creator/scriptapi/mojang-minecraft/dimension#createexplosion
 * @see https://docs.microsoft.com/minecraft/creator/scriptapi/mojang-minecraft/explosionOptions
 */
export function createFireAndWaterExplosions(
  log: (message: string, status?: number) => void,
  targetLocation: mc.Location
) {
  const explosionLoc = new mc.Location(targetLocation.x + 0.5, targetLocation.y + 0.5, targetLocation.z + 0.5);

  const fireExplosionOptions = new mc.ExplosionOptions();

  // Explode with fire
  fireExplosionOptions.causesFire = true;

  overworld.createExplosion(explosionLoc, 15, fireExplosionOptions);
  const waterExplosionOptions = new mc.ExplosionOptions();

  // Explode in water
  waterExplosionOptions.allowUnderwater = true;

  const belowWaterLoc = new mc.Location(targetLocation.x + 3, targetLocation.y + 1, targetLocation.z + 3);

  overworld.createExplosion(belowWaterLoc, 10, waterExplosionOptions);
}
