import * as mc from "@minecraft/server";

const overworld = mc.world.getDimension("overworld");

/**
 * Creates a creeper and then triggers an explosion.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/dimension#spawnentity
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/entity#triggerevent
 */
export function triggerEvent(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  const creeper = overworld.spawnEntity("minecraft:creeper", targetLocation);

  creeper.triggerEvent("minecraft:start_exploding_forced");
}

/**
 * Creates a zombie and then applies an impulse.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/entity#applyimpulse
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/entity#clearvelocity
 */
export function applyImpulse(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  const zombie = overworld.spawnEntity("minecraft:zombie", targetLocation);

  zombie.clearVelocity();

  // throw the zombie up in the air
  zombie.applyImpulse({ x: 0, y: 0.5, z: 0 });
}

/**
 * Gets a velocity of a firework
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/entity#getvelocity
 */
export function getFireworkVelocity(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  const fireworkRocket = overworld.spawnEntity("minecraft:fireworks_rocket", targetLocation);

  mc.system.runTimeout(() => {
    let velocity = fireworkRocket.getVelocity();

    log("Velocity of firework is: (x: " + velocity.x + ", y:" + velocity.y + ", z:" + velocity.z + ")");
  }, 5);
}

/**
 * Applies damage then heals an entity.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/entity#applydamage
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/EntityHealthComponent
 */
export function applyDamageThenHeal(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  const skelly = overworld.spawnEntity("minecraft:skeleton", targetLocation);

  skelly.applyDamage(19); // skeletons have max damage of 20 so this is a near-death skeleton

  mc.system.runTimeout(() => {
    let health = skelly.getComponent("health");
    log("Skeleton health before heal: " + health?.currentValue);
    health?.resetToMaxValue();
    log("Skeleton health after heal: " + health?.currentValue);
  }, 20);
}

/**
 * Applies damage then heals an entity.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/entity#setOnFire
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/entity#extinguishFire
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/EntityOnFireComponent
 */
export function setOnFire(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  const skelly = overworld.spawnEntity("minecraft:skeleton", targetLocation);

  skelly.setOnFire(20, true);

  mc.system.runTimeout(() => {
    let onfire = skelly.getComponent("onfire");
    log(onfire?.onFireTicksRemaining + " fire ticks remaining.");

    skelly.extinguishFire(true);
    log("Never mind. Fire extinguished.");
  }, 20);
}

/**
 * Does a basic teleport action.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/entity#teleport
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/TeleportOptions
 */
export function teleport(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  const cow = overworld.spawnEntity("minecraft:cow", targetLocation);

  mc.system.runTimeout(() => {
    cow.teleport(
      { x: targetLocation.x + 2, y: targetLocation.y + 2, z: targetLocation.z + 2 },
      {
        facingLocation: targetLocation,
      }
    );
  }, 20);
}

/**
 * Does a basic movements with frequent teleport actions.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/entity#teleport
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/TeleportOptions
 */
export function teleportMovement(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  const pig = overworld.spawnEntity("minecraft:pig", targetLocation);

  let inc = 1;
  let runId = mc.system.runInterval(() => {
    pig.teleport(
      { x: targetLocation.x + inc / 4, y: targetLocation.y + inc / 4, z: targetLocation.z + inc / 4 },
      {
        facingLocation: targetLocation,
      }
    );

    if (inc > 100) {
      mc.system.clearRun(runId);
    }
    inc++;
  }, 4);
}
