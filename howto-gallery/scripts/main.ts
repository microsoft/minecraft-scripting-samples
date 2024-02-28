import SampleManager from "./SampleManager";
import * as mcsl from "./ServerSampleLibrary";
import * as mcgtsl from "./Server-GameTestSampleLibrary";
import * as mcuisl from "./Server-UISampleLibrary";

const sm = new SampleManager();

mcsl.register(sm);
mcgtsl.register(sm);
mcuisl.register(sm);
