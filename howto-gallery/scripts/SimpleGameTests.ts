import * as mc from "@minecraft/server";
import * as gt from "@minecraft/server-gametest";
import { MinecraftBlockTypes, MinecraftEntityTypes } from "@minecraft/vanilla-data";

/**
 * A simple mob test - the fox should attack the chicken.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server-gametest/mojang-gametest#register
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server-gametest/test#spawn
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server-gametest/test#succeedwhen
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server-gametest/test#assertentitypresentinarea
 */
export function simpleMobTest(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  gt.register("StarterTests", "simpleMobTest", (test: gt.Test) => {
    const attackerId = MinecraftEntityTypes.Fox;
    const victimId = MinecraftEntityTypes.Chicken;

    test.spawn(attackerId, { x: 5, y: 2, z: 5 });
    test.spawn(victimId, { x: 2, y: 2, z: 2 });

    test.assertEntityPresentInArea(victimId, true);

    test.succeedWhen(() => {
      test.assertEntityPresentInArea(victimId, false);
    });
  })
    .maxTicks(400)
    .structureName("gametests:mediumglass");
}

/**
 * Tests a failure case - phantoms should fly away from cats, but get "captured" by them.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server-gametest/mojang-gametest#register
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server-gametest/registrationbuilder#structurename
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server-gametest/registrationbuilder#tag
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server-gametest/test#spawn
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server-gametest/test#succeedwhenentitypresent
 */
function phantomsShouldFlyFromCats(test: gt.Test) {
  test.spawn(MinecraftEntityTypes.Cat, { x: 4, y: 3, z: 3 });
  test.spawn(MinecraftEntityTypes.Phantom, { x: 4, y: 3, z: 3 });

  test.succeedWhenEntityPresent(MinecraftEntityTypes.Phantom, { x: 4, y: 6, z: 3 }, true);
}
gt.register("MobBehaviorTests", "phantoms_should_fly_from_cats", phantomsShouldFlyFromCats)
  .structureName("gametests:glass_cells")
  .tag("suite:broken");

/**
 * Tests a roller coater obstacle course.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server-gametest/mojang-gametest#register
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server-gametest/test#spawn
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server-gametest/test#succeedwhenentitypresent
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/entityrideablecomponent
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/entityrideablecomponent#addrider
 */
function minibiomes(test: gt.Test) {
  const minecart = test.spawn(MinecraftEntityTypes.Minecart, { x: 9, y: 7, z: 7 });
  const pig = test.spawn(MinecraftEntityTypes.Pig, { x: 9, y: 7, z: 7 });

  test.setBlockType(MinecraftBlockTypes.Cobblestone, { x: 10, y: 7, z: 7 });

  const minecartRideableComp = minecart.getComponent(mc.EntityComponentTypes.Rideable);

  minecartRideableComp?.addRider(pig);

  test.succeedWhenEntityPresent(MinecraftEntityTypes.Pig, { x: 8, y: 3, z: 1 }, true);
}
gt.register("ChallengeTests", "minibiomes", minibiomes).structureName("gametests:minibiomes").maxTicks(160);
