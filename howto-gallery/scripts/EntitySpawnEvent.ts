import { Vector3Utils } from "@minecraft/math";
import { DimensionLocation, EntitySpawnAfterEvent, system, world } from "@minecraft/server";

/**
 * Registers and contains an entity spawned event handler.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/entityspawnaftereventsignal#subscribe
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/entityspawnafterevent
 */
export function logEntitySpawnEvent(
  log: (message: string, status?: number) => void,
  targetLocation: DimensionLocation
) {
  // register a new function that is called when a new entity is created.
  world.afterEvents.entitySpawn.subscribe((entityEvent: EntitySpawnAfterEvent) => {
    if (entityEvent && entityEvent.entity) {
      log(`New entity of type '${entityEvent.entity.typeId}' created!`, 1);
    } else {
      log(`The entity event didn't work as expected.`, -1);
    }
  });

  system.runTimeout(() => {
    spawnAdultHorse(log, targetLocation);
  }, 20);
}

/**
 * A simple function to create a horse.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/dimension#spawnentity
 */
export function spawnAdultHorse(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  log("Create a horse and triggering the 'ageable_grow_up' event, ensuring the horse is created as an adult");
  targetLocation.dimension.spawnEntity(
    "minecraft:horse<minecraft:ageable_grow_up>",
    Vector3Utils.add(targetLocation, { x: 0, y: 1, z: 0 })
  );
}
