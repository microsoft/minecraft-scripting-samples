import * as mc from "@minecraft/server";

const overworld = mc.world.getDimension("overworld");

/**
 * Spawns a cloud of colored flame particles.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/dimension#spawnparticle
 */
export function spawnParticle(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  for (let i = 0; i < 100; i++) {
    const molang = new mc.MolangVariableMap();

    molang.setColorRGB("variable.color", { red: Math.random(), green: Math.random(), blue: Math.random(), alpha: 1 });

    let newLocation = {
      x: targetLocation.x + Math.floor(Math.random() * 8) - 4,
      y: targetLocation.y + Math.floor(Math.random() * 8) - 4,
      z: targetLocation.z + Math.floor(Math.random() * 8) - 4,
    };
    overworld.spawnParticle("minecraft:colored_flame_particle", newLocation, molang);
  }
}
