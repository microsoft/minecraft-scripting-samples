import { world, BlockType, BlockPermutation } from "@minecraft/server";

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
    let perm = BlockPermutation.resolve(blockType.id);

    for (let i = xFrom; i <= xTo; i++) {
      for (let j = yFrom; j <= yTo; j++) {
        for (let k = zFrom; k <= zTo; k++) {
          overworld.getBlock({ x: i, y: j, z: k })?.setPermutation(perm);
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
    let perm = BlockPermutation.resolve(blockType.id);

    for (let i = xFrom; i <= xTo; i++) {
      for (let k = yFrom; k <= yTo; k++) {
        overworld.getBlock({ x: i, y: k, z: zFrom })?.setPermutation(perm);
        overworld.getBlock({ x: i, y: k, z: zTo })?.setPermutation(perm);
      }
    }

    for (let j = zFrom + 1; j < zTo; j++) {
      for (let k = yFrom; k <= yTo; k++) {
        overworld.getBlock({ x: xFrom, y: k, z:j })?.setPermutation(perm);
        overworld.getBlock({ x: xTo, y: k, z: j })?.setPermutation(perm);
      }
    }
  }
}
