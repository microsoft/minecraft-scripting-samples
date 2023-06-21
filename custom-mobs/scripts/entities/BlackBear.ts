import { world } from "@minecraft/server";
import BlackBearBase from "../generated/BlackBearBase";
import { registerEntityType } from "../framework/EntityFramework";

export default class BlackBear extends BlackBearBase {
  didSpawn(): void {
    world.sendMessage("ROAR! I'm " + this.id + " and of type " + this.typeId);
  }

  didDie() {
    let bears = this.nearbyPeers();

    // killing a bear makes surrounding bears angry
    for (const nearbyBear of bears) {
      if (nearbyBear instanceof BlackBear) {
        world.sendMessage("Bear " + nearbyBear.id + " IS ANGRY!!!");
        nearbyBear.anger();
      }
    }
  }
}
