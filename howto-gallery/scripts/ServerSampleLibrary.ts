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
import * as sdf20 from "./Containers";
import * as sdf21 from "./Effects";
import * as sdf22 from "./Items";
import * as sdf23 from "./Players";
import { DimensionLocation } from "@minecraft/server";

const mojangMinecraftFuncs: {
  [name: string]: Array<(log: (message: string, status?: number) => void, location: DimensionLocation) => void>;
} = {
  logEntitySpawnEvent: [sdf1.logEntitySpawnEvent],
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
  cubeGenerator: [sdf7.cubeGenerator],
  addSign: [sdf8.addSign],
  updateSignText: [sdf8.updateSignText],
  addTwoSidedSign: [sdf8.addTwoSidedSign],
  addTranslatedSign: [sdf8.addTranslatedSign],
  addBlockColorCube: [sdf9.addBlockColorCube],
  checkBlockTags: [sdf9.checkBlockTags],
  playMusicAndSound: [sdf10.playMusicAndSound],
  updateScoreboard: [sdf11.updateScoreboard],
  triggerEvent: [sdf12.triggerEvent],
  applyImpulse: [sdf12.applyImpulse],
  getVelocity: [sdf12.getFireworkVelocity],
  shootArrow: [sdf12.shootArrow],
  blockConditional: [sdf12.blockConditional],
  findEntitiesHavingPropertyEqualsTo: [sdf12.findEntitiesHavingPropertyEqualsTo],
  playSoundChained: [sdf12.playSoundChained],
  setScoreboardChained: [sdf12.setScoreboardChained],
  summonMobChained: [sdf12.summonMobChained],
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
  nestedTranslation: [sdf16.nestedTranslation],
  buttonPushEvent: [sdf17.buttonPushEvent],
  leverActionEvent: [sdf17.leverActionEvent],
  tripWireTripEvent: [sdf17.tripWireTripEvent],
  incrementDynamicProperty: [sdf18.incrementDynamicProperty],
  incrementDynamicPropertyInJsonBlob: [sdf18.incrementDynamicPropertyInJsonBlob],
  givePlayerElytra: [sdf19.givePlayerElytra],
  givePlayerEquipment: [sdf19.givePlayerEquipment],
  containers: [sdf20.containers],
  placeItemsInChest: [sdf20.placeItemsInChest],
  spawnPoisonedVillager: [sdf21.spawnPoisonedVillager],
  giveDestroyRestrictedPickaxe: [sdf22.giveDestroyRestrictedPickaxe],
  giveHurtDiamondSword: [sdf22.giveHurtDiamondSword],
  givePlaceRestrictedGoldBlock: [sdf22.givePlaceRestrictedGoldBlock],
  diamondAwesomeSword: [sdf22.diamondAwesomeSword],
  getFirstHotbarItem: [sdf22.getFirstHotbarItem],
  moveBetweenContainers: [sdf22.moveBetweenContainers],
  swapBetweenContainers: [sdf22.swapBetweenContainers],
  transferBetweenContainers: [sdf22.transferBetweenContainers],
  sendPlayerMessages: [sdf23.sendPlayerMessages],
};

export function register(sampleManager: SampleManager) {
  sampleManager.registerSamples(mojangMinecraftFuncs);
}
