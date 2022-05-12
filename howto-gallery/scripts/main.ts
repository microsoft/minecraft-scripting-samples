import SampleManager from "./SampleManager";
import * as mcsl from "./MinecraftSampleLibrary";
import * as mcgtsl from "./GameTestSampleLibrary";
import * as mcuisl from "./Minecraft-UISampleLibrary";

const sm = new SampleManager();

mcsl.register(sm);
mcgtsl.register(sm);
mcuisl.register(sm);
