import * as mc from "@minecraft/server";

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
  let signPerm = mc.BlockPermutation.resolve("minecraft:sign", { ground_sign_direction: 8 });

  signBlock.setPermutation(signPerm);

  const signComponent = signBlock.getComponent("minecraft:sign") as mc.BlockSignComponent;

  signComponent.setText(`Party Sign!\nThis is green on the front.`);
  signComponent.setText(`Party Sign!\nThis is red on the back.`, mc.SignSide.back);
  signComponent.setTextDyeColor(mc.DyeColor.green);
  signComponent.setTextDyeColor(mc.DyeColor.red, mc.SignSide.back);

  // players cannot edit sign!
  signComponent.setWaxed();
}
