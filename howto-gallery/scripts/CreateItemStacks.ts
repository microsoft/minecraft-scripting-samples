import * as mc from "@minecraft/server";

const overworld = mc.world.getDimension("overworld");
/**
 * Creates free-floating item stacks in the world.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/itemStack
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/dimension#spawnitem
 */
export function itemStacks(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  const overworld = mc.world.getDimension("overworld");

  const oneItemLoc = { x: targetLocation.x + targetLocation.y + 3, y: 2, z: targetLocation.z + 1 };
  const fiveItemsLoc = { x: targetLocation.x + 1, y: targetLocation.y + 2, z: targetLocation.z + 1 };
  const diamondPickaxeLoc = { x: targetLocation.x + 2, y: targetLocation.y + 2, z: targetLocation.z + 4 };

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

/**
 * Creates a sword with custom lore.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/itemStack
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/enchantment
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/itemStack#setlore
 */
export function diamondAwesomeSword(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  const diamondAwesomeSword = new mc.ItemStack(mc.MinecraftItemTypes.diamondSword, 1);
  let players = mc.world.getAllPlayers();

  diamondAwesomeSword.setLore(["§c§lDiamond Sword of Awesome§r", "+10 coolness", "§p+4 shiny§r"]);

  // hover over/select the item in your inventory to see the lore.
  const inventory = players[0].getComponent("inventory") as mc.EntityInventoryComponent;
  inventory.container.setItem(0, diamondAwesomeSword);

  let item = inventory.container.getItem(0);

  if (item) {
    let enchants = item.getComponent("minecraft:enchantments") as mc.ItemEnchantsComponent;
    let knockbackEnchant = new mc.Enchantment("knockback", 3);
    enchants.enchantments.addEnchantment(knockbackEnchant);
  }
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
  const ironFireSword = new mc.ItemStack(mc.MinecraftItemTypes.diamondSword, 1);
  let players = mc.world.getAllPlayers();

  let fireAspectEnchant = new mc.Enchantment("fire_aspect", 3);
  let enchants = ironFireSword.getComponent("minecraft:enchantments") as mc.ItemEnchantsComponent;
  let addedFire = enchants.enchantments.addEnchantment(fireAspectEnchant);

  if (!addedFire) {
    log("Could not add fire aspect.");
    return -1;
  }

  const inventory = players[0].getComponent("inventory") as mc.EntityInventoryComponent;
  inventory.container.setItem(0, ironFireSword);

  // hover over/select the item in your inventory to see the lore.
}
