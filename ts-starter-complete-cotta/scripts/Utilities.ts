import { world, BlockLocation, BlockType } from "@minecraft/server";

export default class Utilities {
  static fillBlock(
    blockType: BlockType,
    xFrom: number,
    yFrom: number,
    zFrom: number,
    xTo: number,
    yTo: number,
    zTo: number
  ) {
    let overworld = world.getDimension("overworld");

    for (let i = xFrom; i <= xTo; i++) {
      for (let j = yFrom; j <= yTo; j++) {
        for (let k = zFrom; k <= zTo; k++) {
          overworld.getBlock(new BlockLocation(i, j, k)).setType(blockType);
        }
      }
    }
  }

  static fourWalls(
    blockType: BlockType,
    xFrom: number,
    yFrom: number,
    zFrom: number,
    xTo: number,
    yTo: number,
    zTo: number
  ) {
    let overworld = world.getDimension("overworld");
    for (let i = xFrom; i <= xTo; i++) {
      for (let k = yFrom; k <= yTo; k++) {
        overworld.getBlock(new BlockLocation(i, k, zFrom)).setType(blockType);
        overworld.getBlock(new BlockLocation(i, k, zTo)).setType(blockType);
      }
    }

    for (let j = zFrom + 1; j < zTo; j++) {
      for (let k = yFrom; k <= yTo; k++) {
        overworld.getBlock(new BlockLocation(xFrom, k, j)).setType(blockType);
        overworld.getBlock(new BlockLocation(xTo, k, j)).setType(blockType);
      }
    }
  }
}
