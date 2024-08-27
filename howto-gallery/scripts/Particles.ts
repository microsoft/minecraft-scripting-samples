import { DimensionLocation, MolangVariableMap } from "@minecraft/server";

/**
 * Spawns a cloud of colored flame particles.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/dimension#spawnparticle
 */
export function spawnParticle(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  for (let i = 0; i < 100; i++) {
    const molang = new MolangVariableMap();

    molang.setColorRGB("variable.color", { red: Math.random(), green: Math.random(), blue: Math.random() });

    let newLocation = {
      x: targetLocation.x + Math.floor(Math.random() * 8) - 4,
      y: targetLocation.y + Math.floor(Math.random() * 8) - 4,
      z: targetLocation.z + Math.floor(Math.random() * 8) - 4,
    };
    targetLocation.dimension.spawnParticle("minecraft:colored_flame_particle", newLocation, molang);
  }
}
