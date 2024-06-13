import {
  VECTOR3_DOWN,
  VECTOR3_EAST,
  VECTOR3_NORTH,
  VECTOR3_SOUTH,
  VECTOR3_UP,
  VECTOR3_WEST,
  Vector3Utils,
} from "@minecraft/math";
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

function getConePoints(origin: Vector3, forward: Vector3, distance: number, spread: number, density: number) {
  const right = Vector3Utils.cross(forward, VECTOR3_UP);

  const points: Vector3[] = [];
  for (let row = 0; row <= distance * density; row++) {
    for (let column = 0; column <= spread * density; column++) {
      const rowOffset = row / density;
      let point = Vector3Utils.add(origin, Vector3Utils.scale(forward, rowOffset));
      const columnWidth = rowOffset / distance;
      const columnOffset = ((spread - 1) / -2) * columnWidth + (column / density) * columnWidth;
      point = Vector3Utils.add(point, Vector3Utils.scale(right, columnOffset));
      points.push(point);
    }
  }

  return points;
}

function getBlocksBelowPoints(dimension: Dimension, points: Vector3[], maxOffset: number) {
  const blocks: Block[] = [];
  for (const point of points) {
    let offset = 0;
    let block = dimension.getBlock(point);
    while (block && block.matches(MinecraftBlockTypes.Air) && offset < 10) {
      offset++;
      const offsetPoint = Vector3Utils.add(point, { x: 0, y: -offset, z: 0 });
      block = dimension.getBlock(offsetPoint);
    }
    if (!block) {
      continue;
    }
    blocks.push(block);
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
  waterVariables.setVector3("direction", VECTOR3_DOWN);

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
  if (arg.usedOnBlockPermutation.matches(MinecraftBlockTypes.Water)) {
    isWater = true;
  } else {
    switch (arg.blockFace) {
      case Direction.Down:
        loc = Vector3Utils.add(loc, VECTOR3_DOWN);
        break;
      case Direction.East:
        loc = Vector3Utils.add(loc, VECTOR3_EAST);
        break;
      case Direction.North:
        loc = Vector3Utils.add(loc, VECTOR3_SOUTH);
        break;
      case Direction.South:
        loc = Vector3Utils.add(loc, VECTOR3_NORTH);
        break;
      case Direction.Up:
        loc = Vector3Utils.add(loc, VECTOR3_UP);
        break;
      case Direction.West:
        loc = Vector3Utils.add(loc, VECTOR3_WEST);
        break;
    }
    const block = arg.source.dimension.getBlock(loc);
    if (block && block.matches(MinecraftBlockTypes.Water)) {
      isWater = true;
    }
  }

  if (isWater) {
    world.playSound("bucket.fill_water", loc);
    setPlayerItem("starter:spray_can_full", arg.source as Player);
  }
}
