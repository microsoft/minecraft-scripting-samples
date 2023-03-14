import * as mc from "@minecraft/server";

const overworld = mc.world.getDimension("overworld");

/**
 * Creates a fox and, well, a wolf with effects applied.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/dimension#spawnentity
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/entity#addeffect
 */
export function quickFoxLazyDog(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  const overworld = mc.world.getDimension("overworld");

  const fox = overworld.spawnEntity(
    "minecraft:fox",
    { x: targetLocation.x + 1, y: targetLocation.y + 2, z: targetLocation.z + 3}
  );
  fox.addEffect(mc.MinecraftEffectTypes.speed, 10, 20);
  log("Created a fox.");

  const wolf = overworld.spawnEntity(
    "minecraft:wolf",
    { x: targetLocation.x + 4, y: targetLocation.y + 2, z: targetLocation.z + 3}
  );
  wolf.addEffect(mc.MinecraftEffectTypes.slowness, 10, 20);
  wolf.isSneaking = true;
  log("Created a sneaking wolf.", 1);
}
