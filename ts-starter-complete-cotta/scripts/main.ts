import {
  world,
  system,
  BlockPermutation,
  EntityInventoryComponent,
  ItemStack,
  DisplaySlotId,
  Vector3,
} from "@minecraft/server";
import Utilities from "./Utilities.js";
import { Vector3Utils } from "@minecraft/math";
import {
  MinecraftBlockTypes,
  MinecraftDimensionTypes,
  MinecraftEntityTypes,
  MinecraftItemTypes,
} from "@minecraft/vanilla-data";

const START_TICK = 100;
const ARENA_X_SIZE = 30;
const ARENA_Z_SIZE = 30;
const ARENA_X_OFFSET = 0;
const ARENA_Y_OFFSET = -60;
const ARENA_Z_OFFSET = 0;
const ARENA_VECTOR_OFFSET: Vector3 = { x: ARENA_X_OFFSET, y: ARENA_Y_OFFSET, z: ARENA_Z_OFFSET };

// global variables
let curTick = 0;
let score = 0;
let cottaX = 0;
let cottaZ = 0;
let spawnCountdown = 1;

function initializeBreakTheTerracotta() {
  const overworld = world.getDimension(MinecraftDimensionTypes.Overworld);

  let scoreObjective = world.scoreboard.getObjective("score");

  if (!scoreObjective) {
    scoreObjective = world.scoreboard.addObjective("score", "Level");
  }

  // eliminate pesky nearby mobs
  let entities = overworld.getEntities({
    excludeTypes: [MinecraftEntityTypes.Player],
  });

  for (let entity of entities) {
    entity.kill();
  }

  // set up scoreboard
  world.scoreboard.setObjectiveAtDisplaySlot(DisplaySlotId.Sidebar, {
    objective: scoreObjective,
  });

  const players = world.getAllPlayers();

  for (const player of players) {
    scoreObjective.setScore(player, 0);

    let inv = player.getComponent("inventory") as EntityInventoryComponent;
    inv.container?.addItem(new ItemStack(MinecraftItemTypes.DiamondSword));
    inv.container?.addItem(new ItemStack(MinecraftItemTypes.Dirt, 64));

    player.teleport(Vector3Utils.add(ARENA_VECTOR_OFFSET, { x: -3, y: 0, z: -3 }), {
      dimension: overworld,
      rotation: { x: 0, y: 0 },
    });
  }

  world.sendMessage("BREAK THE TERRACOTTA");

  let airBlockPerm = BlockPermutation.resolve(MinecraftBlockTypes.Air);
  let cobblestoneBlockPerm = BlockPermutation.resolve(MinecraftBlockTypes.Cobblestone);

  if (airBlockPerm) {
    Utilities.fillBlock(
      airBlockPerm,
      ARENA_X_OFFSET - ARENA_X_SIZE / 2 + 1,
      ARENA_Y_OFFSET,
      ARENA_Z_OFFSET - ARENA_Z_SIZE / 2 + 1,
      ARENA_X_OFFSET + ARENA_X_SIZE / 2 - 1,
      ARENA_Y_OFFSET + 10,
      ARENA_Z_OFFSET + ARENA_Z_SIZE / 2 - 1
    );
  }

  if (cobblestoneBlockPerm) {
    Utilities.fourWalls(
      cobblestoneBlockPerm,
      ARENA_X_OFFSET - ARENA_X_SIZE / 2,
      ARENA_Y_OFFSET,
      ARENA_Z_OFFSET - ARENA_Z_SIZE / 2,
      ARENA_X_OFFSET + ARENA_X_SIZE / 2,
      ARENA_Y_OFFSET + 10,
      ARENA_Z_OFFSET + ARENA_Z_SIZE / 2
    );
  }
}

function warn(message: string) {
  // The "dev:" here means that console.warn will be removed when making a publish build.
  // You can make a publish build with `npm run build -- -- --production`.
  dev: console.warn(message);
}

function gameTick() {
  try {
    curTick++;

    if (curTick === START_TICK) {
      initializeBreakTheTerracotta();
    }

    if (curTick > START_TICK && curTick % 20 === 0) {
      // no terracotta exists, and we're waiting to spawn a new one.
      if (spawnCountdown > 0) {
        spawnCountdown--;

        if (spawnCountdown <= 0) {
          spawnNewTerracotta();
        }
      } else {
        checkForTerracotta();
      }
    }

    const spawnInterval = Math.ceil(200 / ((score + 1) / 3));
    if (curTick > START_TICK && curTick % spawnInterval === 0) {
      spawnMobs();
    }

    if (curTick > START_TICK && curTick % 29 === 0) {
      addFuzzyLeaves();
    }
  } catch (e) {
    warn("Tick error: " + e);
  }

  system.run(gameTick);
}

function spawnNewTerracotta() {
  const overworld = world.getDimension(MinecraftDimensionTypes.Overworld);

  // create new terracotta
  cottaX = Math.floor(Math.random() * (ARENA_X_SIZE - 1)) - (ARENA_X_SIZE / 2 - 1);
  cottaZ = Math.floor(Math.random() * (ARENA_Z_SIZE - 1)) - (ARENA_Z_SIZE / 2 - 1);

  world.sendMessage("Creating new terracotta!");
  let block = overworld.getBlock(Vector3Utils.add(ARENA_VECTOR_OFFSET, { x: cottaX, y: 1, z: cottaZ }));

  if (block) {
    block.setPermutation(BlockPermutation.resolve(MinecraftBlockTypes.YellowGlazedTerracotta));
  }
}

function checkForTerracotta() {
  const overworld = world.getDimension(MinecraftDimensionTypes.Overworld);

  let block = overworld.getBlock(Vector3Utils.add(ARENA_VECTOR_OFFSET, { x: cottaX, y: 1, z: cottaZ }));

  if (block && !block.permutation.matches(MinecraftBlockTypes.YellowGlazedTerracotta)) {
    // we didn't find the terracotta! set a new spawn countdown
    score++;
    spawnCountdown = 2;
    cottaX = -1;

    const scoreObjective = world.scoreboard.getObjective("score");
    if (scoreObjective) {
      let players = world.getAllPlayers();

      for (let player of players) {
        scoreObjective.setScore(player, score);
      }
    } else {
      warn("Score objective not found");
    }

    world.sendMessage("You broke the terracotta! Creating new terracotta in a few seconds.");
    cottaZ = -1;
  }
}

function spawnMobs() {
  const overworld = world.getDimension(MinecraftDimensionTypes.Overworld);

  // spawn mobs = create 1-2 mobs
  let spawnMobCount = Math.floor(Math.random() * 2) + 1;

  for (let j = 0; j < spawnMobCount; j++) {
    let zombieX = Math.floor(Math.random() * (ARENA_X_SIZE - 2)) - ARENA_X_SIZE / 2;
    let zombieZ = Math.floor(Math.random() * (ARENA_Z_SIZE - 2)) - ARENA_Z_SIZE / 2;

    overworld.spawnEntity(
      MinecraftEntityTypes.Zombie,
      Vector3Utils.add(ARENA_VECTOR_OFFSET, { x: zombieX, y: 1, z: zombieZ })
    );
  }
}

function addFuzzyLeaves() {
  const overworld = world.getDimension(MinecraftDimensionTypes.Overworld);

  for (let i = 0; i < 10; i++) {
    const leafX = Math.floor(Math.random() * (ARENA_X_SIZE - 1)) - (ARENA_X_SIZE / 2 - 1);
    const leafY = Math.floor(Math.random() * 10);
    const leafZ = Math.floor(Math.random() * (ARENA_Z_SIZE - 1)) - (ARENA_Z_SIZE / 2 - 1);

    overworld
      .getBlock(Vector3Utils.add(ARENA_VECTOR_OFFSET, { x: leafX, y: leafY, z: leafZ }))
      ?.setPermutation(BlockPermutation.resolve("minecraft:leaves"));
  }
}

system.run(gameTick);
