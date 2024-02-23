// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as mc from "@minecraft/server";

const overworld = mc.world.getDimension("overworld");

/**
 * Amongst a set of entities, uses entity query to find specific entities and bounce them with applyKnockback.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/dimension#getentities
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/EntityQueryOptions
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/entity#applyknockback
 */
export function bounceSkeletons(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  let mobs = ["creeper", "skeleton", "sheep"];

  // create some sample mob data
  for (let i = 0; i < 10; i++) {
    overworld.spawnEntity(mobs[i % mobs.length], targetLocation);
  }

  let eqo: mc.EntityQueryOptions = {
    type: "skeleton",
  };

  for (let entity of overworld.getEntities(eqo)) {
    entity.applyKnockback(0, 0, 0, 1);
  }
}

/**
 * Amongst a set of entities, uses entity query to find specific entities based on a tag.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/dimension#getentities
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/EntityQueryOptions
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/entity#kill
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/entity#addtag
 */
export function tagsQuery(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  let mobs = ["creeper", "skeleton", "sheep"];

  // create some sample mob data
  for (let i = 0; i < 10; i++) {
    let mobTypeId = mobs[i % mobs.length];
    let entity = overworld.spawnEntity(mobTypeId, targetLocation);
    entity.addTag("mobparty." + mobTypeId);
  }

  let eqo: mc.EntityQueryOptions = {
    tags: ["mobparty.skeleton"],
  };

  for (let entity of overworld.getEntities(eqo)) {
    entity.kill();
  }
}
