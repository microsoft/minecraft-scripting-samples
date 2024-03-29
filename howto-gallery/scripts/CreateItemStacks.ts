import * as mc from "@minecraft/server";
import { MinecraftDimensionTypes, MinecraftEnchantmentTypes, MinecraftItemTypes } from "@minecraft/vanilla-data";

/**
 * Creates free-floating item stacks in the world.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/itemStack
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/dimension#spawnitem
 */
export function itemStacks(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  const overworld = mc.world.getDimension(MinecraftDimensionTypes.Overworld);

  const oneItemLoc = { x: targetLocation.x + targetLocation.y + 3, y: 2, z: targetLocation.z + 1 };
  const fiveItemsLoc = { x: targetLocation.x + 1, y: targetLocation.y + 2, z: targetLocation.z + 1 };
  const diamondPickaxeLoc = { x: targetLocation.x + 2, y: targetLocation.y + 2, z: targetLocation.z + 4 };

  const oneEmerald = new mc.ItemStack(MinecraftItemTypes.Emerald, 1);
  const onePickaxe = new mc.ItemStack(MinecraftItemTypes.DiamondPickaxe, 1);
  const fiveEmeralds = new mc.ItemStack(MinecraftItemTypes.Emerald, 5);

  log(`Spawning an emerald at (${oneItemLoc.x}, ${oneItemLoc.y}, ${oneItemLoc.z})`);
  overworld.spawnItem(oneEmerald, oneItemLoc);

  log(`Spawning five emeralds at (${fiveItemsLoc.x}, ${fiveItemsLoc.y}, ${fiveItemsLoc.z})`);
  overworld.spawnItem(fiveEmeralds, fiveItemsLoc);

  log(`Spawning a diamond pickaxe at (${diamondPickaxeLoc.x}, ${diamondPickaxeLoc.y}, ${diamondPickaxeLoc.z})`);
  overworld.spawnItem(onePickaxe, diamondPickaxeLoc);
}

/**
 * Creates a sword with custom lore.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/itemStack
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/enchantment
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/itemStack#setlore
 */
export function diamondAwesomeSword(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  const diamondAwesomeSword = new mc.ItemStack(MinecraftItemTypes.DiamondSword, 1);
  const players = mc.world.getAllPlayers();

  // hover over/select the item in your inventory to see the lore.
  diamondAwesomeSword.setLore(["§c§lDiamond Sword of Awesome§r", "+10 coolness", "§p+4 shiny§r"]);

  const enchants = diamondAwesomeSword.getComponent(mc.ItemComponentTypes.Enchantable);
  enchants?.addEnchantment({ type: MinecraftEnchantmentTypes.Knockback, level: 3 });

  const inventory = players[0].getComponent(mc.EntityComponentTypes.Inventory);
  inventory?.container?.setItem(0, diamondAwesomeSword);
}

/**
 * Creates a sword with fire effects.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/itemStack
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/Enchantment
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/ItemEnchantsComponent
 */
export function ironFireSword(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  const ironFireSword = new mc.ItemStack(MinecraftItemTypes.IronSword, 1);
  const players = mc.world.getAllPlayers();

  const enchants = ironFireSword.getComponent(mc.ItemComponentTypes.Enchantable);
  enchants?.addEnchantment({ type: MinecraftEnchantmentTypes.FireAspect, level: 3 });

  if (!enchants?.hasEnchantment(MinecraftEnchantmentTypes.FireAspect)) {
    log("Could not add fire aspect.");
    return -1;
  }

  const inventory = players[0].getComponent(mc.EntityComponentTypes.Inventory);
  inventory?.container?.setItem(0, ironFireSword);
}
