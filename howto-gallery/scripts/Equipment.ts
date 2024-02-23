import * as mc from "@minecraft/server";

/**
 * Give a player elytra.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/EntityEquipmentInventoryComponent
 */
export function givePlayerElytra(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  let players = mc.world.getAllPlayers();

  const equipment = players[0].getComponent("equippable");
  equipment?.setEquipment(mc.EquipmentSlot.Chest, new mc.ItemStack("minecraft:elytra"));

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
  let armorStand = players[0].dimension.spawnEntity("armor_stand", armorStandLoc);

  const equipmentCompPlayer = players[0].getComponent("equippable");
  if (equipmentCompPlayer) {
    equipmentCompPlayer.setEquipment(mc.EquipmentSlot.Head, new mc.ItemStack("minecraft:golden_helmet"));
    equipmentCompPlayer.setEquipment(mc.EquipmentSlot.Chest, new mc.ItemStack("minecraft:iron_chestplate"));
    equipmentCompPlayer.setEquipment(mc.EquipmentSlot.Legs, new mc.ItemStack("minecraft:diamond_leggings"));
    equipmentCompPlayer.setEquipment(mc.EquipmentSlot.Feet, new mc.ItemStack("minecraft:netherite_boots"));
    equipmentCompPlayer.setEquipment(mc.EquipmentSlot.Mainhand, new mc.ItemStack("minecraft:wooden_sword"));
    equipmentCompPlayer.setEquipment(mc.EquipmentSlot.Offhand, new mc.ItemStack("minecraft:shield"));
  }

  const equipmentCompArmorStand = armorStand.getComponent("equippable");
  if (equipmentCompArmorStand) {
    equipmentCompArmorStand.setEquipment(mc.EquipmentSlot.Head, new mc.ItemStack("minecraft:golden_helmet"));
    equipmentCompArmorStand.setEquipment(mc.EquipmentSlot.Chest, new mc.ItemStack("minecraft:iron_chestplate"));
    equipmentCompArmorStand.setEquipment(mc.EquipmentSlot.Legs, new mc.ItemStack("minecraft:diamond_leggings"));
    equipmentCompArmorStand.setEquipment(mc.EquipmentSlot.Feet, new mc.ItemStack("minecraft:netherite_boots"));
    equipmentCompArmorStand.setEquipment(mc.EquipmentSlot.Mainhand, new mc.ItemStack("minecraft:wooden_sword"));
    equipmentCompArmorStand.setEquipment(mc.EquipmentSlot.Offhand, new mc.ItemStack("minecraft:shield"));
  }
}
