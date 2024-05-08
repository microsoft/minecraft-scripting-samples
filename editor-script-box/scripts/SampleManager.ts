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
    const messageId = scriptEvent.id.toLowerCase();

    if (messageId.startsWith("sample") && scriptEvent.sourceEntity) {
      const nearbyBlock = scriptEvent.sourceEntity.getBlockFromViewDirection();
      if (!nearbyBlock) {
        this.gamePlayLogger("Please look at the block where you want me to run this.");
        return;
      }

      const nearbyBlockLoc = nearbyBlock.block.location;
      const nearbyLoc = { x: nearbyBlockLoc.x, y: nearbyBlockLoc.y + 1, z: nearbyBlockLoc.z };

      if (messageId === "sample:run") {
        for (const sampleFuncKey in this._availableFuncs) {
          const sampleFunc = this._availableFuncs[sampleFuncKey];

          this.runSample(sampleFuncKey + this.tickCount, sampleFunc, {
            ...nearbyLoc,
            dimension: scriptEvent.sourceEntity.dimension,
          });

          return;
        }
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
          try {
            funcSet.func(this.gamePlayLogger, funcSet.location);
          } catch (e: any) {
            mc.world.sendMessage("Could not run sample function. Error: " + e.toString());
          }
        }
      }
    }
    if (this.tickCount === 200) {
      mc.world.sendMessage("Type '/scriptevent sample:run' in chat to run this sample.");
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
