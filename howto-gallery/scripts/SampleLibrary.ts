import * as mc from "mojang-minecraft";

import * as ece from "./EntityCreatedEvent";
import * as spawnItem from "./SpawnItem";

let tickCount = 0;

const pendingFuncs: {
  name: string;
  func: (log: (message: string, status?: number) => void, location: mc.Location) => void;
  location: mc.Location;
}[] = [];

const sampleFuncs: {
  [name: string]: ((log: (message: string, status?: number) => void, location: mc.Location) => void)[];
} = {
  runEntityCreatedEvent: [ece.runEntityCreatedEvent, ece.createOldHorse, ece.unsubscribeEntityCreatedEvent],
  createOldHorse: [ece.createOldHorse],
  spawnItem: [spawnItem.spawnItem, spawnItem.testThatEntityIsFeatherItem],
};

function gameplayLogger(message: string, status?: number) {
  if (status !== undefined && status > 0) {
    message = "SUCCESS: " + message;
  } else if (status !== undefined && status < 0) {
    message = "FAIL: " + message;
  }

  say(message);
  console.warn(message);
}

function say(message: string) {
  mc.world.getDimension("overworld").runCommand("say " + message);
}

function newChatMessage(chatEvent: mc.ChatEvent) {
  let message = chatEvent.message.toLowerCase();

  if (message.startsWith("howto ") && chatEvent.sender) {
    const nearbyBlock = chatEvent.sender.getBlockFromViewVector();
    if (!nearbyBlock) {
      gameplayLogger("Please look at the block where you want me to run this.");
    }

    const nearbyBlockLoc = nearbyBlock.location;
    const nearbyLoc = new mc.Location(nearbyBlockLoc.x, nearbyBlockLoc.y, nearbyBlockLoc.z);

    const sampleId = message.substring(6);

    for (const sampleFuncKey in sampleFuncs) {
      if (sampleFuncKey.toLowerCase() === sampleId) {
        let foo = sampleFuncs[sampleFuncKey];

        runSample(sampleFuncKey + tickCount, foo, nearbyLoc);

        return;
      }
    }

    console.warn("I couldn't find the sample '" + sampleId + "'");
  }
}

function runSample(
  sampleId: string,
  snippetFunctions: ((log: (message: string, status?: number) => void, location: mc.Location) => void)[],
  targetLocation: mc.Location
) {
  for (let i = snippetFunctions.length - 1; i >= 0; i--) {
    pendingFuncs.push({ name: sampleId, func: snippetFunctions[i], location: targetLocation });
  }
}

function worldTick() {
  if (tickCount % 10 === 0) {
    if (pendingFuncs.length > 0) {
      let funcSet = pendingFuncs.pop();

      if (funcSet) {
        funcSet.func(gameplayLogger, funcSet.location);
      }
    }
  }

  tickCount++;
}

export function registerSampleLibrary() {
  mc.world.events.tick.subscribe(worldTick);
  mc.world.events.chat.subscribe(newChatMessage);
}
