import * as mc from "mojang-minecraft";

// https://docs.microsoft.com/minecraft/creator/scriptapi/mojang-minecraft/dimension#spawnItem
export function spawnItem(log: (message: string, status?: number) => void, targetLocation: mc.Location) {
  const overworld = mc.world.getDimension("overworld");

  const featherItem = new mc.ItemStack(mc.MinecraftItemTypes.feather, 1, 0);

  overworld.spawnItem(featherItem, targetLocation);
  log("New feather created!");
}

export function testThatEntityIsFeatherItem(
  log: (message: string, status?: number) => void,
  targetLocation: mc.Location
) {
  const overworld = mc.world.getDimension("overworld");

  const featherItem = new mc.ItemStack(mc.MinecraftItemTypes.feather, 1, 0);

  overworld.spawnItem(featherItem, targetLocation);
}
