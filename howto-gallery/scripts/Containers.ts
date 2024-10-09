import {
  BlockInventoryComponent,
  DimensionLocation,
  EntityInventoryComponent,
  ItemStack,
  world,
} from "@minecraft/server";
import { MinecraftBlockTypes, MinecraftEntityTypes, MinecraftItemTypes } from "@minecraft/vanilla-data";

/**
 * Creates some chests and containers and uses container transfer and swapping APIs
 * This sample uses only stable APIs.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/Container
 */
export function containers(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const xLocation = targetLocation; // left chest location
  const xPlusTwoLocation = { x: targetLocation.x + 2, y: targetLocation.y, z: targetLocation.z }; // right chest

  const chestCart = targetLocation.dimension.spawnEntity(MinecraftEntityTypes.ChestMinecart, {
    x: targetLocation.x + 4,
    y: targetLocation.y,
    z: targetLocation.z,
  });

  const xChestBlock = targetLocation.dimension.getBlock(xLocation);
  const xPlusTwoChestBlock = targetLocation.dimension.getBlock(xPlusTwoLocation);

  if (!xChestBlock || !xPlusTwoChestBlock) {
    log("Could not retrieve chest blocks.");
    return;
  }

  xChestBlock.setType(MinecraftBlockTypes.Chest);
  xPlusTwoChestBlock.setType(MinecraftBlockTypes.Chest);

  const xPlusTwoChestInventoryComp = xPlusTwoChestBlock.getComponent("inventory") as BlockInventoryComponent;
  const xChestInventoryComponent = xChestBlock.getComponent("inventory") as BlockInventoryComponent;
  const chestCartInventoryComp = chestCart.getComponent("inventory") as EntityInventoryComponent;

  const xPlusTwoChestContainer = xPlusTwoChestInventoryComp.container;
  const xChestContainer = xChestInventoryComponent.container;
  const chestCartContainer = chestCartInventoryComp.container;

  if (!xPlusTwoChestContainer || !xChestContainer || !chestCartContainer) {
    log("Could not retrieve chest containers.");
    return;
  }

  xPlusTwoChestContainer.setItem(0, new ItemStack(MinecraftItemTypes.Apple, 10));
  if (xPlusTwoChestContainer.getItem(0)?.typeId !== MinecraftItemTypes.Apple) {
    log("Expected apple in x+2 container slot index 0", -1);
  }

  xPlusTwoChestContainer.setItem(1, new ItemStack(MinecraftItemTypes.Emerald, 10));
  if (xPlusTwoChestContainer.getItem(1)?.typeId !== MinecraftItemTypes.Emerald) {
    log("Expected emerald in x+2 container slot index 1", -1);
  }

  if (xPlusTwoChestContainer.size !== 27) {
    log("Unexpected size: " + xPlusTwoChestContainer.size, -1);
  }

  if (xPlusTwoChestContainer.emptySlotsCount !== 25) {
    log("Unexpected emptySlotsCount: " + xPlusTwoChestContainer.emptySlotsCount, -1);
  }

  xChestContainer.setItem(0, new ItemStack(MinecraftItemTypes.Cake, 10));

  xPlusTwoChestContainer.transferItem(0, chestCartContainer); // transfer the apple from the xPlusTwo chest to a chest cart
  xPlusTwoChestContainer.swapItems(1, 0, xChestContainer); // swap the cake from x and the emerald from xPlusTwo

  if (chestCartContainer.getItem(0)?.typeId !== MinecraftItemTypes.Apple) {
    log("Expected apple in minecraft chest container slot index 0", -1);
  }

  if (xChestContainer.getItem(0)?.typeId === MinecraftItemTypes.Emerald) {
    log("Expected emerald in x container slot index 0", -1);
  }

  if (xPlusTwoChestContainer.getItem(1)?.typeId === MinecraftItemTypes.Cake) {
    log("Expected cake in x+2 container slot index 1", -1);
  }
}

/**
 * Creates a chest and places some items within it.
 * This sample uses only stable APIs.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/BlockInventoryComponent
 */
export function placeItemsInChest(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  // Fetch block
  const block = targetLocation.dimension.getBlock(targetLocation);

  if (!block) {
    log("Could not find block. Maybe it is not loaded?", -1);
    return;
  }

  // Make it a chest
  block.setType(MinecraftBlockTypes.Chest);

  // Get the inventory
  const inventoryComponent = block.getComponent("inventory") as BlockInventoryComponent;

  if (!inventoryComponent || !inventoryComponent.container) {
    log("Could not find inventory component.", -1);
    return;
  }

  const inventoryContainer = inventoryComponent.container;

  // Set slot 0 to a stack of 10 apples
  inventoryContainer.setItem(0, new ItemStack(MinecraftItemTypes.Apple, 10));
}
