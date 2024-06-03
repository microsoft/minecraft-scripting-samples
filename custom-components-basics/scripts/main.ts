import { world, ItemComponentConsumeEvent } from "@minecraft/server";
import { GrownStrawberryCropComponent } from "./GrownStrawberryCropComponent";
import { CropGrowthComponent } from "./CropGrowthComponent";
import { CauseHungerOnConsumeComponent } from "./CauseHungerOnConsumeComponent";
import { sprayWater, gatherWater } from "./SprayerComponents";

world.beforeEvents.worldInitialize.subscribe(initEvent => {
  // block
  initEvent.blockTypeRegistry.registerCustomComponent('starter:strawberry_grown', new GrownStrawberryCropComponent());
  initEvent.blockTypeRegistry.registerCustomComponent('starter:crop_grow', new CropGrowthComponent());

  // item
  initEvent.itemComponentRegistry.registerCustomComponent('starter:cause_hunger_on_eat', new CauseHungerOnConsumeComponent());
  initEvent.itemComponentRegistry.registerCustomComponent('starter:spray_water', {
    onCompleteUse: sprayWater
  });
  initEvent.itemComponentRegistry.registerCustomComponent('starter:gather_water', {
    onUseOn: gatherWater
  });
  initEvent.itemComponentRegistry.registerCustomComponent('starter:add_night_vision_on_consume', {
    onConsume(arg: ItemComponentConsumeEvent) {
      arg.source.addEffect("minecraft:night_vision", 600);
    }
  });
});
