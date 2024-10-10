import {
  BlockComponentTypes,
  BlockPermutation,
  BlockSignComponent,
  DimensionLocation,
  DyeColor,
  RawMessage,
  RawText,
  SignSide,
  world,
} from "@minecraft/server";
import { MinecraftBlockTypes } from "@minecraft/vanilla-data";

/**
 * Creates a single-sided simple sign
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/BlockSignComponent
 */
export function addSign(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const players = world.getPlayers();

  const dim = players[0].dimension;

  const signBlock = dim.getBlock(targetLocation);

  if (!signBlock) {
    log("Could not find a block at specified location.");
    return -1;
  }
  const signPerm = BlockPermutation.resolve(MinecraftBlockTypes.StandingSign, { ground_sign_direction: 8 });

  signBlock.setPermutation(signPerm);

  const signComponent = signBlock.getComponent(BlockComponentTypes.Sign) as BlockSignComponent;

  signComponent?.setText(`Basic sign!\nThis is green on the front.`);
}

/**
 * Creates a single-sided simple sign
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/BlockPermutation
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/BlockSignComponent
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/RawMessage
 */
export function addTranslatedSign(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const players = world.getPlayers();

  const dim = players[0].dimension;

  const signBlock = dim.getBlock(targetLocation);

  if (!signBlock) {
    log("Could not find a block at specified location.");
    return -1;
  }
  const signPerm = BlockPermutation.resolve(MinecraftBlockTypes.StandingSign, { ground_sign_direction: 8 });

  signBlock.setPermutation(signPerm);

  const signComponent = signBlock.getComponent(BlockComponentTypes.Sign) as BlockSignComponent;

  signComponent?.setText({ translate: "item.skull.player.name", with: [players[0].name] });
}

/**
 * Creates a two-sided sign with custom colors and a read-only status
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/BlockSignComponent
 */
export function addTwoSidedSign(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const signBlock = targetLocation.dimension.getBlock(targetLocation);

  if (!signBlock) {
    log("Could not find a block at specified location.");
    return -1;
  }
  const signPerm = BlockPermutation.resolve(MinecraftBlockTypes.StandingSign, { ground_sign_direction: 8 });

  signBlock.setPermutation(signPerm);

  const signComponent = signBlock.getComponent(BlockComponentTypes.Sign) as BlockSignComponent;

  if (signComponent) {
    signComponent.setText(`Party Sign!\nThis is green on the front.`);
    signComponent.setText(`Party Sign!\nThis is red on the back.`, SignSide.Back);
    signComponent.setTextDyeColor(DyeColor.Green);
    signComponent.setTextDyeColor(DyeColor.Red, SignSide.Back);

    // players cannot edit sign!
    signComponent.setWaxed(true);
  } else {
    log("Could not find sign component.");
  }
}
/**
 * Update sign text
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/BlockSignComponent
 */
export function updateSignText(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const block = targetLocation.dimension.getBlock(targetLocation);
  if (!block) {
    console.warn("Could not find a block at specified location.");
    return;
  }

  const sign = block.getComponent(BlockComponentTypes.Sign) as BlockSignComponent;
  if (sign) {
    // RawMessage
    const helloWorldMessage: RawMessage = { text: "Hello World" };
    sign.setText(helloWorldMessage);

    // RawText
    const helloWorldText: RawText = { rawtext: [{ text: "Hello World" }] };
    sign.setText(helloWorldText);

    // Regular string
    sign.setText("Hello World");
  } else {
    console.warn("Could not find a sign component on the block.");
  }
}
