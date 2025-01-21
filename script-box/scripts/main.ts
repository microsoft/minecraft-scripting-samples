import SampleManager from "./SampleManager";
import { scriptBox } from "./ScriptBox";

const sm = new SampleManager();

sm.registerSamples({
  scriptBox: [scriptBox],
});
