import * as mc from "@minecraft/server";

/**
 * Creates free-floating item stacks in the world.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/itemStack
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/dimension#spawnitem
 */
export function itemStacks(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  const overworld = mc.world.getDimension("overworld");

  const oneItemLoc = { x: targetLocation.x + targetLocation.y + 3, y: 2, z: targetLocation.z + 1};
  const fiveItemsLoc = { x: targetLocation.x + 1, y: targetLocation.y + 2, z: targetLocation.z + 1};
  const diamondPickaxeLoc = { x: targetLocation.x + 2, y: targetLocation.y + 2, z: targetLocation.z + 4};

  const oneEmerald = new mc.ItemStack(mc.MinecraftItemTypes.emerald, 1);
  const onePickaxe = new mc.ItemStack(mc.MinecraftItemTypes.diamondPickaxe, 1);
  const fiveEmeralds = new mc.ItemStack(mc.MinecraftItemTypes.emerald, 5);

  log(`Spawning an emerald at (${oneItemLoc.x}, ${oneItemLoc.y}, ${oneItemLoc.z})`);
  overworld.spawnItem(oneEmerald, oneItemLoc);

  log(`Spawning five emeralds at (${fiveItemsLoc.x}, ${fiveItemsLoc.y}, ${fiveItemsLoc.z})`);
  overworld.spawnItem(fiveEmeralds, fiveItemsLoc);

  log(`Spawning a diamond pickaxe at (${diamondPickaxeLoc.x}, ${diamondPickaxeLoc.y}, ${diamondPickaxeLoc.z})`);
  overworld.spawnItem(onePickaxe, diamondPickaxeLoc);
}
