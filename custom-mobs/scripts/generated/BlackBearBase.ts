import EntityBase from "../framework/EntityBase";

export default class BlackBearBase extends EntityBase {
  anger() {
    this.triggerEvent("minecraft:on_anger");
  }

  babyCalm() {
    this.triggerEvent("baby_on_calm");
  }

  scared() {
    this.triggerEvent("minecraft:on_scared");
  }
}
