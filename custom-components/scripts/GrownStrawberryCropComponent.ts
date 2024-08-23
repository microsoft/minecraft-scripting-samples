import { BlockComponentPlayerInteractEvent, BlockComponentTickEvent, BlockCustomComponent } from "@minecraft/server";
import { CropGrowthComponent } from "./CropGrowthComponent";

export class GrownStrawberryCropComponent implements BlockCustomComponent {
  onTick(arg: BlockComponentTickEvent) {
    CropGrowthComponent.tryGrowBlock(arg.block);
  }

  onPlayerInteract(arg: BlockComponentPlayerInteractEvent) {
    if (arg.player === undefined) {
      return;
    }

    // let player fertilize to rotten
    if (CropGrowthComponent.tryFertilize(arg.block, arg.player)) {
      return;
    }

    // otherwise harvest the block and replant it
    const pos = arg.block.location;
    arg.dimension.runCommand("loot spawn " + pos.x + " " + pos.y + " " + pos.z + " loot strawberry_grown_crop");
    arg.block.setPermutation(arg.block.permutation.withState("starter:crop_age", 0));
  }
}
