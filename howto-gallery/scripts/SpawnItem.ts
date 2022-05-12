import * as mc from "mojang-minecraft";

const overworld = mc.world.getDimension("overworld");

/**
 * Creates a free-floating feather item in the world.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://docs.microsoft.com/minecraft/creator/scriptapi/mojang-minecraft/itemStack
 * @see https://docs.microsoft.com/minecraft/creator/scriptapi/mojang-minecraft/dimension#spawnitem
 */
export function spawnItem(log: (message: string, status?: number) => void, targetLocation: mc.Location) {
  const featherItem = new mc.ItemStack(mc.MinecraftItemTypes.feather, 1, 0);

  overworld.spawnItem(featherItem, targetLocation);
  log("New feather created!");
}

/**
 * Tests whether there is a feather nearby a spot.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://docs.microsoft.com/minecraft/creator/scriptapi/mojang-minecraft/entityitemcomponent
 * @see https://docs.microsoft.com/minecraft/creator/scriptapi/mojang-minecraft/entityqueryoptions
 * @see https://docs.microsoft.com/minecraft/creator/scriptapi/mojang-minecraft/dimension#getentities
 */
export function testThatEntityIsFeatherItem(
  log: (message: string, status?: number) => void,
  targetLocation: mc.Location
) {
  const query = new mc.EntityQueryOptions();
  query.type = "item";
  query.location = targetLocation;
  const items = overworld.getEntities(query);

  for (const item of items) {
    const itemComp = item.getComponent("item") as any;

    if (itemComp) {
      if (itemComp.itemStack.id.endsWith("feather")) {
        console.log("Success! Found a feather", 1);
      }
    }
  }
}
