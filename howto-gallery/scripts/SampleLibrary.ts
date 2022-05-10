import * as mc from "mojang-minecraft";

import * as sdf1 from "./EntityCreatedEvent";
import * as sdf2 from "./SpawnItem";
import * as sdf3 from "./CreateExplosion";
import * as sdf4 from "./CreateItemStacks";
import * as sdf5 from "./CreateMobs";
import * as sdf6 from "./PistonActivateEvent";
import * as sdf7 from "./TickEvent";

const mojangMinecraftFuncs: {
  [name: string]: ((log: (message: string, status?: number) => void, location: mc.Location) => void)[];
} = {
  runEntityCreatedEvent: [sdf1.runEntityCreatedEvent, sdf1.createOldHorse, sdf1.unsubscribeEntityCreatedEvent],
  createOldHorse: [sdf1.createOldHorse],
  spawnItem: [sdf2.spawnItem, sdf2.testThatEntityIsFeatherItem],
  createNoBlockExplosion: [sdf3.createExplosion],
  createFireAndWaterExplosions: [sdf3.createFireAndWaterExplosions],
  createExplosion: [sdf3.createExplosion],
  itemStacks: [sdf4.itemStacks],
  quickFoxLazyDog: [sdf5.quickFoxLazyDog],
  pistonEvent: [sdf6.pistonEvent],
  trapTick: [sdf7.trapTick],
};

let tickCount = 0;

const pendingFuncs: {
  name: string;
  func: (log: (message: string, status?: number) => void, location: mc.Location) => void;
  location: mc.Location;
}[] = [];

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
    const nearbyLoc = new mc.Location(nearbyBlockLoc.x, nearbyBlockLoc.y + 1, nearbyBlockLoc.z);

    const sampleId = message.substring(6);

    for (const sampleFuncKey in mojangMinecraftFuncs) {
      if (sampleFuncKey.toLowerCase() === sampleId) {
        let foo = mojangMinecraftFuncs[sampleFuncKey];

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
