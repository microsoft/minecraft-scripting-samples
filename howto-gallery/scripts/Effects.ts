import { DimensionLocation } from "@minecraft/server";
import { MinecraftEffectTypes } from "@minecraft/vanilla-data";

/**
 * Spawns a villager and gives it a poison effect.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/Entity#addEffect
 */
export function spawnPoisonedVillager(
  log: (message: string, status?: number) => void,
  targetLocation: DimensionLocation
) {
  const villagerType = "minecraft:villager_v2";
  const villager = targetLocation.dimension.spawnEntity(villagerType, targetLocation, {
        spawnEvent: "minecraft:ageable_grow_up"
      });
      
  const duration = 20;

  villager.addEffect(MinecraftEffectTypes.Poison, duration, { amplifier: 1 });
}
