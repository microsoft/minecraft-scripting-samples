import SampleManager from "./SampleManager";
import * as serverSampleLibrary from "./ServerSampleLibrary";
import * as serverUISampleLibrary from "./Server-UISampleLibrary";
import { world } from "@minecraft/server";

const sm = new SampleManager();

world.afterEvents.worldLoad.subscribe(() => {
  serverSampleLibrary.register(sm);
  serverUISampleLibrary.register(sm);
});