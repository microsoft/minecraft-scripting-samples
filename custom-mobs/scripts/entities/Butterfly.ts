import { EffectType, EffectTypes, WorldSoundOptions, world } from "@minecraft/server";
import ButterflyBase from "../generated/ButterflyBase";

export default class Butterfly extends ButterflyBase {
  didSpawn(): void {
    world.sendMessage("Hello, I'm a poison butterfly " + this.id + "! Let's be friends.");
  }

  didMoveBlock(): void {
    // poison other nearby entities
    let entityItems = this.nearbyOthers(10);

    for (let entityItem of entityItems) {
      let poison = EffectTypes.get("minecraft:poison");

      if (poison) {
        if (!entityItem.getEffect(poison)) {
          entityItem.addEffect(poison, 4, 4, true);
          if (entityItem.entity) {
            world.playSound("block.sweet_berry_bush.hurt", entityItem.entity.location);
          }
        }
      }
    }
  }

  didDie() {
    this.hiveDestroyed(); // trigger hive_destroyed entity event.
  }
}
