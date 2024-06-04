import {
  Block,
  Dimension,
  Direction,
  EntityComponentTypes,
  ItemComponentCompleteUseEvent,
  ItemComponentUseOnEvent,
  ItemStack,
  MolangVariableMap,
  Player,
  Vector3,
  world,
} from "@minecraft/server";
import { MinecraftBlockTypes } from "@minecraft/vanilla-data";

const up: Vector3 = { x: 0, y: 1, z: 0 };
const down: Vector3 = { x: 0, y: -1, z: 0 };

function add(v1: Vector3, v2: Vector3): Vector3 {
  return { x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z };
}

function scale(a: Vector3, s: number): Vector3 {
  return { x: a.x * s, y: a.y * s, z: a.z * s };
}

function toString(v: Vector3, options?: { decimals?: number; delimiter?: string }): string {
  const decimals = options?.decimals ?? 2;
  const str: string[] = [v.x.toFixed(decimals), v.y.toFixed(decimals), v.z.toFixed(decimals)];
  return str.join(options?.delimiter ?? ", ");
}

function cross(a: Vector3, b: Vector3): Vector3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

function getConePoints(origin: Vector3, forward: Vector3, distance: number, spread: number, density: number) {
  const right = cross(forward, up);

  const points: Vector3[] = [];
  for (let row = 0; row <= distance * density; row++) {
    for (let column = 0; column <= spread * density; column++) {
      const rowOffset = row / density;
      let point = add(origin, scale(forward, rowOffset));
      const columnWidth = rowOffset / distance;
      const columnOffset = ((spread - 1) / -2) * columnWidth + (column / density) * columnWidth;
      point = add(point, scale(right, columnOffset));
      points.push(point);
    }
  }

  return points;
}

function getBlocksBelowPoints(dimension: Dimension, points: Vector3[], maxOffset: number) {
  const blocks = new Map<string, Block>();
  for (const point of points) {
    let offset = 0;
    let block = dimension.getBlock(point);
    while (block && block.matches(MinecraftBlockTypes.Air) && offset < 10) {
      offset++;
      const offsetPoint = add(point, { x: 0, y: -offset, z: 0 });
      block = dimension.getBlock(offsetPoint);
    }
    if (!block) {
      continue;
    }
    blocks.set(toString(block.location), block);
  }

  return blocks.values();
}

function sprayAnimation(
  dimension: Dimension,
  points: Vector3[],
  particle: string,
  particleVariables: MolangVariableMap
) {
  points.forEach((point) => dimension.spawnParticle(particle, point, particleVariables));
}

function tryWetFarmland(dimension: Dimension, points: Vector3[]) {
  const blocks = getBlocksBelowPoints(dimension, points, 10);
  for (const block of blocks) {
    if (block && block.permutation.matches(MinecraftBlockTypes.Farmland)) {
      block.setPermutation(block.permutation.withState("moisturized_amount", 7));
    }
  }
}

function setPlayerItem(itemId: string, player: Player) {
  const newItem = new ItemStack(itemId);
  const inventory = player.getComponent(EntityComponentTypes.Inventory);
  inventory?.container?.setItem(player.selectedSlotIndex, newItem);
}

export function sprayWater(arg: ItemComponentCompleteUseEvent) {
  const dimension = arg.source.dimension;
  const viewDir = arg.source.getViewDirection();
  const forward: Vector3 = { x: viewDir.x, y: 0, z: viewDir.z };
  const waterVariables = new MolangVariableMap();
  waterVariables.setVector3("direction", down);

  world.playSound("mob.llama.spit", arg.source.location);
  sprayAnimation(
    dimension,
    getConePoints(arg.source.getHeadLocation(), forward, 9, 9, 2),
    "minecraft:water_splash_particle_manual",
    waterVariables
  );
  tryWetFarmland(dimension, getConePoints(arg.source.getHeadLocation(), forward, 9, 9, 10));
  setPlayerItem("starter:spray_can_empty", arg.source);
}

export function gatherWater(arg: ItemComponentUseOnEvent) {
  let loc = arg.block.location;
  let isWater = false;
  if (arg.usedOnBlockPermutation.type.id === "minecraft:water") {
    isWater = true;
  } else if (arg.blockFace == Direction.Up) {
    const newLoc: Vector3 = { x: arg.block.location.x, y: arg.block.location.y + 1, z: arg.block.location.z };
    const block = arg.source.dimension.getBlock(newLoc);
    if (block && block.typeId === "minecraft:water") {
      isWater = true;
      loc = newLoc;
    }
  }

  if (isWater) {
    world.playSound("bucket.fill_water", loc);
    setPlayerItem("starter:spray_can_full", arg.source as Player);
  }
}
