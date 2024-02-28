import { world, BlockPermutation } from "@minecraft/server";
import { MinecraftDimensionTypes } from "@minecraft/vanilla-data";

export const CHARFONT: { [index: string]: string[][] } = {
  a: [
    [" ", "x", "x", " "],
    ["x", " ", " ", "x"],
    ["x", "x", "x", "x"],
    ["x", " ", " ", "x"],
    ["x", " ", " ", "x"],
  ],
  b: [
    ["x", "x", "x", " "],
    ["x", " ", " ", "x"],
    ["x", "x", "x", " "],
    ["x", " ", " ", "x"],
    ["x", "x", "x", " "],
  ],
  c: [
    [" ", "x", "x"],
    ["x", " ", " "],
    ["x", " ", " "],
    ["x", " ", " "],
    [" ", "x", "x"],
  ],
  d: [
    ["x", "x", "x", " "],
    ["x", " ", " ", "x"],
    ["x", " ", " ", "x"],
    ["x", " ", " ", "x"],
    ["x", "x", "x", " "],
  ],
  e: [
    ["x", "x", "x"],
    ["x", " ", " "],
    ["x", "x", " "],
    ["x", " ", " "],
    ["x", "x", "x"],
  ],
  f: [
    ["x", "x", "x"],
    ["x", " ", " "],
    ["x", "x", " "],
    ["x", " ", " "],
    ["x", " ", " "],
  ],
  g: [
    [" ", "x", "x", " "],
    ["x", " ", " ", " "],
    ["x", "x", "x", " "],
    ["x", " ", " ", "x"],
    ["x", "x", "x", " "],
  ],
  h: [
    ["x", " ", " ", "x"],
    ["x", " ", " ", "x"],
    ["x", "x", "x", "x"],
    ["x", " ", " ", "x"],
    ["x", " ", " ", "x"],
  ],
  i: [
    ["x", "x", "x"],
    [" ", "x", " "],
    [" ", "x", " "],
    [" ", "x", " "],
    ["x", "x", "x"],
  ],
  j: [
    [" ", " ", "x"],
    [" ", " ", "x"],
    [" ", " ", "x"],
    [" ", " ", "x"],
    ["x", "x", " "],
  ],
  k: [
    ["x", " ", " "],
    ["x", " ", "x"],
    ["x", "x", " "],
    ["x", "x", " "],
    ["x", " ", "x"],
  ],
  l: [
    ["x", " ", " "],
    ["x", " ", " "],
    ["x", " ", " "],
    ["x", " ", " "],
    ["x", "x", "x"],
  ],
  m: [
    ["x", " ", " ", " ", "x"],
    ["x", "x", " ", "x", "x"],
    ["x", " ", "x", " ", "x"],
    ["x", " ", " ", " ", "x"],
    ["x", " ", " ", " ", "x"],
  ],
  n: [
    ["x", " ", " ", " ", "x"],
    ["x", "x", " ", " ", "x"],
    ["x", " ", "x", " ", "x"],
    ["x", " ", " ", "x", "x"],
    ["x", " ", " ", " ", "x"],
  ],
  o: [
    [" ", "x", "x", " "],
    ["x", " ", " ", "x"],
    ["x", " ", " ", "x"],
    ["x", " ", " ", "x"],
    [" ", "x", "x", " "],
  ],
  p: [
    ["x", "x", "x", " "],
    ["x", " ", " ", "x"],
    ["x", "x", "x", " "],
    ["x", " ", " ", " "],
    ["x", " ", " ", " "],
  ],
  q: [
    [" ", "x", "x", " ", " "],
    ["x", " ", " ", "x", " "],
    ["x", " ", " ", "x", " "],
    ["x", " ", "x", "x", " "],
    [" ", "x", "x", "x", "x"],
  ],
  r: [
    ["x", "x", "x", "x"],
    ["x", " ", " ", "x"],
    ["x", "x", "x", " "],
    ["x", " ", " ", "x"],
    ["x", " ", " ", "x"],
  ],
  s: [
    [" ", "x", "x"],
    ["x", " ", " "],
    [" ", "x", " "],
    [" ", " ", "x"],
    ["x", "x", " "],
  ],
  t: [
    ["x", "x", "x"],
    [" ", "x", " "],
    [" ", "x", " "],
    [" ", "x", " "],
    [" ", "x", " "],
  ],
  u: [
    ["x", " ", " ", "x"],
    ["x", " ", " ", "x"],
    ["x", " ", " ", "x"],
    ["x", " ", " ", "x"],
    ["x", "x", "x", "x"],
  ],
  v: [
    ["x", " ", "x"],
    ["x", " ", "x"],
    ["x", " ", "x"],
    ["x", " ", "x"],
    [" ", "x", " "],
  ],
  w: [
    ["x", " ", " ", " ", "x"],
    ["x", " ", " ", " ", "x"],
    ["x", " ", " ", " ", "x"],
    ["x", " ", "x", " ", "x"],
    ["x", "x", " ", "x", "x"],
  ],
  x: [
    ["x", " ", " ", " ", "x"],
    [" ", "x", " ", "x", " "],
    [" ", " ", "x", " ", " "],
    [" ", "x", " ", "x", " "],
    ["x", " ", " ", " ", "x"],
  ],
  y: [
    ["x", " ", " ", " ", "x"],
    [" ", "x", " ", "x", " "],
    [" ", " ", "x", " ", " "],
    [" ", " ", "x", " ", " "],
    [" ", " ", "x", " ", " "],
  ],
  z: [
    ["x", "x", "x"],
    [" ", " ", "x"],
    [" ", "x", " "],
    ["x", " ", " "],
    ["x", "x", "x"],
  ],
  1: [
    [" ", "x", " "],
    ["x", "x", " "],
    [" ", "x", " "],
    [" ", "x", " "],
    ["x", "x", "x"],
  ],
  2: [
    [" ", "x", " "],
    ["x", " ", "x"],
    [" ", "x", " "],
    ["x", " ", " "],
    ["x", "x", "x"],
  ],
  3: [
    ["x", "x", " "],
    [" ", " ", "x"],
    [" ", "x", " "],
    [" ", " ", "x"],
    ["x", "x", " "],
  ],
  4: [
    ["x", " ", "x"],
    ["x", " ", "x"],
    ["x", "x", "x"],
    [" ", " ", "x"],
    [" ", " ", "x"],
  ],
  5: [
    ["x", "x", "x"],
    ["x", " ", " "],
    [" ", "x", " "],
    [" ", " ", "x"],
    ["x", "x", " "],
  ],
  6: [
    ["x", "x", "x"],
    ["x", " ", " "],
    ["x", "x", "x"],
    ["x", " ", "x"],
    ["x", "x", "x"],
  ],
  7: [
    ["x", "x", "x"],
    [" ", " ", "x"],
    [" ", " ", "x"],
    [" ", "x", " "],
    ["x", " ", " "],
  ],
  8: [
    ["x", "x", "x"],
    ["x", " ", "x"],
    ["x", "x", "x"],
    ["x", " ", "x"],
    ["x", "x", "x"],
  ],
  9: [
    ["x", "x", "x"],
    ["x", " ", "x"],
    ["x", "x", "x"],
    [" ", " ", "x"],
    ["x", "x", "x"],
  ],
  0: [
    ["x", "x", "x"],
    ["x", " ", "x"],
    ["x", " ", "x"],
    ["x", " ", "x"],
    ["x", "x", "x"],
  ],
  " ": [
    [" ", " "],
    [" ", " "],
    [" ", " "],
    [" ", " "],
    [" ", " "],
  ],
};

export default class Utilities {
  static writeTextFlatX(
    text: string,
    nwb: { x: number; y: number; z: number },
    letterPixelBlockPerm: BlockPermutation,
    emptyPixelBlockPerm: BlockPermutation
  ) {
    let textClean = text.toLowerCase();

    let ow = world.getDimension(MinecraftDimensionTypes.Overworld);

    let xStart = nwb.x;

    for (let k = 0; k < textClean.length; k++) {
      let fontChar = CHARFONT[textClean[k]];

      if (fontChar) {
        for (let i = 0; i < fontChar.length; i++) {
          let line = fontChar[i];

          for (let j = 0; j < line.length; j++) {
            let bl = { x: xStart + j, y: nwb.y, z: nwb.z + i };
            let block = ow.getBlock(bl);

            if (block) {
              if (line[j] === "x") {
                block.setPermutation(letterPixelBlockPerm);
              } else {
                block.setPermutation(emptyPixelBlockPerm);
              }
            }
          }
        }

        xStart += fontChar[0].length;
        for (let i = 0; i < fontChar.length; i++) {
          let bl = { x: xStart, y: nwb.y, z: nwb.z + i };
          let block = ow.getBlock(bl);

          if (block) {
            block.setPermutation(emptyPixelBlockPerm);
          }
        }
        xStart++;
      }
    }
  }

  static fillBlock(
    perm: BlockPermutation,
    fromX: number,
    fromY: number,
    fromZ: number,
    toX: number,
    toY: number,
    toZ: number
  ) {
    let overworld = world.getDimension(MinecraftDimensionTypes.Overworld);

    const fromXa = Math.min(fromX, toX);
    const fromYa = Math.min(fromY, toY);
    const fromZa = Math.min(fromZ, toZ);
    const toXa = Math.max(fromX, toX);
    const toYa = Math.max(fromY, toY);
    const toZa = Math.max(fromZ, toZ);

    for (let i = fromXa; i <= toXa; i++) {
      for (let j = fromYa; j <= toYa; j++) {
        for (let k = fromZa; k <= toZa; k++) {
          let bl = { x: i, y: j, z: k };
          let block = overworld.getBlock(bl);

          if (block) {
            block.setPermutation(perm);
          }
        }
      }
    }
  }
}
