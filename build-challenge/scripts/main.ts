import { world, WorldInitializeEvent } from "@minecraft/server";
import Challenge from "./Challenge";

const cv = new Challenge();

world.events.worldInitialize.subscribe(worldInit);

function worldInit(event: WorldInitializeEvent) {
  cv.init(event.propertyRegistry);
}
