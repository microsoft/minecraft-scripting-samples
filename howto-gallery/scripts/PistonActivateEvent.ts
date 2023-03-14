import * as mc from "@minecraft/server";

const overworld = mc.world.getDimension("overworld");

/**
 * A simple piston activate event
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/pistonactivateeventsignal#subscribe
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/pistonactivateevent
 */
export function pistonEvent(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  const pistonLoc = {
    x: Math.floor(targetLocation.x) + 1,
    y: Math.floor(targetLocation.y) + 2,
    z: Math.floor(targetLocation.z) + 1
  };

  mc.world.events.beforePistonActivate.subscribe((pistonEvent: mc.BeforePistonActivateEvent) => {
    let eventLoc =pistonEvent.piston.block.location 
    if (eventLoc.x === pistonLoc.x && eventLoc.y === pistonLoc.y && eventLoc.z === pistonLoc.z) {
      log("Cancelling piston event");
      pistonEvent.cancel = true;
    }
  });
}
