import * as mc from "mojang-minecraft";

let entityCreatedCallbacks: ((arg: mc.EntityCreateEvent) => void)[] = [];

/// https://docs.microsoft.com/minecraft/creator/scriptapi/mojang-minecraft/entitycreateeventsignal#subscribe
/// https://docs.microsoft.com/minecraft/creator/scriptapi/mojang-minecraft/entitycreateevent
/// Registers and contains an entity created event handler
export function runEntityCreatedEvent(log: (message: string, status?: number) => void, targetLocation: mc.Location) {
  // register a new function that is called when a new entity is created.
  const entityCreatedCallback = mc.world.events.entityCreate.subscribe((entityEvent: mc.EntityCreateEvent) => {
    if (entityEvent && entityEvent.entity) {
      log("New entity of type '" + +entityEvent.entity + "' created!", 1);
    } else {
      log("The entity event didn't work as expected.", -1);
    }
  });

  // clean-up code
  entityCreatedCallbacks.push(entityCreatedCallback);
}

// https://docs.microsoft.com/minecraft/creator/scriptapi/mojang-minecraft/dimension#spawnentity
// a simple function to create a horse
export function createOldHorse(log: (message: string, status?: number) => void, targetLocation: mc.Location) {
  const overworld = mc.world.getDimension("overworld");

  // create a horse and trigger the 'ageable_grow_up' event, ensuring the horse is created as an adult
  overworld.spawnEntity("minecraft:horse<minecraft:ageable_grow_up>", targetLocation);
}

// https://docs.microsoft.com/minecraft/creator/scriptapi/mojang-minecraft/entitycreateeventsignal#unsubscribe
// clean up after ourselves and remove an event.
export function unsubscribeEntityCreatedEvent(
  log: (message: string, status?: number) => void,
  targetLocation: mc.Location
) {
  if (entityCreatedCallbacks.length > 0) {
    let callback = entityCreatedCallbacks.pop();

    if (callback) {
      mc.world.events.entityCreate.unsubscribe(callback);
    }
  }
}
