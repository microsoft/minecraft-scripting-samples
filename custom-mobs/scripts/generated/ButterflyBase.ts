import EntityBase from "../framework/EntityBase";

export default class ButterflyBase extends EntityBase {
  // generated based on discovering the event named hive_destroyed.
  hiveDestroyed() {
    this.triggerEvent("hive_destroyed");
  }

  // generated based on discovering the event named stop_panicking_after_fire.
  stopPanickingAfterFire() {
    this.triggerEvent("stop_panicking_after_fire");
  }

  findHiveTimeout() {
    this.triggerEvent("find_hive_timeout");
  }

  perishEvent() {
    this.triggerEvent("perish_event");
  }
}
