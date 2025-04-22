import {
  world,
  system,
  CustomCommand,
  CommandPermissionLevel,
  CustomCommandParamType,
  StartupEvent,
  CustomCommandResult,
  CustomCommandStatus,
  Entity,
  Vector3,
  CustomCommandOrigin,
} from "@minecraft/server";

function mainTick() {
  if (system.currentTick % 100 === 0) {
    world.sendMessage("Hello custom commands! Tick: " + system.currentTick);
  }

  system.run(mainTick);
}

system.beforeEvents.startup.subscribe((init: StartupEvent) => {
  const helloCommand: CustomCommand = {
    name: "creator:hellocustomcommand",
    description: "Celebration super party hello",
    permissionLevel: CommandPermissionLevel.Any,
    optionalParameters: [{ type: CustomCommandParamType.Integer, name: "celebrationSize" }],
  };
  init.customCommandRegistry.registerCommand(helloCommand, helloCustomCommand);

  const partyCommand: CustomCommand = {
    name: "creator:party",
    description: "Cause selected entities to party",
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [{ type: CustomCommandParamType.EntitySelector, name: "partyParticipants" }],
  };
  init.customCommandRegistry.registerCommand(partyCommand, party);

  const dirtsterCommand: CustomCommand = {
    name: "creator:dirtster",
    description: "Adds some dirt, ster",
    permissionLevel: CommandPermissionLevel.GameDirectors,
    mandatoryParameters: [{ type: CustomCommandParamType.Location, name: "dirtLocation" }],
  };
  init.customCommandRegistry.registerCommand(dirtsterCommand, dirtster);
});

function helloCustomCommand(origin: CustomCommandOrigin, celebrationSize?: number): CustomCommandResult {
  world.sendMessage("Hello Custom Command!");

  if (celebrationSize) {
    system.run(() => {
      for (const player of world.getPlayers()) {
        player.dimension.createExplosion(player.location, celebrationSize);
      }
    });
  }

  return {
    status: CustomCommandStatus.Success,
  };
}

function party(origin: CustomCommandOrigin, entities: Entity[]): CustomCommandResult {
  world.sendMessage("Entity party!");

  system.run(() => {
    for (const entity of entities) {
      entity.applyImpulse({ x: 0, y: 1, z: 0 });
      entity.dimension.spawnParticle("minecraft:ominous_spawning_particle", entity.location);
    }
  }); //

  return {
    status: CustomCommandStatus.Success,
  };
}

function dirtster(origin: CustomCommandOrigin, loc: Vector3): CustomCommandResult {
  world.sendMessage("Lets get dirty!");

  system.run(() => {
    const dim = world.getDimension("overworld");

    dim.setBlockType(loc, "minecraft:dirt");

    // it's a mini dirt pyramid
    dim.setBlockType({ x: loc.x + 2, y: loc.y + 1, z: loc.z }, "minecraft:dirt");
    dim.setBlockType({ x: loc.x - 2, y: loc.y + 1, z: loc.z }, "minecraft:dirt");
    dim.setBlockType({ x: loc.x + 1, y: loc.y + 1, z: loc.z }, "minecraft:dirt");
    dim.setBlockType({ x: loc.x - 1, y: loc.y + 1, z: loc.z }, "minecraft:dirt");
    dim.setBlockType({ x: loc.x, y: loc.y + 1, z: loc.z }, "minecraft:dirt");

    dim.setBlockType({ x: loc.x + 1, y: loc.y + 2, z: loc.z }, "minecraft:dirt");
    dim.setBlockType({ x: loc.x - 1, y: loc.y + 2, z: loc.z }, "minecraft:dirt");
    dim.setBlockType({ x: loc.x, y: loc.y + 2, z: loc.z }, "minecraft:dirt");

    dim.setBlockType({ x: loc.x, y: loc.y + 3, z: loc.z }, "minecraft:dirt");
  }); //

  return {
    status: CustomCommandStatus.Success,
  };
}

system.run(mainTick);
