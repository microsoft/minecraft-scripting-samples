import * as mc from "@minecraft/server";
import * as vanilla from "@minecraft/vanilla-data";

/**
 * Give a player elytra.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/EntityEquipmentInventoryComponent
 */
export function givePlayerElytra(
  log: (message: string, status?: number) => void,
  targetLocation: mc.DimensionLocation
) {
  let players = mc.world.getAllPlayers();

  const equipment = players[0].getComponent(mc.EntityComponentTypes.Equippable) as mc.EntityEquippableComponent;
  equipment?.setEquipment(mc.EquipmentSlot.Chest, new mc.ItemStack(vanilla.MinecraftItemTypes.Elytra));

  log("Player given Elytra");
}

/**
 * Give a player, and an armorstand, a full set of equipment.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/ItemStack
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/EntityEquipmentInventoryComponent
 */
export function givePlayerEquipment(
  log: (message: string, status?: number) => void,
  targetLocation: mc.DimensionLocation
) {
  let players = mc.world.getAllPlayers();

  const armorStandLoc = { x: targetLocation.x, y: targetLocation.y, z: targetLocation.z + 4 };
  let armorStand = players[0].dimension.spawnEntity(vanilla.MinecraftItemTypes.ArmorStand, armorStandLoc);

  const equipmentCompPlayer = players[0].getComponent(
    mc.EntityComponentTypes.Equippable
  ) as mc.EntityEquippableComponent;
  if (equipmentCompPlayer) {
    equipmentCompPlayer.setEquipment(mc.EquipmentSlot.Head, new mc.ItemStack(vanilla.MinecraftItemTypes.GoldenHelmet));
    equipmentCompPlayer.setEquipment(
      mc.EquipmentSlot.Chest,
      new mc.ItemStack(vanilla.MinecraftItemTypes.IronChestplate)
    );
    equipmentCompPlayer.setEquipment(
      mc.EquipmentSlot.Legs,
      new mc.ItemStack(vanilla.MinecraftItemTypes.DiamondLeggings)
    );
    equipmentCompPlayer.setEquipment(
      mc.EquipmentSlot.Feet,
      new mc.ItemStack(vanilla.MinecraftItemTypes.NetheriteBoots)
    );
    equipmentCompPlayer.setEquipment(
      mc.EquipmentSlot.Mainhand,
      new mc.ItemStack(vanilla.MinecraftItemTypes.WoodenSword)
    );
    equipmentCompPlayer.setEquipment(mc.EquipmentSlot.Offhand, new mc.ItemStack(vanilla.MinecraftItemTypes.Shield));
  }

  const equipmentCompArmorStand = armorStand.getComponent(
    mc.EntityComponentTypes.Equippable
  ) as mc.EntityEquippableComponent;
  if (equipmentCompArmorStand) {
    equipmentCompArmorStand.setEquipment(
      mc.EquipmentSlot.Head,
      new mc.ItemStack(vanilla.MinecraftItemTypes.GoldenHelmet)
    );
    equipmentCompArmorStand.setEquipment(
      mc.EquipmentSlot.Chest,
      new mc.ItemStack(vanilla.MinecraftItemTypes.IronChestplate)
    );
    equipmentCompArmorStand.setEquipment(
      mc.EquipmentSlot.Legs,
      new mc.ItemStack(vanilla.MinecraftItemTypes.DiamondLeggings)
    );
    equipmentCompArmorStand.setEquipment(
      mc.EquipmentSlot.Feet,
      new mc.ItemStack(vanilla.MinecraftItemTypes.NetheriteBoots)
    );
    equipmentCompArmorStand.setEquipment(
      mc.EquipmentSlot.Mainhand,
      new mc.ItemStack(vanilla.MinecraftItemTypes.WoodenSword)
    );
    equipmentCompArmorStand.setEquipment(mc.EquipmentSlot.Offhand, new mc.ItemStack(vanilla.MinecraftItemTypes.Shield));
  }
}
