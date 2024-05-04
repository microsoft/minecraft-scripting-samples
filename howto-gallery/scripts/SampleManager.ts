import * as mc from "@minecraft/server";

export default class SampleManager {
  tickCount = 0;

  _availableFuncs: {
    [name: string]: Array<(log: (message: string, status?: number) => void, location: mc.DimensionLocation) => void>;
  };

  pendingFuncs: Array<{
    name: string;
    func: (log: (message: string, status?: number) => void, location: mc.DimensionLocation) => void;
    location: mc.DimensionLocation;
  }> = [];

  gamePlayLogger(message: string, status?: number) {
    if (status !== undefined && status > 0) {
      message = "SUCCESS: " + message;
    } else if (status !== undefined && status < 0) {
      message = "FAIL: " + message;
    }

    mc.world.sendMessage(message);
    console.warn(message);
  }

  newScriptEvent(scriptEvent: mc.ScriptEventCommandMessageAfterEvent) {
    const message = scriptEvent.message.toLowerCase();

    if (
      (message.startsWith("howto") || message.startsWith("help") || message.startsWith("run")) &&
      scriptEvent.sourceEntity
    ) {
      const nearbyBlock = scriptEvent.sourceEntity.getBlockFromViewDirection();
      if (!nearbyBlock) {
        this.gamePlayLogger("Please look at the block where you want me to run this.");
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

            this.runSample(sampleFuncKey + this.tickCount, sampleFunc, {
              ...nearbyLoc,
              dimension: scriptEvent.sourceEntity.dimension,
            });

            return;
          }
        }

        mc.world.sendMessage(`I couldn't find the sample '${sampleId}'. Type help in chat to see a list of samples.`);
      }
    }
  }

  runSample(
    sampleId: string,
    snippetFunctions: Array<(log: (message: string, status?: number) => void, location: mc.DimensionLocation) => void>,
    targetLocation: mc.DimensionLocation
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
          funcSet.func(this.gamePlayLogger, funcSet.location);
        }
      }
    }

    this.tickCount++;

    mc.system.run(this.worldTick);
  }

  constructor() {
    this._availableFuncs = {};

    this.gamePlayLogger = this.gamePlayLogger.bind(this);

    this.worldTick = this.worldTick.bind(this);

    mc.system.afterEvents.scriptEventReceive.subscribe(this.newScriptEvent.bind(this));

    mc.system.run(this.worldTick);
    mc.world.sendMessage("Type 'run <sample name>' in chat to run a sample, and type 'help' to see a list of samples.");
  }

  registerSamples(sampleSet: {
    [name: string]: Array<(log: (message: string, status?: number) => void, location: mc.DimensionLocation) => void>;
  }) {
    for (const sampleKey in sampleSet) {
      if (sampleKey.length > 1 && sampleSet[sampleKey]) {
        this._availableFuncs[sampleKey] = sampleSet[sampleKey];
      }
    }
  }
}
