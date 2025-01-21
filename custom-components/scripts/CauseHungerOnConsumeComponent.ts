import { ItemComponentConsumeEvent, ItemCustomComponent } from "@minecraft/server";

export class CauseHungerOnConsumeComponent implements ItemCustomComponent {
  onConsume(arg: ItemComponentConsumeEvent) {
    arg.source.addEffect("minecraft:hunger", 600);
    arg.source.applyDamage(0.5);
  }
}
