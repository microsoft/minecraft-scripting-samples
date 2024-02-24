// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as mc from "@minecraft/server";
import { MinecraftBlockTypes } from "@minecraft/vanilla-data";

/**
 * Creates a single-sided simple sign
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/BlockSignComponent
 */
export function addSign(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  const players = mc.world.getPlayers();

  const dim = players[0].dimension;

  const signBlock = dim.getBlock(targetLocation);

  if (!signBlock) {
    log("Could not find a block at specified location.");
    return -1;
  }
  let signPerm = mc.BlockPermutation.resolve(MinecraftBlockTypes.StandingSign, { ground_sign_direction: 8 });

  signBlock.setPermutation(signPerm);

  const signComponent = signBlock.getComponent(mc.BlockComponentTypes.Sign);

  signComponent?.setText(`Basic sign!\nThis is green on the front.`);
}

/**
 * Creates a single-sided simple sign
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/BlockPermutation
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/BlockSignComponent
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/RawMessage
 */
export function addTranslatedSign(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  const players = mc.world.getPlayers();

  const dim = players[0].dimension;

  const signBlock = dim.getBlock(targetLocation);

  if (!signBlock) {
    log("Could not find a block at specified location.");
    return -1;
  }
  let signPerm = mc.BlockPermutation.resolve(MinecraftBlockTypes.StandingSign, { ground_sign_direction: 8 });

  signBlock.setPermutation(signPerm);

  const signComponent = signBlock.getComponent(mc.BlockComponentTypes.Sign);

  signComponent?.setText({ translate: "item.skull.player.name", with: [players[0].name] });
}

/**
 * Creates a two-sided sign with custom colors and a read-only status
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/BlockSignComponent
 */
export function addTwoSidedSign(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  const players = mc.world.getPlayers();

  const dim = players[0].dimension;

  const signBlock = dim.getBlock(targetLocation);

  if (!signBlock) {
    log("Could not find a block at specified location.");
    return -1;
  }
  let signPerm = mc.BlockPermutation.resolve(MinecraftBlockTypes.StandingSign, { ground_sign_direction: 8 });

  signBlock.setPermutation(signPerm);

  const signComponent = signBlock.getComponent(mc.BlockComponentTypes.Sign);

  if (signComponent) {
    signComponent.setText(`Party Sign!\nThis is green on the front.`);
    signComponent.setText(`Party Sign!\nThis is red on the back.`, mc.SignSide.Back);
    signComponent.setTextDyeColor(mc.DyeColor.Green);
    signComponent.setTextDyeColor(mc.DyeColor.Red, mc.SignSide.Back);

    // players cannot edit sign!
    signComponent.setWaxed(true);
  } else {
    log("Could not find sign component.");
  }
}
