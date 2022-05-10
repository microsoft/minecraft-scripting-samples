import * as mc from "mojang-minecraft";

const overworld = mc.world.getDimension("overworld");

let pistonActivateCallbacks: ((arg: mc.BeforePistonActivateEvent) => void)[] = [];

/**
 * A simple piston activate event
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://docs.microsoft.com/minecraft/creator/scriptapi/mojang-minecraft/pistonactivateeventsignal#subscribe
 * @see https://docs.microsoft.com/minecraft/creator/scriptapi/mojang-minecraft/pistonactivateevent
 */
export function pistonEvent(log: (message: string, status?: number) => void, targetLocation: mc.Location) {
  let canceled = false;

  const pistonLoc = new mc.BlockLocation(
    Math.floor(targetLocation.x) + 1,
    Math.floor(targetLocation.y) + 2,
    Math.floor(targetLocation.z) + 1
  );

  const pistonCallback = mc.world.events.beforePistonActivate.subscribe((pistonEvent: mc.BeforePistonActivateEvent) => {
    if (pistonEvent.piston.location.equals(pistonLoc)) {
      log("Cancelling piston event");
      pistonEvent.cancel = true;
      canceled = true;
    }
  });

  // clean-up code
  pistonActivateCallbacks.push(pistonCallback);
}
