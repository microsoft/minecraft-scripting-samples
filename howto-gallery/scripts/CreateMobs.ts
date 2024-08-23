import * as mc from "@minecraft/server";
import * as vanilla from "@minecraft/vanilla-data";

/**
 * Creates a fox and, well, a wolf with effects applied.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/dimension#spawnentity
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/entity#addeffect
 */
export function quickFoxLazyDog(log: (message: string, status?: number) => void, targetLocation: mc.DimensionLocation) {
  const fox = targetLocation.dimension.spawnEntity(vanilla.MinecraftEntityTypes.Fox, {
    x: targetLocation.x + 1,
    y: targetLocation.y + 2,
    z: targetLocation.z + 3,
  });

  fox.addEffect(vanilla.MinecraftEffectTypes.Speed, 10, {
    amplifier: 2,
  });
  log("Created a fox.");

  const wolf = targetLocation.dimension.spawnEntity(vanilla.MinecraftEntityTypes.Wolf, {
    x: targetLocation.x + 4,
    y: targetLocation.y + 2,
    z: targetLocation.z + 3,
  });
  wolf.addEffect(vanilla.MinecraftEffectTypes.Slowness, 10, {
    amplifier: 2,
  });
  wolf.isSneaking = true;
  log("Created a sneaking wolf.", 1);
}
