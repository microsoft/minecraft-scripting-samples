import {
  DimensionLocation,
  EntityComponentTypes,
  EntityEquippableComponent,
  EntityInventoryComponent,
  EquipmentSlot,
  ItemComponentTypes,
  ItemDurabilityComponent,
  ItemStack,
  world,
} from "@minecraft/server";
import { MinecraftItemTypes } from "@minecraft/vanilla-data";

/**
 * Gives a player an elytra.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/EntityEquipmentInventoryComponent
 */
export function givePlayerElytra(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const players = world.getAllPlayers();

  const equipment = players[0].getComponent(EntityComponentTypes.Equippable) as EntityEquippableComponent;
  equipment?.setEquipment(EquipmentSlot.Chest, new ItemStack(MinecraftItemTypes.Elytra));

  log("Player given Elytra");
}

/**
 * Give a player, and an armorstand, a full set of equipment.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/ItemStack
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/EntityEquipmentInventoryComponent
 */
export function givePlayerEquipment(
  log: (message: string, status?: number) => void,
  targetLocation: DimensionLocation
) {
  const players = world.getAllPlayers();

  const armorStandLoc = { x: targetLocation.x, y: targetLocation.y, z: targetLocation.z + 4 };
  const armorStand = players[0].dimension.spawnEntity(MinecraftItemTypes.ArmorStand, armorStandLoc);

  const equipmentCompPlayer = players[0].getComponent(EntityComponentTypes.Equippable) as EntityEquippableComponent;
  if (equipmentCompPlayer) {
    equipmentCompPlayer.setEquipment(EquipmentSlot.Head, new ItemStack(MinecraftItemTypes.GoldenHelmet));
    equipmentCompPlayer.setEquipment(EquipmentSlot.Chest, new ItemStack(MinecraftItemTypes.IronChestplate));
    equipmentCompPlayer.setEquipment(EquipmentSlot.Legs, new ItemStack(MinecraftItemTypes.DiamondLeggings));
    equipmentCompPlayer.setEquipment(EquipmentSlot.Feet, new ItemStack(MinecraftItemTypes.NetheriteBoots));
    equipmentCompPlayer.setEquipment(EquipmentSlot.Mainhand, new ItemStack(MinecraftItemTypes.WoodenSword));
    equipmentCompPlayer.setEquipment(EquipmentSlot.Offhand, new ItemStack(MinecraftItemTypes.Shield));
  }

  const equipmentCompArmorStand = armorStand.getComponent(EntityComponentTypes.Equippable) as EntityEquippableComponent;
  if (equipmentCompArmorStand) {
    equipmentCompArmorStand.setEquipment(EquipmentSlot.Head, new ItemStack(MinecraftItemTypes.GoldenHelmet));
    equipmentCompArmorStand.setEquipment(EquipmentSlot.Chest, new ItemStack(MinecraftItemTypes.IronChestplate));
    equipmentCompArmorStand.setEquipment(EquipmentSlot.Legs, new ItemStack(MinecraftItemTypes.DiamondLeggings));
    equipmentCompArmorStand.setEquipment(EquipmentSlot.Feet, new ItemStack(MinecraftItemTypes.NetheriteBoots));
    equipmentCompArmorStand.setEquipment(EquipmentSlot.Mainhand, new ItemStack(MinecraftItemTypes.WoodenSword));
    equipmentCompArmorStand.setEquipment(EquipmentSlot.Offhand, new ItemStack(MinecraftItemTypes.Shield));
  }
}
