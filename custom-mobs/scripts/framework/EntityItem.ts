import { EffectType, Entity } from "@minecraft/server";

export default class EntityItem {
  _entity?: Entity;
  _isNotValid?: boolean;

  get entity() {
    return this._entity;
  }

  set entity(newEntity: Entity | undefined) {
    this._entity = newEntity;
    this._isNotValid = undefined;
  }

  triggerEvent(eventName: string) {
    if (this.isValid && this._entity) {
      try {
        this._entity.triggerEvent(eventName);
      } catch (e) {
        this._isNotValid = true;
      }
    }
  }

  invalidate() {
    this._isNotValid = true;
  }

  hasTag(tag: string) {
    return this._entity?.hasTag(tag);
  }

  addTag(tag: string) {
    return this._entity?.addTag(tag);
  }

  getEffect(effectType: EffectType) {
    return this._entity?.getEffect(effectType);
  }

  addEffect(effectType: EffectType, duration: number, amplifier?: number, showParticles?: boolean) {
    this._entity?.addEffect(effectType, duration, { amplifier: amplifier, showParticles: showParticles });
  }

  removeTag(tag: string) {
    return this._entity?.removeTag(tag);
  }

  spawned() {
    this.triggerEvent("entity_spawned");
  }

  get isValid() {
    return this._entity && !this._isNotValid;
  }
}
