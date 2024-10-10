import {
  DimensionLocation,
  EntityComponentTypes,
  EntityInventoryComponent,
  ItemComponentTypes,
  ItemDurabilityComponent,
  ItemStack,
  world,
} from "@minecraft/server";
import { MinecraftEntityTypes, MinecraftItemTypes } from "@minecraft/vanilla-data";

/**
 * Gives a player a half-damaged diamond sword
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/ItemStack#getComponent
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/ItemDurabilityComponent
 */
export function giveHurtDiamondSword(
  log: (message: string, status?: number) => void,
  targetLocation: DimensionLocation
) {
  const hurtDiamondSword = new ItemStack(MinecraftItemTypes.DiamondSword);

  const durabilityComponent = hurtDiamondSword.getComponent(ItemComponentTypes.Durability) as ItemDurabilityComponent;

  if (durabilityComponent !== undefined) {
    durabilityComponent.damage = durabilityComponent.maxDurability / 2;
  }

  for (const player of world.getAllPlayers()) {
    const inventory = player.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent;
    if (inventory && inventory.container) {
      inventory.container.addItem(hurtDiamondSword);
    }
  }
}

/**
 * Gives a player a restricted pickaxe
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/ItemStack#setCanDestroy
 */
export function giveDestroyRestrictedPickaxe(
  log: (message: string, status?: number) => void,
  targetLocation: DimensionLocation
) {
  for (const player of world.getAllPlayers()) {
    const specialPickaxe = new ItemStack(MinecraftItemTypes.DiamondPickaxe);
    specialPickaxe.setCanDestroy([MinecraftItemTypes.Cobblestone, MinecraftItemTypes.Obsidian]);

    const inventory = player.getComponent("inventory") as EntityInventoryComponent;
    if (inventory === undefined || inventory.container === undefined) {
      return;
    }

    inventory.container.addItem(specialPickaxe);
  }
}

/**
 * Gives a player a restricted gold block
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/ItemStack#setCanPlaceOn
 */
export function givePlaceRestrictedGoldBlock(
  log: (message: string, status?: number) => void,
  targetLocation: DimensionLocation
) {
  for (const player of world.getAllPlayers()) {
    const specialGoldBlock = new ItemStack(MinecraftItemTypes.GoldBlock);
    specialGoldBlock.setCanPlaceOn([MinecraftItemTypes.GrassBlock, MinecraftItemTypes.Dirt]);

    const inventory = player.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent;
    if (inventory === undefined || inventory.container === undefined) {
      return;
    }

    inventory.container.addItem(specialGoldBlock);
  }
}

/**
 * Gives a player a diamond sword with custom lore text
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/ItemStack#addLore
 */
export function diamondAwesomeSword(
  log: (message: string, status?: number) => void,
  targetLocation: DimensionLocation
) {
  for (const player of world.getAllPlayers()) {
    const diamondAwesomeSword = new ItemStack(MinecraftItemTypes.DiamondSword, 1);
    diamondAwesomeSword.setLore(["§c§lDiamond Sword of Awesome§r", "+10 coolness", "§p+4 shiny§r"]);

    // hover over/select the item in your inventory to see the lore.
    const inventory = player.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent;
    if (inventory === undefined || inventory.container === undefined) {
      return;
    }

    inventory.container.setItem(0, diamondAwesomeSword);
  }
}

/**
 * Gets the first hotbar item
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/Container#getItem
 */
export function getFirstHotbarItem(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  for (const player of world.getAllPlayers()) {
    const inventory = player.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent;
    if (inventory && inventory.container) {
      const firstItem = inventory.container.getItem(0);

      if (firstItem) {
        log("First item in hotbar is: " + firstItem.typeId);
      }

      return inventory.container.getItem(0);
    }
    return undefined;
  }
}

/**
 * Move an item between containers
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/Container#moveItem
 */
export function moveBetweenContainers(
  log: (message: string, status?: number) => void,
  targetLocation: DimensionLocation
) {
  const players = world.getAllPlayers();

  const chestCart = targetLocation.dimension.spawnEntity(MinecraftEntityTypes.ChestMinecart, {
    x: targetLocation.x + 1,
    y: targetLocation.y,
    z: targetLocation.z,
  });

  if (players.length > 0) {
    const fromPlayer = players[0];

    const fromInventory = fromPlayer.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent;
    const toInventory = chestCart.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent;

    if (fromInventory && toInventory && fromInventory.container && toInventory.container) {
      fromInventory.container.moveItem(0, 0, toInventory.container);
    }
  }
}

/**
 * Swap an item between containers
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/Container#swapItem
 */
export function swapBetweenContainers(
  log: (message: string, status?: number) => void,
  targetLocation: DimensionLocation
) {
  const players = world.getAllPlayers();

  const chestCart = targetLocation.dimension.spawnEntity(MinecraftEntityTypes.ChestMinecart, {
    x: targetLocation.x + 1,
    y: targetLocation.y,
    z: targetLocation.z,
  });

  if (players.length > 0) {
    const fromPlayer = players[0];

    const fromInventory = fromPlayer.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent;
    const toInventory = chestCart.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent;

    if (fromInventory && toInventory && fromInventory.container && toInventory.container) {
      fromInventory.container.swapItems(0, 0, toInventory.container);
    }
  }
}

/**
 * Transfer an item between containers
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/Container#transferItem
 */
export function transferBetweenContainers(
  log: (message: string, status?: number) => void,
  targetLocation: DimensionLocation
) {
  const players = world.getAllPlayers();

  const chestCart = targetLocation.dimension.spawnEntity(MinecraftEntityTypes.ChestMinecart, {
    x: targetLocation.x + 1,
    y: targetLocation.y,
    z: targetLocation.z,
  });

  if (players.length > 0) {
    const fromPlayer = players[0];

    const fromInventory = fromPlayer.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent;
    const toInventory = chestCart.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent;

    if (fromInventory && toInventory && fromInventory.container && toInventory.container) {
      fromInventory.container.transferItem(0, toInventory.container);
    }
  }
}
