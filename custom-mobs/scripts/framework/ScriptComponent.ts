import { Entity, EntityQueryOptions } from "@minecraft/server";
import EntityBase from "./EntityBase";
import EntityItem from "./EntityItem";
import ScriptComponentFramework from "./ScriptComponentFramework";

export default class ScriptComponent extends EntityItem {
  #entity?: Entity;
  fx?: ScriptComponentFramework;

  active: boolean = false;

  id: string = "";
  componentId: string = "";

  init(id: string, componentId: string, fx: ScriptComponentFramework) {
    this.id = id;
    this.componentId = componentId;
    this.fx = fx;

    this.onInit();
  }

  entities(options: EntityQueryOptions): ScriptComponent[] {
    if (!this.isValid || !this.#entity || !this.fx) {
      console.warn("Object is not prepared.");
      return [];
    }

    options.location = this.#entity.location;

    let entities = this.#entity.dimension.getEntities(options);

    let entityResults: ScriptComponent[] = [];
    for (let ent of entities) {
      let eb = this.fx.ensureScriptComponent(ent, this.componentId);

      if (eb) {
        eb.#entity = ent;
        entityResults.push(eb);
      }
    }

    return entityResults;
  }

  nearbyPeers(maxDistance?: number, minDistance?: number): ScriptComponent[] {
    if (!this.#entity) {
      return [];
    }

    if (maxDistance === undefined) {
      maxDistance = 25;
    }

    if (minDistance === undefined) {
      minDistance = 0;
    }

    return this.entities({
      minDistance: minDistance,
      maxDistance: maxDistance,
      type: this.#entity.typeId,
    });
  }

  nearby(maxDistance?: number, minDistance?: number): ScriptComponent[] {
    if (!this.#entity) {
      return [];
    }

    if (maxDistance === undefined) {
      maxDistance = 25;
    }

    if (minDistance === undefined) {
      minDistance = 0;
    }

    return this.entities({
      minDistance: minDistance,
      maxDistance: maxDistance,
    });
  }

  onActivate() {}
  onDeactivate() {}

  onInit() {}

  entityDidSpawn() {}
  entityDidHitEntity() {}
  entityDidHurt() {}
  entityDidDie() {}
}
