// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as mc from "@minecraft/server";
import { MinecraftItemTypes } from "@minecraft/vanilla-data";

/**
 * Give a player elytra.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/EntityEquipmentInventoryComponent
 */
export function givePlayerElytra(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  let players = mc.world.getAllPlayers();

  const equipment = players[0].getComponent(mc.EntityComponentTypes.Equippable);
  equipment?.setEquipment(mc.EquipmentSlot.Chest, new mc.ItemStack(MinecraftItemTypes.Elytra));

  log("Player given Elytra");
}

/**
 * Give a player, and an armorstand, a full set of equipment.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/ItemStack
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/EntityEquipmentInventoryComponent
 */
export function givePlayerEquipment(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  let players = mc.world.getAllPlayers();

  const armorStandLoc = { x: targetLocation.x, y: targetLocation.y, z: targetLocation.z + 4 };
  let armorStand = players[0].dimension.spawnEntity(MinecraftItemTypes.ArmorStand, armorStandLoc);

  const equipmentCompPlayer = players[0].getComponent(mc.EntityComponentTypes.Equippable);
  if (equipmentCompPlayer) {
    equipmentCompPlayer.setEquipment(mc.EquipmentSlot.Head, new mc.ItemStack(MinecraftItemTypes.GoldenHelmet));
    equipmentCompPlayer.setEquipment(mc.EquipmentSlot.Chest, new mc.ItemStack(MinecraftItemTypes.IronChestplate));
    equipmentCompPlayer.setEquipment(mc.EquipmentSlot.Legs, new mc.ItemStack(MinecraftItemTypes.DiamondLeggings));
    equipmentCompPlayer.setEquipment(mc.EquipmentSlot.Feet, new mc.ItemStack(MinecraftItemTypes.NetheriteBoots));
    equipmentCompPlayer.setEquipment(mc.EquipmentSlot.Mainhand, new mc.ItemStack(MinecraftItemTypes.WoodenSword));
    equipmentCompPlayer.setEquipment(mc.EquipmentSlot.Offhand, new mc.ItemStack(MinecraftItemTypes.Shield));
  }

  const equipmentCompArmorStand = armorStand.getComponent(mc.EntityComponentTypes.Equippable);
  if (equipmentCompArmorStand) {
    equipmentCompArmorStand.setEquipment(mc.EquipmentSlot.Head, new mc.ItemStack(MinecraftItemTypes.GoldenHelmet));
    equipmentCompArmorStand.setEquipment(mc.EquipmentSlot.Chest, new mc.ItemStack(MinecraftItemTypes.IronChestplate));
    equipmentCompArmorStand.setEquipment(mc.EquipmentSlot.Legs, new mc.ItemStack(MinecraftItemTypes.DiamondLeggings));
    equipmentCompArmorStand.setEquipment(mc.EquipmentSlot.Feet, new mc.ItemStack(MinecraftItemTypes.NetheriteBoots));
    equipmentCompArmorStand.setEquipment(mc.EquipmentSlot.Mainhand, new mc.ItemStack(MinecraftItemTypes.WoodenSword));
    equipmentCompArmorStand.setEquipment(mc.EquipmentSlot.Offhand, new mc.ItemStack(MinecraftItemTypes.Shield));
  }
}
