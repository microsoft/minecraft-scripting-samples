import SampleManager from "./SampleManager";
import * as serverSampleLibrary from "./ServerSampleLibrary";
import * as mcgtsl from "./Server-GameTestSampleLibrary";

const sm = new SampleManager();

serverSampleLibrary.register(sm);
mcgtsl.register(sm);
