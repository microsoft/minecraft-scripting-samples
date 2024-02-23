// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as mc from "@minecraft/server";

export default class SampleManager {
  tickCount = 0;

  _availableFuncs: {
    [name: string]: Array<(log: (message: string, status?: number) => void, location: mc.Vector3) => void>;
  };

  pendingFuncs: Array<{
    name: string;
    func: (log: (message: string, status?: number) => void, location: mc.Vector3) => void;
    location: mc.Vector3;
  }> = [];

  gameplayLogger(message: string, status?: number) {
    if (status !== undefined && status > 0) {
      message = "SUCCESS: " + message;
    } else if (status !== undefined && status < 0) {
      message = "FAIL: " + message;
    }

    mc.world.sendMessage(message);
    console.warn(message);
  }

  newChatMessage(chatEvent: mc.ChatSendAfterEvent) {
    const message = chatEvent.message.toLowerCase();

    if ((message.startsWith("howto") || message.startsWith("help") || message.startsWith("run")) && chatEvent.sender) {
      const nearbyBlock = chatEvent.sender.getBlockFromViewDirection();
      if (!nearbyBlock) {
        this.gameplayLogger("Please look at the block where you want me to run this.");
        return;
      }

      const nearbyBlockLoc = nearbyBlock.block.location;
      const nearbyLoc = { x: nearbyBlockLoc.x, y: nearbyBlockLoc.y + 1, z: nearbyBlockLoc.z };
      let sampleId: string | undefined = undefined;

      let firstSpace = message.indexOf(" ");

      if (firstSpace > 0) {
        sampleId = message.substring(firstSpace + 1).trim();
      }

      if (!sampleId || sampleId.length < 2) {
        let availableFuncStr =
          "You can run a sample by typing `run <sample name>` in chat. Here is a list of available samples:";

        for (const sampleFuncKey in this._availableFuncs) {
          availableFuncStr += " " + sampleFuncKey;
        }

        mc.world.sendMessage(availableFuncStr);
      } else {
        for (const sampleFuncKey in this._availableFuncs) {
          if (sampleFuncKey.toLowerCase() === sampleId) {
            const sampleFunc = this._availableFuncs[sampleFuncKey];

            this.runSample(sampleFuncKey + this.tickCount, sampleFunc, nearbyLoc);

            return;
          }
        }

        mc.world.sendMessage(`I couldn't find the sample '${sampleId}'. Type help in chat to see a list of samples.`);
      }
    }
  }

  runSample(
    sampleId: string,
    snippetFunctions: Array<(log: (message: string, status?: number) => void, location: mc.Vector3) => void>,
    targetLocation: mc.Vector3
  ) {
    for (let i = snippetFunctions.length - 1; i >= 0; i--) {
      this.pendingFuncs.push({ name: sampleId, func: snippetFunctions[i], location: targetLocation });
    }
  }

  worldTick() {
    if (this.tickCount % 10 === 0) {
      if (this.pendingFuncs.length > 0) {
        const funcSet = this.pendingFuncs.pop();

        if (funcSet) {
          funcSet.func(this.gameplayLogger, funcSet.location);
        }
      }
    }

    this.tickCount++;

    mc.system.run(this.worldTick);
  }

  constructor() {
    this._availableFuncs = {};

    this.gameplayLogger = this.gameplayLogger.bind(this);

    this.worldTick = this.worldTick.bind(this);

    mc.world.afterEvents.chatSend.subscribe(this.newChatMessage.bind(this));

    mc.system.run(this.worldTick);
    mc.world.sendMessage("Type 'run <sample name>' in chat to run a sample, and type 'help' to see a list of samples.");
  }

  registerSamples(sampleSet: {
    [name: string]: Array<(log: (message: string, status?: number) => void, location: mc.Vector3) => void>;
  }) {
    for (const sampleKey in sampleSet) {
      if (sampleKey.length > 1 && sampleSet[sampleKey]) {
        this._availableFuncs[sampleKey] = sampleSet[sampleKey];
      }
    }
  }
}
