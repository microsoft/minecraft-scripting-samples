import SampleManager from "./SampleManager";

import * as sdf1 from "./EntitySpawnEvent";
import * as sdf2 from "./SpawnItem";
import * as sdf3 from "./CreateExplosion";
import * as sdf4 from "./CreateItemStacks";
import * as sdf5 from "./CreateMobs";
import * as sdf6 from "./PistonActivateEvent";
import * as sdf7 from "./SystemRun";
import * as sdf8 from "./Signs";
import * as sdf9 from "./Blocks";
import * as sdf10 from "./MusicAndSound";
import * as sdf11 from "./Scoreboard";
import * as sdf12 from "./Entities";
import * as sdf13 from "./Particles";
import * as sdf14 from "./EntityQuery";
import * as sdf15 from "./ScreenDisplay";
import * as sdf16 from "./SendMessage";
import * as sdf17 from "./BlockEvent";
import * as sdf18 from "./DynamicProperties";
import * as sdf19 from "./Equipment";
import { DimensionLocation } from "@minecraft/server";

const mojangMinecraftFuncs: {
  [name: string]: Array<(log: (message: string, status?: number) => void, location: DimensionLocation) => void>;
} = {
  logEntitySpawnEvent: [sdf1.logEntitySpawnEvent, sdf1.spawnAdultHorse],
  spawnAdultHorse: [sdf1.spawnAdultHorse],
  spawnFeatherItem: [sdf2.spawnFeatherItem],
  testThatEntityIsFeatherItem: [sdf2.spawnFeatherItem, sdf2.testThatEntityIsFeatherItem],
  createNoBlockExplosion: [sdf3.createNoBlockExplosion],
  createExplosions: [sdf3.createExplosions],
  createExplosion: [sdf3.createExplosion],
  itemStacks: [sdf4.itemStacks],
  quickFoxLazyDog: [sdf5.quickFoxLazyDog],
  pistonAfterEvent: [sdf6.pistonAfterEvent],
  trapTick: [sdf7.trapTick],
  every30Seconds: [sdf7.every30Seconds],
  addSign: [sdf8.addSign],
  addTwoSidedSign: [sdf8.addTwoSidedSign],
  addTranslatedSign: [sdf8.addTranslatedSign],
  addBlockColorCube: [sdf9.addBlockColorCube],
  playMusicAndSound: [sdf10.playMusicAndSound],
  updateScoreboard: [sdf11.updateScoreboard],
  triggerEvent: [sdf12.triggerEvent],
  applyImpulse: [sdf12.applyImpulse],
  getVelocity: [sdf12.getFireworkVelocity],
  applyDamageThenHeal: [sdf12.applyDamageThenHeal],
  setOnFire: [sdf12.setOnFire],
  teleport: [sdf12.teleport],
  teleportMovement: [sdf12.teleportMovement],
  spawnParticle: [sdf13.spawnParticle],
  bounceSkeletons: [sdf14.bounceSkeletons],
  tagsQuery: [sdf14.tagsQuery],
  setTitle: [sdf15.setTitle],
  setTitleAndSubtitle: [sdf15.setTitleAndSubtitle],
  countdown: [sdf15.countdown],
  sendBasicMessage: [sdf16.sendBasicMessage],
  sendTranslatedMessage: [sdf16.sendTranslatedMessage],
  buttonPushEvent: [sdf17.buttonPushEvent],
  leverActionEvent: [sdf17.leverActionEvent],
  tripWireTripEvent: [sdf17.tripWireTripEvent],
  incrementDynamicProperty: [sdf18.incrementDynamicProperty],
  incrementDynamicPropertyInJsonBlob: [sdf18.incrementDynamicPropertyInJsonBlob],
  givePlayerElytra: [sdf19.givePlayerElytra],
  givePlayerEquipment: [sdf19.givePlayerEquipment],
};

export function register(sampleManager: SampleManager) {
  sampleManager.registerSamples(mojangMinecraftFuncs);
}
