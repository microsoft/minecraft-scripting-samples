import { world, WorldInitializeAfterEvent } from "@minecraft/server";
import Challenge from "./Challenge.js";

const cv = new Challenge();

world.afterEvents.worldInitialize.subscribe(worldInit);

function worldInit(event: WorldInitializeAfterEvent) {
  cv.init(event.propertyRegistry);
}
