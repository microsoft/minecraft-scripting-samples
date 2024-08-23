import * as math from "@minecraft/math";
import * as mc from "@minecraft/server";
import * as vanilla from "@minecraft/vanilla-data";

/**
 * Creates a multicolored block out of different colors of wool.
 * This sample uses only stable APIs.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/BlockPermutation#resolve
 */
export function addBlockColorCube(
  log: (message: string, status?: number) => void,
  targetLocation: mc.DimensionLocation
) {
  const allWoolBlocks: string[] = [
    vanilla.MinecraftBlockTypes.WhiteWool,
    vanilla.MinecraftBlockTypes.OrangeWool,
    vanilla.MinecraftBlockTypes.MagentaWool,
    vanilla.MinecraftBlockTypes.LightBlueWool,
    vanilla.MinecraftBlockTypes.YellowWool,
    vanilla.MinecraftBlockTypes.LimeWool,
    vanilla.MinecraftBlockTypes.PinkWool,
    vanilla.MinecraftBlockTypes.GrayWool,
    vanilla.MinecraftBlockTypes.LightGrayWool,
    vanilla.MinecraftBlockTypes.CyanWool,
    vanilla.MinecraftBlockTypes.PurpleWool,
    vanilla.MinecraftBlockTypes.BlueWool,
    vanilla.MinecraftBlockTypes.BrownWool,
    vanilla.MinecraftBlockTypes.GreenWool,
    vanilla.MinecraftBlockTypes.RedWool,
    vanilla.MinecraftBlockTypes.BlackWool,
  ];

  const cubeDim = 7;

  let colorIndex = 0;

  for (let x = 0; x <= cubeDim; x++) {
    for (let y = 0; y <= cubeDim; y++) {
      for (let z = 0; z <= cubeDim; z++) {
        colorIndex++;
        targetLocation.dimension
          .getBlock(math.Vector3Utils.add(targetLocation, { x, y, z }))
          ?.setPermutation(mc.BlockPermutation.resolve(allWoolBlocks[colorIndex % allWoolBlocks.length]));
      }
    }
  }
}
