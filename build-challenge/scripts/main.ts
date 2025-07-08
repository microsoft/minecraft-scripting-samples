import { world, WorldLoadAfterEvent } from "@minecraft/server";
import Challenge from "./Challenge.js";

const cv = new Challenge();

world.afterEvents.worldLoad.subscribe(worldInit);

function worldInit(event: WorldLoadAfterEvent) {
  cv.init();
}
