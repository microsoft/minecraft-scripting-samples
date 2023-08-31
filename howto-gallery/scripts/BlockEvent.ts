import * as mc from "@minecraft/server";

const overworld = mc.world.getDimension("overworld");

/**
 * A simple button push before event
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/buttonpushaftereventsignal
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/buttonpushafterevent
 */
export function buttonPushEvent(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  // set up a button on cobblestone
  let cobblestone = overworld.getBlock(targetLocation);
  let button = overworld.getBlock({ x: targetLocation.x, y: targetLocation.y + 1, z: targetLocation.z });

  if (cobblestone === undefined || button === undefined) {
    log("Could not find block at location.");
    return -1;
  }

  cobblestone.setPermutation(mc.BlockPermutation.resolve("cobblestone"));
  button.setPermutation(mc.BlockPermutation.resolve("acacia_button").withState("facing_direction", 1 /* up */));

  mc.world.afterEvents.buttonPush.subscribe((buttonPushEvent: mc.ButtonPushAfterEvent) => {
    let eventLoc = buttonPushEvent.block.location;

    if (eventLoc.x === targetLocation.x && eventLoc.y === targetLocation.y + 1 && eventLoc.z === targetLocation.z) {
      log("Button push event at tick " + mc.system.currentTick + " Power:" + buttonPushEvent.block.getRedstonePower());
    }
  });
}

/**
 * A simple lever activate event
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/leveractionaftereventsignal
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/leveractionafterevent
 */
export function leverActionEvent(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  // set up a lever
  let cobblestone = overworld.getBlock(targetLocation);
  let lever = overworld.getBlock({ x: targetLocation.x, y: targetLocation.y + 1, z: targetLocation.z });

  if (cobblestone === undefined || lever === undefined) {
    log("Could not find block at location.");
    return -1;
  }

  cobblestone.setPermutation(mc.BlockPermutation.resolve("cobblestone"));
  lever.setPermutation(mc.BlockPermutation.resolve("lever").withState("lever_direction", "up_north_south" /* up */));

  mc.world.afterEvents.leverAction.subscribe((leverActionEvent: mc.LeverActionAfterEvent) => {
    let eventLoc = leverActionEvent.block.location;

    if (eventLoc.x === targetLocation.x && eventLoc.y === targetLocation.y + 1 && eventLoc.z === targetLocation.z) {
      log(
        "Lever activate event at tick " +
          mc.system.currentTick +
          " Power:" +
          leverActionEvent.block.getRedstonePower()
      );
    }
  });
}

/**
 * A basic tripwire event
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/tripwiretripaftereventsignal
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/tripwiretripafterevent
 */
export function tripWireTripEvent(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  // set up a tripwire
  let redstone = overworld.getBlock({ x: targetLocation.x, y: targetLocation.y - 1, z: targetLocation.z });
  let tripwire = overworld.getBlock(targetLocation);

  if (redstone === undefined || tripwire === undefined) {
    log("Could not find block at location.");
    return -1;
  }

  redstone.setPermutation(mc.BlockPermutation.resolve("redstone_block"));
  tripwire.setPermutation(mc.BlockPermutation.resolve("tripwire"));

  mc.world.afterEvents.tripWireTrip.subscribe((tripWireTripEvent: mc.TripWireTripAfterEvent) => {
    let eventLoc = tripWireTripEvent.block.location;

    if (eventLoc.x === targetLocation.x && eventLoc.y === targetLocation.y && eventLoc.z === targetLocation.z) {
      log(
        "Tripwire trip event at tick " +
          mc.system.currentTick +
          (tripWireTripEvent.sources.length > 0 ? " by entity " + tripWireTripEvent.sources[0].id : "")
      );
    }
  });
}
