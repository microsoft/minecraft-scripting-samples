import * as mc from "mojang-minecraft";

const overworld = mc.world.getDimension("overworld");

/**
 * Creates a free-floating feather item in the world.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://docs.microsoft.com/minecraft/creator/scriptapi/mojang-minecraft/itemStack
 * @see https://docs.microsoft.com/minecraft/creator/scriptapi/mojang-minecraft/dimension#spawnitem
 */
export function spawnItem(log: (message: string, status?: number) => void, targetLocation: mc.Location) {
  const featherItem = new mc.ItemStack(mc.MinecraftItemTypes.feather, 1, 0);

  overworld.spawnItem(featherItem, targetLocation);
  log("New feather created!");
}

export function testThatEntityIsFeatherItem(
  log: (message: string, status?: number) => void,
  targetLocation: mc.Location
) {
  const featherItem = new mc.ItemStack(mc.MinecraftItemTypes.feather, 1, 0);

  overworld.spawnItem(featherItem, targetLocation);
}
