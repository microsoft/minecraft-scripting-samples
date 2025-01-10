import { DimensionLocation, Player, ScriptEventCommandMessageAfterEvent, system, world } from "@minecraft/server";
import { ActionFormData, ActionFormResponse } from "@minecraft/server-ui";

export default class SampleManager {
  tickCount = 0;

  _availableFuncs: {
    [name: string]: Array<(log: (message: string, status?: number) => void, location: DimensionLocation) => void>;
  };

  pendingFuncs: Array<{
    name: string;
    func: (log: (message: string, status?: number) => void, location: DimensionLocation) => void;
    location: DimensionLocation;
  }> = [];

  gamePlayLogger(message: string, status?: number) {
    if (status !== undefined && status > 0) {
      message = "SUCCESS: " + message;
    } else if (status !== undefined && status < 0) {
      message = "FAIL: " + message;
    }

    world.sendMessage(message);
    console.warn(message);
  }

  newScriptEvent(scriptEvent: ScriptEventCommandMessageAfterEvent) {
    const messageId = scriptEvent.id.toLowerCase();

    if (messageId.startsWith("htb") && scriptEvent.sourceEntity) {
      const nearbyBlock = scriptEvent.sourceEntity.getBlockFromViewDirection();
      if (!nearbyBlock) {
        this.gamePlayLogger("Please look at the block where you want me to run this.");
        return;
      }

      const nearbyBlockLoc = nearbyBlock.block.location;
      const nearbyLoc = { x: nearbyBlockLoc.x, y: nearbyBlockLoc.y + 1, z: nearbyBlockLoc.z };
      const sampName = scriptEvent.message.toLowerCase();

      if (messageId === "htb:run") {
        for (const sampleFuncKey in this._availableFuncs) {
          if (sampleFuncKey.toLowerCase() === sampName) {
            const sampleFunc = this._availableFuncs[sampleFuncKey];

            this.runSample(sampleFuncKey + this.tickCount, sampleFunc, {
              ...nearbyLoc,
              dimension: scriptEvent.sourceEntity.dimension,
            });

            return;
          }
        }

        const form = new ActionFormData().title("Samples").body("Choose the sample to run");

        for (const sampleFuncKey in this._availableFuncs) {
          form.button(sampleFuncKey);
        }

        form.show(scriptEvent.sourceEntity as Player).then((response: ActionFormResponse) => {
          if (!response.canceled && response.selection !== undefined && scriptEvent.sourceEntity) {
            let index = 0;
            for (const sampleFuncKey in this._availableFuncs) {
              if (index === response.selection) {
                const sampleFunc = this._availableFuncs[sampleFuncKey];

                this.runSample(sampleFuncKey + this.tickCount, sampleFunc, {
                  ...nearbyLoc,
                  dimension: scriptEvent.sourceEntity.dimension,
                });

                return;
              }
              index++;
            }
          }
        });
      } else {
        world.sendMessage(
          "You can run a sample by typing `/scriptevent htb:run <sample name>` in chat. Here is a list of available samples:"
        );
        let availableFuncStr = "";

        for (const sampleFuncKey in this._availableFuncs) {
          availableFuncStr += " " + sampleFuncKey;
        }

        world.sendMessage(availableFuncStr);
      }
    }
  }

  runSample(
    sampleId: string,
    snippetFunctions: Array<(log: (message: string, status?: number) => void, location: DimensionLocation) => void>,
    targetLocation: DimensionLocation
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
            world.sendMessage("Could not run sample function. Error: " + e.toString());
          }
        }
      }
    }
    if (this.tickCount === 200) {
      world.sendMessage(
        "Type '/scriptevent htb:run <sample name>' in chat to run a sample, and type 'help' to see a list of samples."
      );
    }

    this.tickCount++;

    system.run(this.worldTick);
  }

  constructor() {
    this._availableFuncs = {};

    this.gamePlayLogger = this.gamePlayLogger.bind(this);

    this.worldTick = this.worldTick.bind(this);

    system.afterEvents.scriptEventReceive.subscribe(this.newScriptEvent.bind(this));

    system.run(this.worldTick);
  }

  registerSamples(sampleSet: {
    [name: string]: Array<(log: (message: string, status?: number) => void, location: DimensionLocation) => void>;
  }) {
    for (const sampleKey in sampleSet) {
      if (sampleKey.length > 1 && sampleSet[sampleKey]) {
        this._availableFuncs[sampleKey] = sampleSet[sampleKey];
      }
    }
  }
}
