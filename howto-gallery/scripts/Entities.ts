import {
  DimensionLocation,
  EntityComponentTypes,
  EntityHealthComponent,
  EntityOnFireComponent,
  EntityProjectileComponent,
  EntityQueryOptions,
  system,
  world,
} from "@minecraft/server";
import { MinecraftEntityTypes } from "@minecraft/vanilla-data";

/**
 * Creates a creeper and then triggers an explosion.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/dimension#spawnentity
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/entity#triggerevent
 */
export function triggerEvent(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const creeper = targetLocation.dimension.spawnEntity(MinecraftEntityTypes.Creeper, targetLocation);

  creeper.triggerEvent("minecraft:start_exploding_forced");
}

/**
 * Creates a zombie and then applies an impulse.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/entity#applyimpulse
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/entity#clearvelocity
 */
export function applyImpulse(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const zombie = targetLocation.dimension.spawnEntity(MinecraftEntityTypes.Zombie, targetLocation);

  zombie.clearVelocity();

  // throw the zombie up in the air
  zombie.applyImpulse({ x: 0, y: 0.5, z: 0 });
}

/**
 * Gets a velocity of a firework
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/entity#getvelocity
 */
export function getFireworkVelocity(
  log: (message: string, status?: number) => void,
  targetLocation: DimensionLocation
) {
  const fireworkRocket = targetLocation.dimension.spawnEntity(MinecraftEntityTypes.FireworksRocket, targetLocation);

  system.runTimeout(() => {
    const velocity = fireworkRocket.getVelocity();

    log("Velocity of firework is: (x: " + velocity.x + ", y:" + velocity.y + ", z:" + velocity.z + ")");
  }, 5);
}

/**
 * Applies damage then heals an entity.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/entity#applydamage
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/EntityHealthComponent
 */
export function applyDamageThenHeal(
  log: (message: string, status?: number) => void,
  targetLocation: DimensionLocation
) {
  const skelly = targetLocation.dimension.spawnEntity(MinecraftEntityTypes.Skeleton, targetLocation);

  skelly.applyDamage(19); // skeletons have max damage of 20 so this is a near-death skeleton

  system.runTimeout(() => {
    const health = skelly.getComponent(EntityComponentTypes.Health) as EntityHealthComponent;
    log("Skeleton health before heal: " + health?.currentValue);
    health?.resetToMaxValue();
    log("Skeleton health after heal: " + health?.currentValue);
  }, 20);
}

/**
 * Applies damage then heals an entity.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/entity#setOnFire
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/entity#extinguishFire
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/EntityOnFireComponent
 */
export function setOnFire(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const skelly = targetLocation.dimension.spawnEntity(MinecraftEntityTypes.Skeleton, targetLocation);

  skelly.setOnFire(20, true);

  system.runTimeout(() => {
    const onfire = skelly.getComponent(EntityComponentTypes.OnFire) as EntityOnFireComponent;
    log(onfire?.onFireTicksRemaining + " fire ticks remaining.");

    skelly.extinguishFire(true);
    log("Never mind. Fire extinguished.");
  }, 20);
}

/**
 * Does a basic teleport action.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/entity#teleport
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/TeleportOptions
 */
export function teleport(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const cow = targetLocation.dimension.spawnEntity(MinecraftEntityTypes.Cow, targetLocation);

  system.runTimeout(() => {
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
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/entity#teleport
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/TeleportOptions
 */
export function teleportMovement(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const pig = targetLocation.dimension.spawnEntity(MinecraftEntityTypes.Pig, targetLocation);

  let inc = 1;
  const runId = system.runInterval(() => {
    pig.teleport(
      { x: targetLocation.x + inc / 4, y: targetLocation.y + inc / 4, z: targetLocation.z + inc / 4 },
      {
        facingLocation: targetLocation,
      }
    );

    if (inc > 100) {
      system.clearRun(runId);
    }
    inc++;
  }, 4);
}

/**
 * Shoots an arrow.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/EntityProjectileComponent
 */
export function shootArrow(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const velocity = { x: 0, y: 1, z: 5 };

  const arrow = targetLocation.dimension.spawnEntity("minecraft:arrow", {
    x: targetLocation.x,
    y: targetLocation.y + 2,
    z: targetLocation.z,
  });

  const projectileComp = arrow.getComponent("minecraft:projectile") as EntityProjectileComponent;

  projectileComp?.shoot(velocity);
}

/**
 * Spawns a salmon next to every fox, if the fox is standing on stone.
 * Script quivalent of this command: execute as @e[type=fox] positioned as @s if block ^ ^-1 ^ stone run summon salmon
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/EntityQueryOptions
 */
export function blockConditional(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  targetLocation.dimension
    .getEntities({
      type: "fox",
    })
    .filter((entity) => {
      const block = targetLocation.dimension.getBlock({
        x: entity.location.x,
        y: entity.location.y - 1,
        z: entity.location.z,
      });

      return block !== undefined && block.matches("minecraft:stone");
    })
    .forEach((entity) => {
      targetLocation.dimension.spawnEntity("salmon", entity.location);
    });
}

/**
 * Find entities having a property that is equals to
 * Uses default properties of Minecraft bees.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/EntityQueryOptions
 */
export function findEntitiesHavingPropertyEqualsTo(
  log: (message: string, status?: number) => void,
  targetLocation: DimensionLocation
) {
  // Minecraft bees have a has_nectar boolean property
  const queryOption: EntityQueryOptions = {
    propertyOptions: [{ propertyId: "minecraft:has_nectar", value: { equals: true } }],
  };

  const entities = targetLocation.dimension.getEntities(queryOption);
}

/**
 * Plays a sound for every player, based on armor stands
 * Scripting code equivalent to execute as @e[type=armor_stand,name=myArmorStand,tag=dummyTag1,tag=!dummyTag2] run playsound raid.horn @a
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/EntityQueryOptions
 */
export function playSoundChained(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const targetPlayers = targetLocation.dimension.getPlayers();
  const originEntities = targetLocation.dimension.getEntities({
    type: "armor_stand",
    name: "myArmorStand",
    tags: ["dummyTag1"],
    excludeTags: ["dummyTag2"],
  });

  originEntities.forEach((entity) => {
    targetPlayers.forEach((player) => {
      player.playSound("raid.horn");
    });
  });
}

/**
 * Sets a scoreboard for armor stands
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/EntityQueryOptions
 */
export function setScoreboardChained(
  log: (message: string, status?: number) => void,
  targetLocation: DimensionLocation
) {
  const objective = world.scoreboard.addObjective("scoreObjective1", "dummy");
  targetLocation.dimension
    .getEntities({
      type: "armor_stand",
      name: "myArmorStand",
    })
    .forEach((entity) => {
      if (entity.scoreboardIdentity !== undefined) {
        objective.setScore(entity.scoreboardIdentity, -1);
      }
    });
}

/**
 * Summons a mob near every player, based on a number of armor stands
 * Scripting code equivalent to execute as @e[type=armor_stand] run execute as @a[x=0,y=-60,z=0,c=4,r=15] run summon pig ~1 ~ ~
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/EntityQueryOptions
 */
export function summonMobChained(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const armorStandArray = targetLocation.dimension.getEntities({
    type: "armor_stand",
  });
  const playerArray = targetLocation.dimension.getPlayers({
    location: { x: 0, y: -60, z: 0 },
    closest: 4,
    maxDistance: 15,
  });
  armorStandArray.forEach((entity) => {
    playerArray.forEach((player) => {
      targetLocation.dimension.spawnEntity("pig", {
        x: player.location.x + 1,
        y: player.location.y,
        z: player.location.z,
      });
    });
  });
}
