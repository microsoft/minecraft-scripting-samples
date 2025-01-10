import SampleManager from "./SampleManager";
import * as serverSampleLibrary from "./ServerSampleLibrary";
import * as serverUISampleLibrary from "./Server-UISampleLibrary";

const sm = new SampleManager();

serverSampleLibrary.register(sm);
serverUISampleLibrary.register(sm);
