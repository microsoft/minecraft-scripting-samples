import { ItemComponentConsumeEvent, ItemCustomComponent } from "@minecraft/server";

export class NightVisionConsumeComponent implements ItemCustomComponent {
  onConsume(arg: ItemComponentConsumeEvent) {
    arg.source.addEffect("minecraft:night_vision", 600);
  }
}
