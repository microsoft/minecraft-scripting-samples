// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import SampleManager from "./SampleManager";
import * as sb from "./ScriptBox";

const sm = new SampleManager();

sm.registerSamples({
  scriptBox: [sb.scriptBox],
});
