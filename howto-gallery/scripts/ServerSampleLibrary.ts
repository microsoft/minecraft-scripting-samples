import * as mc from "@minecraft/server";
import SampleManager from "./SampleManager";

import * as sdf1 from "./EntityCreatedEvent";
import * as sdf2 from "./SpawnItem";
import * as sdf3 from "./CreateExplosion";
import * as sdf4 from "./CreateItemStacks";
import * as sdf5 from "./CreateMobs";
import * as sdf6 from "./PistonActivateEvent";
import * as sdf7 from "./TickEvent";

const mojangMinecraftFuncs: {
  [name: string]: Array<(log: (message: string, status?: number) => void, location: mc.Location) => void>;
} = {
  runEntityCreatedEvent: [sdf1.runEntityCreatedEvent, sdf1.createOldHorse],
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

export function register(sampleManager: SampleManager) {
  sampleManager.registerSamples(mojangMinecraftFuncs);
}
