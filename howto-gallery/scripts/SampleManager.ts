import * as mc from "@minecraft/server";
import * as mcui from "@minecraft/server-ui";

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

      const nearbyBlockLoc = nearbyBlock.location;
      const nearbyLoc = { x: nearbyBlockLoc.x, y: nearbyBlockLoc.y + 1, z: nearbyBlockLoc.z };

      let sampleId: string | undefined = undefined;

      let firstSpace = message.indexOf(" ");

      if (firstSpace > 0) {
        sampleId = message.substring(firstSpace + 1).trim();
      }

      if (!sampleId || sampleId.length < 2) {
        let availableFuncStr = "Here is my list of available samples:";

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

        mc.world.sendMessage(`I couldn't find the sample '${sampleId}'`);
      }
    }
  }

  playerSpawn(playerSpawnEvent: mc.PlayerSpawnAfterEvent) {
    // @ts-ignore
    let locToProvision = playerSpawnEvent.player.getSpawnPoint()?.location;

    if (locToProvision === undefined) {
      // @ts-ignore
      locToProvision = mc.world.getDefaultSpawnLocation();
    }

    if (locToProvision.y > 32000) {
      locToProvision.y = playerSpawnEvent.player.location.y;
    }

    locToProvision = this.getGroundLocation({
      x: locToProvision.x - 10,
      y: locToProvision.y,
      z: locToProvision.z - 10,
    });

    this.runSample("provisionSampleBox", [this.provisionSampleBox], locToProvision);
  }

  getGroundLocation(seedLocation: mc.Vector3) {
    let dim = mc.world.getDimension("overworld");

    let curBlock = dim.getBlock(seedLocation);
    let curBlockAbove = dim.getBlock({ x: seedLocation.x, y: seedLocation.y + 1, z: seedLocation.z });

    if (curBlock === undefined || curBlockAbove === undefined) {
      return seedLocation;
    }
    // default is to look up.
    let adjuster = 1;

    // we're above ground, go down
    if (curBlock.isAir()) {
      adjuster = -1;
    }

    let blockSteps = 0;

    // keep looking until we're on the first ground block
    while (curBlock?.isAir() || (!curBlock.isAir() && !curBlockAbove.isAir() && blockSteps < 10)) {
      blockSteps++;

      seedLocation = { x: seedLocation.x, y: seedLocation.y + adjuster, z: seedLocation.z };

      curBlock = dim.getBlock(seedLocation);
      curBlockAbove = dim.getBlock({ x: seedLocation.x, y: seedLocation.y + 1, z: seedLocation.z });

      if (curBlock === undefined || curBlockAbove === undefined) {
        return seedLocation;
      }
    }

    seedLocation = { x: seedLocation.x, y: seedLocation.y + 1, z: seedLocation.z };

    return seedLocation;
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

  provisionSampleBox(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
    let overworld = mc.world.getDimension("overworld");
    // set up a button on cobblestone
    let cobblestone = overworld.getBlock(targetLocation);
    let button = overworld.getBlock({ x: targetLocation.x, y: targetLocation.y + 1, z: targetLocation.z });

    if (cobblestone === undefined || button === undefined) {
      log("Could not find block at location.");
      return -1;
    }

    cobblestone.setPermutation(mc.BlockPermutation.resolve("minecraft:quartz_block"));
    button.setPermutation(mc.BlockPermutation.resolve("acacia_button").withState("facing_direction", 1 /* up */));
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
    mc.world.afterEvents.playerSpawn.subscribe(this.playerSpawn.bind(this));

    mc.system.run(this.worldTick);

    mc.world.afterEvents.buttonPush.subscribe((buttonPushEvent: mc.ButtonPushAfterEvent) => {
      const players = mc.world.getPlayers();

      let blockBelow = mc.world.getDimension("overworld").getBlock({
        x: buttonPushEvent.block.location.x,
        y: buttonPushEvent.block.location.y - 1,
        z: buttonPushEvent.block.location.z,
      });

      if (blockBelow !== undefined && blockBelow.typeId === "minecraft:quartz_block" && players.length >= 1) {
        const form = new mcui.ActionFormData()
          .title("Samples")
          .body("Choose a sample!\n(or enter §orun <samplename>§r in chat)");

        for (const sampleName in this._availableFuncs) {
          form.button(sampleName);
        }

        form.show(players[0]).then((response: mcui.ActionFormResponse) => {
          let funcCount = 0;

          for (const sampleName in this._availableFuncs) {
            if (funcCount === response.selection) {
              this.runSample(sampleName, this._availableFuncs[sampleName], players[0].location);
              return;
            }

            funcCount++;
          }
        });
      }
    });
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
