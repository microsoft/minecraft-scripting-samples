import * as mc from "@minecraft/server";
import { MinecraftBlockTypes, MinecraftDimensionTypes } from "@minecraft/vanilla-data";

/**
 * A simple button push before event
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/buttonpushaftereventsignal
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/buttonpushafterevent
 */
export function buttonPushEvent(log: (message: string, status?: number) => void, targetLocation: mc.DimensionLocation) {
  // set up a button on cobblestone
  const cobblestone = targetLocation.dimension.getBlock(targetLocation);
  const button = targetLocation.dimension.getBlock({
    x: targetLocation.x,
    y: targetLocation.y + 1,
    z: targetLocation.z,
  });

  if (cobblestone === undefined || button === undefined) {
    log("Could not find block at location.");
    return -1;
  }

  cobblestone.setPermutation(mc.BlockPermutation.resolve(MinecraftBlockTypes.Cobblestone));
  button.setPermutation(
    mc.BlockPermutation.resolve(MinecraftBlockTypes.AcaciaButton).withState("facing_direction", 1 /* up */)
  );

  mc.world.afterEvents.buttonPush.subscribe((buttonPushEvent: mc.ButtonPushAfterEvent) => {
    const eventLoc = buttonPushEvent.block.location;

    if (eventLoc.x === targetLocation.x && eventLoc.y === targetLocation.y + 1 && eventLoc.z === targetLocation.z) {
      log("Button push event at tick " + mc.system.currentTick);
    }
  });
}

/**
 * A simple lever activate event
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/leveractionaftereventsignal
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/leveractionafterevent
 */
export function leverActionEvent(
  log: (message: string, status?: number) => void,
  targetLocation: mc.DimensionLocation
) {
  // set up a lever
  const cobblestone = targetLocation.dimension.getBlock(targetLocation);
  const lever = targetLocation.dimension.getBlock({
    x: targetLocation.x,
    y: targetLocation.y + 1,
    z: targetLocation.z,
  });

  if (cobblestone === undefined || lever === undefined) {
    log("Could not find block at location.");
    return -1;
  }

  cobblestone.setPermutation(mc.BlockPermutation.resolve(MinecraftBlockTypes.Cobblestone));
  lever.setPermutation(
    mc.BlockPermutation.resolve(MinecraftBlockTypes.Lever).withState("lever_direction", "up_north_south" /* up */)
  );

  mc.world.afterEvents.leverAction.subscribe((leverActionEvent: mc.LeverActionAfterEvent) => {
    const eventLoc = leverActionEvent.block.location;

    if (eventLoc.x === targetLocation.x && eventLoc.y === targetLocation.y + 1 && eventLoc.z === targetLocation.z) {
      log("Lever activate event at tick " + mc.system.currentTick);
    }
  });
}

/**
 * A basic tripwire event
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/tripwiretripaftereventsignal
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/tripwiretripafterevent
 */
export function tripWireTripEvent(
  log: (message: string, status?: number) => void,
  targetLocation: mc.DimensionLocation
) {
  // set up a tripwire
  const redstone = targetLocation.dimension.getBlock({
    x: targetLocation.x,
    y: targetLocation.y - 1,
    z: targetLocation.z,
  });
  const tripwire = targetLocation.dimension.getBlock(targetLocation);

  if (redstone === undefined || tripwire === undefined) {
    log("Could not find block at location.");
    return -1;
  }

  redstone.setPermutation(mc.BlockPermutation.resolve(MinecraftBlockTypes.RedstoneBlock));
  tripwire.setPermutation(mc.BlockPermutation.resolve(MinecraftBlockTypes.TripWire));

  mc.world.afterEvents.tripWireTrip.subscribe((tripWireTripEvent: mc.TripWireTripAfterEvent) => {
    const eventLoc = tripWireTripEvent.block.location;

    if (eventLoc.x === targetLocation.x && eventLoc.y === targetLocation.y && eventLoc.z === targetLocation.z) {
      log(
        "Tripwire trip event at tick " +
          mc.system.currentTick +
          (tripWireTripEvent.sources.length > 0 ? " by entity " + tripWireTripEvent.sources[0].id : "")
      );
    }
  });
}
