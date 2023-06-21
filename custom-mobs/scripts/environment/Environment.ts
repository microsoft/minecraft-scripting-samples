import {
  BlockPermutation,
  ButtonPushAfterEvent,
  LeverActionAfterEvent,
  Player,
  Vector3,
  world,
} from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData, ModalFormResponse } from "@minecraft/server-ui";
export enum MobZoo {
  blackBear = 0,
}

const EffectList = [
  "absorption",
  "bad_omen",
  "blindness",
  "clear",
  "conduit_power",
  "darkness",
  "fatal_poison",
  "fire_resistance",
  "haste",
  "health_boost",
  "hunger",
  "instant_damage",
  "instant_health",
  "invisibility",
  "jump_boost",
  "levitation",
  "poison",
];

const MobTypeList = ["mcl:black_bear", "mcl:butterfly", "mcl:biceson"];

export class Environment {
  static spawnLeverLocations: Vector3[] = [];
  static promptLeverLocations: Vector3[] = [];

  static create(location: Vector3) {
    let overworld = world.getDimension("overworld");

    overworld.runCommand("tickingarea add -10 -60 -10 10 -20 10 main true");

    let firstLever = overworld.getBlock(location);

    if (firstLever) {
      firstLever.setPermutation(BlockPermutation.resolve("lever", { lever_direction: "up_north_south" }));
      Environment.spawnLeverLocations.push(location);
    }

    let nextLever = overworld.getBlock({ x: location.x + 4, y: location.y, z: location.z });
    if (nextLever) {
      nextLever.setPermutation(BlockPermutation.resolve("lever", { lever_direction: "up_north_south" }));
      Environment.promptLeverLocations.push(nextLever);
    }

    world.afterEvents.leverAction.subscribe(Environment._handleLeverAction);
  }

  static _handleLeverAction(event: LeverActionAfterEvent) {
    let loc = event.block.location;

    for (const levelLoc of Environment.spawnLeverLocations) {
      if (levelLoc.x === loc.x && levelLoc.y === loc.y && levelLoc.z === loc.z) {
        Environment.showMobDialog(event.player);
        return;
      }
    }
    for (const levelLoc of Environment.promptLeverLocations) {
      if (levelLoc.x === loc.x && levelLoc.y === loc.y && levelLoc.z === loc.z) {
        Environment.showPromptDialog(event.player);
        return;
      }
    }
  }

  static async showPromptDialog(player: Player) {
    let promptForm = new MessageFormData();

    let result = await promptForm
      .title("Remove all nearby mobs?")
      .body("This will remove all nearby mobs. Are you sure?")
      .button1("Yes")
      .button2("Cancel")
      .show(player);

    if (result.selection) {
      let entities = world.getDimension("overworld").getEntities({
        location: player.location,
        minDistance: 0,
        maxDistance: 30,
      });

      for (const entity of entities) {
        if (entity !== player) {
          entity.kill();
        }
      }
    }
  }

  static async showMobDialog(player: Player) {
    let actionForm = new ActionFormData();

    let result = await actionForm
      .title("Mob zoo!")
      .body("Choose a cool mob")
      .button("Black Bear", "textures/entityicons/blackbear")
      .button("Poison Butterfly", "textures/entityicons/butterfly")
      .button("Biceson", "textures/entityicons/biceson")
      .show(player);

    if (!result.canceled && result.selection !== undefined) {
      world.getDimension("overworld").spawnEntity(MobTypeList[result.selection], player.location);
    }
  }
}
