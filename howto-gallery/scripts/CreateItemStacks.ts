import * as mc from "mojang-minecraft";

const overworld = mc.world.getDimension("overworld");

/**
 * Creates free-floating item stacks in the world.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://docs.microsoft.com/minecraft/creator/scriptapi/mojang-minecraft/itemStack
 * @see https://docs.microsoft.com/minecraft/creator/scriptapi/mojang-minecraft/dimension#spawnitem
 */
export function itemStacks(log: (message: string, status?: number) => void, targetLocation: mc.Location) {
  const oneItemLoc = new mc.BlockLocation(3, 2, 1);
  const fiveItemsLoc = new mc.BlockLocation(1, 2, 1);
  const diamondPickaxeLoc = new mc.BlockLocation(2, 2, 4);

  const oneEmerald = new mc.ItemStack(mc.MinecraftItemTypes.emerald, 1, 0);
  const onePickaxe = new mc.ItemStack(mc.MinecraftItemTypes.diamondPickaxe, 1, 0);
  const fiveEmeralds = new mc.ItemStack(mc.MinecraftItemTypes.emerald, 5, 0);

  overworld.spawnItem(oneEmerald, oneItemLoc);
  overworld.spawnItem(fiveEmeralds, fiveItemsLoc);
  overworld.spawnItem(onePickaxe, diamondPickaxeLoc);
}
