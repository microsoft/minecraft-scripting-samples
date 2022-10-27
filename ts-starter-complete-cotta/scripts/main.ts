import { world, system, BlockLocation, MinecraftBlockTypes } from "@minecraft/server";
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

  // catch in case we've already added this score before.
  try {
    overworld.runCommandAsync('scoreboard objectives add score dummy "Level"');
  } catch (e) {}

  // eliminate pesky nearby mobs
  try {
    overworld.runCommandAsync("kill @e[type=!player]");
  } catch (e) {}

  overworld.runCommandAsync("scoreboard objectives setdisplay sidebar score");

  overworld.runCommandAsync("give @p diamond_sword");
  overworld.runCommandAsync("give @p dirt 64");

  overworld.runCommandAsync("scoreboard players set @p score 0");

  world.say("BREAK THE TERRACOTTA");
  Utilities.fillBlock(
    MinecraftBlockTypes.air,
    ARENA_X_OFFSET - ARENA_X_SIZE / 2 + 1,
    ARENA_Y_OFFSET,
    ARENA_Z_OFFSET - ARENA_Z_SIZE / 2 + 1,
    ARENA_X_OFFSET + ARENA_X_SIZE / 2 - 1,
    ARENA_Y_OFFSET + 10,
    ARENA_Z_OFFSET + ARENA_Z_SIZE / 2 - 1
  );

  Utilities.fourWalls(
    MinecraftBlockTypes.cobblestone,
    ARENA_X_OFFSET - ARENA_X_SIZE / 2,
    ARENA_Y_OFFSET,
    ARENA_Z_OFFSET - ARENA_Z_SIZE / 2,
    ARENA_X_OFFSET + ARENA_X_SIZE / 2,
    ARENA_Y_OFFSET + 10,
    ARENA_Z_OFFSET + ARENA_Z_SIZE / 2
  );

  overworld.runCommandAsync(
    "tp @p " + String(ARENA_X_OFFSET - 3) + " " + ARENA_Y_OFFSET + " " + String(ARENA_Z_OFFSET - 3)
  );
}

function gameTick() {
  try {
    if (curTick === START_TICK) {
      initializeBreakTheTerracotta();
    }

    curTick++;

    if (curTick > START_TICK && curTick % 20 === 0) {
      let overworld = world.getDimension("overworld");

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

    let spawnInterval = Math.ceil(200 / ((score + 1) / 3));
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
  let overworld = world.getDimension("overworld");

  // create new terracotta
  cottaX = Math.floor(Math.random() * (ARENA_X_SIZE - 1)) - (ARENA_X_SIZE / 2 - 1);
  cottaZ = Math.floor(Math.random() * (ARENA_Z_SIZE - 1)) - (ARENA_Z_SIZE / 2 - 1);

  world.say("Creating new terracotta!");
  overworld
    .getBlock(new BlockLocation(cottaX + ARENA_X_OFFSET, 1 + ARENA_Y_OFFSET, cottaZ + ARENA_Z_OFFSET))
    .setType(MinecraftBlockTypes.yellowGlazedTerracotta);
}

function checkForTerracotta() {
  let overworld = world.getDimension("overworld");

  let block = overworld.getBlock(
    new BlockLocation(cottaX + ARENA_X_OFFSET, 1 + ARENA_Y_OFFSET, cottaZ + ARENA_Z_OFFSET)
  );

  if (block.type !== MinecraftBlockTypes.yellowGlazedTerracotta) {
    // we didn't find the terracotta! set a new spawn countdown
    score++;
    spawnCountdown = 2;
    cottaX = -1;
    overworld.runCommandAsync("scoreboard players set @p score " + score);
    world.say("You broke the terracotta! Creating new terracotta in a few seconds.");
    cottaZ = -1;
  }
}

function spawnMobs() {
  let overworld = world.getDimension("overworld");

  // spawn mobs = create 1-2 mobs
  let spawnMobCount = Math.floor(Math.random() * 2) + 1;

  for (let j = 0; j < spawnMobCount; j++) {
    let zombieX = Math.floor(Math.random() * (ARENA_X_SIZE - 2)) - ARENA_X_SIZE / 2;
    let zombieZ = Math.floor(Math.random() * (ARENA_Z_SIZE - 2)) - ARENA_Z_SIZE / 2;

    overworld.spawnEntity(
      "minecraft:zombie",
      new BlockLocation(zombieX + ARENA_X_OFFSET, 1 + ARENA_Y_OFFSET, zombieZ + ARENA_Z_OFFSET)
    );
  }
}
function addFuzzyLeaves() {
  let overworld = world.getDimension("overworld");

  for (let i = 0; i < 10; i++) {
    const leafX = Math.floor(Math.random() * (ARENA_X_SIZE - 1)) - (ARENA_X_SIZE / 2 - 1);
    const leafY = Math.floor(Math.random() * 10);
    const leafZ = Math.floor(Math.random() * (ARENA_Z_SIZE - 1)) - (ARENA_Z_SIZE / 2 - 1);

    overworld
      .getBlock(new BlockLocation(leafX + ARENA_X_OFFSET, leafY + ARENA_Y_OFFSET, leafZ + ARENA_Z_OFFSET))
      .setType(MinecraftBlockTypes.leaves);
  }
}
system.run(gameTick);
