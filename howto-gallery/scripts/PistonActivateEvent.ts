import * as mc from "@minecraft/server";

const overworld = mc.world.getDimension("overworld");

/**
 * A simple piston before activate event
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/pistonactivatebeforeeventsignal#subscribe
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/pistonactivatebeforeevent
 */
export function pistonBeforeEvent(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  // set up a couple of piston blocks
  let piston = overworld.getBlock(targetLocation);
  let button = overworld.getBlock({ x: targetLocation.x, y: targetLocation.y + 1, z: targetLocation.z });

  if (piston === undefined || button === undefined) {
    log("Could not find block at location.");
    return -1;
  }

  piston.setPermutation(mc.BlockPermutation.resolve("piston").withState("facing_direction", 3));
  button.setPermutation(mc.BlockPermutation.resolve("acacia_button").withState("facing_direction", 1));

  const uncanceledPistonLoc = {
    x: Math.floor(targetLocation.x) + 2,
    y: Math.floor(targetLocation.y),
    z: Math.floor(targetLocation.z) + 2,
  };

  // this is our control.
  let uncanceledPiston = overworld.getBlock(uncanceledPistonLoc);
  let uncanceledButton = overworld.getBlock({
    x: uncanceledPistonLoc.x,
    y: uncanceledPistonLoc.y + 1,
    z: uncanceledPistonLoc.z,
  });

  if (uncanceledPiston === undefined || uncanceledButton === undefined) {
    log("Could not find block at location.");
    return -1;
  }

  uncanceledPiston.setPermutation(mc.BlockPermutation.resolve("piston").withState("facing_direction", 3));
  uncanceledButton.setPermutation(mc.BlockPermutation.resolve("acacia_button").withState("facing_direction", 1));

  mc.world.beforeEvents.pistonActivate.subscribe((pistonEvent: mc.PistonActivateBeforeEvent) => {
    let eventLoc = pistonEvent.piston.block.location;
    if (eventLoc.x === targetLocation.x && eventLoc.y === targetLocation.y && eventLoc.z === targetLocation.z) {
      log("Cancelling piston event");
      pistonEvent.cancel = true;
    }
  });
}

/**
 * A simple piston before activate event
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/pistonactivateaftereventsignal#subscribe
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/pistonactivateafterevent
 */
export function pistonAfterEvent(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  // set up a couple of piston blocks
  let piston = overworld.getBlock(targetLocation);
  let button = overworld.getBlock({ x: targetLocation.x, y: targetLocation.y + 1, z: targetLocation.z });

  if (piston === undefined || button === undefined) {
    log("Could not find block at location.");
    return -1;
  }

  piston.setPermutation(mc.BlockPermutation.resolve("piston").withState("facing_direction", 3));
  button.setPermutation(mc.BlockPermutation.resolve("acacia_button").withState("facing_direction", 1));

  mc.world.afterEvents.pistonActivate.subscribe((pistonEvent: mc.PistonActivateAfterEvent) => {
    let eventLoc = pistonEvent.piston.block.location;

    if (eventLoc.x === targetLocation.x && eventLoc.y === targetLocation.y && eventLoc.z === targetLocation.z) {
      log(
        "Piston event at " +
          mc.system.currentTick +
          (pistonEvent.piston.isMoving ? " Moving" : "") +
          (pistonEvent.piston.isExpanding ? " Expanding" : "") +
          (pistonEvent.piston.isExpanded ? " Expanded" : "") +
          (pistonEvent.piston.isRetracting ? " Retracting" : "") +
          (pistonEvent.piston.isRetracted ? " Retracted" : "")
      );
    }
  });
}
