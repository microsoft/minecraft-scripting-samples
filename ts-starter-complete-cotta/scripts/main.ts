import { world, system, BlockPermutation, EntityInventoryComponent, ItemStack, DisplaySlotId } from "@minecraft/server";
import Utilities from "./Utilities.js";

const START_TICK = 100;
const ARENA_X_SIZE = 30;
const ARENA_Z_SIZE = 30;
const ARENA_X_OFFSET = 0;
const ARENA_Y_OFFSET = -60;
const ARENA_Z_OFFSET = 0;

// global variables
let curTick = 0;
let score = 0;
let cottaX = 0;
let cottaZ = 0;
let spawnCountdown = 1;

function initializeBreakTheTerracotta() {
  const overworld = world.getDimension("overworld");

  let scoreObjective = world.scoreboard.getObjective("score");

  if (!scoreObjective) {
    scoreObjective = world.scoreboard.addObjective("score", "Level");
  }

  // eliminate pesky nearby mobs
  let entities = overworld.getEntities({
    excludeTypes: ["player"],
  });

  for (let entity of entities) {
    entity.kill();
  }

  // set up scoreboard
  world.scoreboard.setObjectiveAtDisplaySlot(DisplaySlotId.Sidebar, {
    objective: scoreObjective,
  });

  let players = world.getAllPlayers();

  for (let player of players) {
    player.runCommand("scoreboard players set @s score 0");

    let inv = player.getComponent("inventory") as EntityInventoryComponent;
    inv.container.addItem(new ItemStack("diamond_sword"));
    inv.container.addItem(new ItemStack("dirt", 64));

    player.teleport(
      {
        x: ARENA_X_OFFSET - 3,
        y: ARENA_Y_OFFSET,
        z: ARENA_Z_OFFSET - 3,
      },
      {
        dimension: overworld,
        rotation: { x: 0, y: 0 },
      }
    );
  }

  world.sendMessage("BREAK THE TERRACOTTA");

  let airBlockPerm = BlockPermutation.resolve("minecraft:air");
  let cobblestoneBlockPerm = BlockPermutation.resolve("minecraft:cobblestone");

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
    console.warn("Tick error: " + e);
  }

  system.run(gameTick);
}

function spawnNewTerracotta() {
  const overworld = world.getDimension("overworld");

  // create new terracotta
  cottaX = Math.floor(Math.random() * (ARENA_X_SIZE - 1)) - (ARENA_X_SIZE / 2 - 1);
  cottaZ = Math.floor(Math.random() * (ARENA_Z_SIZE - 1)) - (ARENA_Z_SIZE / 2 - 1);

  world.sendMessage("Creating new terracotta!");
  let block = overworld.getBlock({ x: cottaX + ARENA_X_OFFSET, y: 1 + ARENA_Y_OFFSET, z: cottaZ + ARENA_Z_OFFSET });

  if (block) {
    block.setPermutation(BlockPermutation.resolve("minecraft:yellow_glazed_terracotta"));
  }
}

function checkForTerracotta() {
  const overworld = world.getDimension("overworld");

  let block = overworld.getBlock({ x: cottaX + ARENA_X_OFFSET, y: 1 + ARENA_Y_OFFSET, z: cottaZ + ARENA_Z_OFFSET });

  if (block && !block.permutation.matches("minecraft:yellow_glazed_terracotta")) {
    // we didn't find the terracotta! set a new spawn countdown
    score++;
    spawnCountdown = 2;
    cottaX = -1;

    let players = world.getAllPlayers();

    for (let player of players) {
      player.runCommand("scoreboard players set @s score " + score);
    }

    world.sendMessage("You broke the terracotta! Creating new terracotta in a few seconds.");
    cottaZ = -1;
  }
}

function spawnMobs() {
  const overworld = world.getDimension("overworld");

  // spawn mobs = create 1-2 mobs
  let spawnMobCount = Math.floor(Math.random() * 2) + 1;

  for (let j = 0; j < spawnMobCount; j++) {
    let zombieX = Math.floor(Math.random() * (ARENA_X_SIZE - 2)) - ARENA_X_SIZE / 2;
    let zombieZ = Math.floor(Math.random() * (ARENA_Z_SIZE - 2)) - ARENA_Z_SIZE / 2;

    overworld.spawnEntity("minecraft:zombie", {
      x: zombieX + ARENA_X_OFFSET,
      y: 1 + ARENA_Y_OFFSET,
      z: zombieZ + ARENA_Z_OFFSET,
    });
  }
}

function addFuzzyLeaves() {
  const overworld = world.getDimension("overworld");

  for (let i = 0; i < 10; i++) {
    const leafX = Math.floor(Math.random() * (ARENA_X_SIZE - 1)) - (ARENA_X_SIZE / 2 - 1);
    const leafY = Math.floor(Math.random() * 10);
    const leafZ = Math.floor(Math.random() * (ARENA_Z_SIZE - 1)) - (ARENA_Z_SIZE / 2 - 1);

    overworld
      .getBlock({ x: leafX + ARENA_X_OFFSET, y: leafY + ARENA_Y_OFFSET, z: leafZ + ARENA_Z_OFFSET })
      ?.setPermutation(BlockPermutation.resolve("minecraft:leaves"));
  }
}

system.run(gameTick);
