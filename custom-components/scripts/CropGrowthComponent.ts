import {
  Block,
  BlockComponentPlayerInteractEvent,
  BlockComponentRandomTickEvent,
  BlockCustomComponent,
  EntityInventoryComponent,
  Player,
} from "@minecraft/server";

export class CropGrowthComponent implements BlockCustomComponent {
  static tryGrowBlock(block: Block) {
    const perm = block.permutation;
    const age = perm.getState("starter:crop_age");
    if (age === undefined || typeof age !== "number") {
      return;
    }

    if (age === 5) {
      return; // already at max age
    }

    block.setPermutation(perm.withState("starter:crop_age", age + 1));
  }

  static tryFertilize(block: Block, player: Player): boolean {
    const inventory = player.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent;
    if (inventory === undefined) {
      return false;
    }

    const selectedItem = inventory.container?.getItem(player.selectedSlotIndex);
    if (selectedItem && selectedItem.typeId === "minecraft:bone_meal") {
      CropGrowthComponent.tryGrowBlock(block);
      selectedItem.amount--;
      inventory.container?.setItem(player.selectedSlotIndex, selectedItem);
      return true;
    }
    return false;
  }

  onRandomTick(arg: BlockComponentRandomTickEvent) {
    CropGrowthComponent.tryGrowBlock(arg.block);
  }

  // fertilization growth with bone meal
  onPlayerInteract(arg: BlockComponentPlayerInteractEvent) {
    if (arg.player === undefined) {
      return;
    }

    CropGrowthComponent.tryFertilize(arg.block, arg.player);
  }
}
