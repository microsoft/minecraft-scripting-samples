import { registerFarmGeneratorExtension } from "./FarmGenerator";
import SampleManager from "./SampleManager";
import * as serverSampleLibrary from "./ServerEditorSampleLibrary";

const sm = new SampleManager();

serverSampleLibrary.register(sm);

registerFarmGeneratorExtension();
