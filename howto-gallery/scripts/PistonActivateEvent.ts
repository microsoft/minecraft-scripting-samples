import * as mc from "@minecraft/server";

const overworld = mc.world.getDimension("overworld");

/**
 * A simple piston activate event
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/pistonactivateeventsignal#subscribe
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/pistonactivateevent
 */
export function pistonEvent(log: (message: string, status?: number) => void, targetLocation: mc.Location) {
  const pistonLoc = new mc.BlockLocation(
    Math.floor(targetLocation.x) + 1,
    Math.floor(targetLocation.y) + 2,
    Math.floor(targetLocation.z) + 1
  );

  mc.world.events.beforePistonActivate.subscribe((pistonEvent: mc.BeforePistonActivateEvent) => {
    if (pistonEvent.piston.location.equals(pistonLoc)) {
      log("Cancelling piston event");
      pistonEvent.cancel = true;
    }
  });
}
