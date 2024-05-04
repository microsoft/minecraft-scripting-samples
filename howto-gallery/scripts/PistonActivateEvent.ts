import * as mc from "@minecraft/server";
import { MinecraftBlockTypes, MinecraftDimensionTypes } from "@minecraft/vanilla-data";

/**
 * A simple piston after activate event
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/pistonactivateaftereventsignal#subscribe
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/pistonactivateafterevent
 */
export function pistonAfterEvent(
  log: (message: string, status?: number) => void,
  targetLocation: mc.DimensionLocation
) {
  // set up a couple of piston blocks
  let piston = targetLocation.dimension.getBlock(targetLocation);
  let button = targetLocation.dimension.getBlock({ x: targetLocation.x, y: targetLocation.y + 1, z: targetLocation.z });

  if (piston === undefined || button === undefined) {
    log("Could not find block at location.");
    return -1;
  }

  piston.setPermutation(mc.BlockPermutation.resolve(MinecraftBlockTypes.Piston).withState("facing_direction", 3));
  button.setPermutation(mc.BlockPermutation.resolve(MinecraftBlockTypes.AcaciaButton).withState("facing_direction", 1));

  mc.world.afterEvents.pistonActivate.subscribe((pistonEvent: mc.PistonActivateAfterEvent) => {
    let eventLoc = pistonEvent.piston.block.location;

    if (eventLoc.x === targetLocation.x && eventLoc.y === targetLocation.y && eventLoc.z === targetLocation.z) {
      log(
        "Piston event at " +
          mc.system.currentTick +
          (pistonEvent.piston.isMoving ? " Moving" : "") +
          (pistonEvent.piston.state === mc.BlockPistonState.Expanding ? " Expanding" : "") +
          (pistonEvent.piston.state === mc.BlockPistonState.Expanded ? " Expanded" : "") +
          (pistonEvent.piston.state === mc.BlockPistonState.Retracting ? " Retracting" : "") +
          (pistonEvent.piston.state === mc.BlockPistonState.Retracted ? " Retracted" : "")
      );
    }
  });
}
