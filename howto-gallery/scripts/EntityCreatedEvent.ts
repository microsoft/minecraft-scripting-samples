import * as mc from "mojang-minecraft";

const overworld = mc.world.getDimension("overworld");

/**
 * Registers and contains an entity created event handler.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://docs.microsoft.com/minecraft/creator/scriptapi/mojang-minecraft/entitycreateeventsignal#subscribe
 * @see https://docs.microsoft.com/minecraft/creator/scriptapi/mojang-minecraft/entitycreateevent
 */
export function runEntityCreatedEvent(log: (message: string, status?: number) => void, targetLocation: mc.Location) {
  // register a new function that is called when a new entity is created.
  const entityCreatedCallback = mc.world.events.entityCreate.subscribe((entityEvent: mc.EntityCreateEvent) => {
    if (entityEvent && entityEvent.entity) {
      log("New entity of type '" + +entityEvent.entity + "' created!", 1);
    } else {
      log("The entity event didn't work as expected.", -1);
    }
  });
}

/**
 * A simple function to create a horse.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://docs.microsoft.com/minecraft/creator/scriptapi/mojang-minecraft/dimension#spawnentity
 */
export function createOldHorse(log: (message: string, status?: number) => void, targetLocation: mc.Location) {
  // create a horse and trigger the 'ageable_grow_up' event, ensuring the horse is created as an adult
  overworld.spawnEntity("minecraft:horse<minecraft:ageable_grow_up>", targetLocation);
}
