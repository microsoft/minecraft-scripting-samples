import {
  world,
  system,
  EntitySpawnAfterEvent,
  Entity,
  EntityHitEntityAfterEvent,
  EntityHurtAfterEvent,
  EntityDieAfterEvent,
  DataDrivenEntityTriggerAfterEvent,
  WorldInitializeAfterEvent,
  DynamicPropertiesDefinition,
  EntityType,
  EntityTypes,
} from "@minecraft/server";
import ScriptComponent from "./ScriptComponent";

export default class ScriptComponentFramework {
  tickIndex = 0;
  types: { [name: string]: typeof ScriptComponent } = {};
  componentsByEntity: { [entityId: string]: { [componentId: string]: ScriptComponent } } = {};
  entityTypes: string[] = [];

  activeComponentGroupsByEntity: { [entityId: string]: string[] } = {};

  constructor() {
    this.tick = this.tick.bind(this);

    this.worldInitialize = this.worldInitialize.bind(this);
    this.entitySpawn = this.entitySpawn.bind(this);
    this.entityDie = this.entityDie.bind(this);
    this.entityHurt = this.entityHurt.bind(this);
    this.entityHit = this.entityHit.bind(this);
    this.entityTriggerEvent = this.entityTriggerEvent.bind(this);
  }

  static canonicalizeId(id: string) {
    return id; //.replace(/:/gi, "_");
  }

  tick() {
    try {
      this.tickIndex++;

      if (this.tickIndex === 100) {
        world.getDimension("overworld").runCommandAsync("say Entity Framework initialized!");
      }
    } catch (e) {
      console.warn("Script error: " + e);
    }

    system.run(this.tick);
  }

  init() {
    system.run(this.tick);

    world.afterEvents.entitySpawn.subscribe(this.entitySpawn);
    world.afterEvents.entityDie.subscribe(this.entityDie);
    world.afterEvents.entityHitEntity.subscribe(this.entityHit);
    world.afterEvents.entityHurt.subscribe(this.entityHurt);
    world.afterEvents.worldInitialize.subscribe(this.worldInitialize);
    world.afterEvents.dataDrivenEntityTriggerEvent.subscribe(this.entityTriggerEvent);
  }

  worldInitialize(initEvent: WorldInitializeAfterEvent) {
    for (let etId in this.entityTypes) {
      let et = EntityTypes.get(etId);

      if (et) {
        let def = new DynamicPropertiesDefinition();

        def.defineString("bif:activeComponentGroups", 256);

        initEvent.propertyRegistry.registerEntityTypeDynamicProperties(def, et);
      }
    }
  }

  ensureScriptComponent(entity: Entity, componentId: string) {
    let comp = this.ensureScriptComponentFromId(entity.id, entity.typeId, componentId);

    if (comp) {
      comp.entity = entity;
    }

    return comp;
  }

  ensureScriptComponentFromId(id: string, typeId: string, componentId: string) {
    let entityComponents = this.ensureEntityComponents(id);

    componentId = ScriptComponentFramework.canonicalizeId(componentId);

    let scriptComponent = entityComponents[componentId];

    if (!scriptComponent) {
      let baseType = this.types[componentId];

      if (baseType) {
        scriptComponent = Object.create(baseType.prototype);

        if (scriptComponent) {
          scriptComponent.init(id, typeId, this);

          entityComponents[componentId] = scriptComponent;
        }
      }
    }

    return scriptComponent;
  }

  entityTriggerEvent(triggerEvent: DataDrivenEntityTriggerAfterEvent) {
    if (!triggerEvent.entity.isValid()) {
      return;
    }

    let entityId = triggerEvent.entity.id;
    let entityTypeId = triggerEvent.entity.typeId;

    if (!this.hasEntityType(entityTypeId)) {
      return;
    }

    let scriptComponents = this.activeComponentGroupsByEntity[entityId];

    if (scriptComponents === undefined) {
      scriptComponents = [];
    }

    let componentArr: { [name: string]: boolean } = {};

    for (let comp in scriptComponents) {
      componentArr[comp] = true;
    }

    let mods = triggerEvent.getModifiers();

    for (const mod of mods) {
      let adders = mod.getComponentGroupsToAdd();

      for (const adder of adders) {
        if (!adder.startsWith("minecraft:") && !componentArr[adder]) {
          componentArr[adder] = true;
          let instance = this.ensureScriptComponent(triggerEvent.entity, adder);

          if (instance && !instance.active) {
            instance.active = true;
            instance.onActivate();
          }
        }
      }

      let removers = mod.getComponentGroupsToRemove();

      for (const remover of removers) {
        if (!remover.startsWith("minecraft:") && componentArr[remover] === true) {
          componentArr[remover] = false;
          let instance = this.ensureScriptComponent(triggerEvent.entity, remover);

          if (instance && instance.active) {
            instance.active = false;
            instance.onDeactivate();
          }
        }
      }
    }

    scriptComponents = [];
    let scriptComponentList = "";

    for (let compId in componentArr) {
      // don't mess with core minecraft: components, avoid storing their state.
      if (!compId.startsWith("minecraft:") && componentArr[compId] === true) {
        scriptComponents.push(compId);
        scriptComponentList += compId + "|";
      }
    }

    if (scriptComponentList.length < 256 && this.hasEntityType(triggerEvent.entity.id)) {
      // I believe activeComponentGroups is readily available per actor from the core of MC, but since there are no script APIs for that,
      // we'll (imperfectly) track it through dynamic properties as a workaround.
      triggerEvent.entity.setDynamicProperty("bif:activeComponentGroups", scriptComponentList);
    }

    this.activeComponentGroupsByEntity[entityId] = scriptComponents;
  }

  loadEntityComponents(entity: Entity) {
    if (this.hasEntityType(entity.id)) {
      let cgs = entity.getDynamicProperty("bif:activeComponentGroups");

      if (cgs && typeof cgs === "string") {
        let cgList = cgs.split("|");

        for (let cg of cgList) {
          let instance = this.ensureScriptComponent(entity, cg);

          if (instance && !instance.active) {
            instance.active = true;
            instance.onActivate();
          }
        }
      }
    }
  }

  ensureEntityComponents(entityId: string) {
    let entityComponents = this.componentsByEntity[entityId];

    if (entityComponents === undefined) {
      entityComponents = {};
      this.componentsByEntity[entityId] = entityComponents;
    }

    return entityComponents;
  }

  entitySpawn(spawnEvent: EntitySpawnAfterEvent) {
    if (!spawnEvent.entity.isValid()) {
      return;
    }

    let id = spawnEvent.entity.id;

    this.loadEntityComponents(spawnEvent.entity);

    let entityComponents = this.ensureEntityComponents(id);

    for (let typeId in this.componentsByEntity) {
      let comp = entityComponents[typeId];

      if (comp && comp.active) {
        comp.entity = spawnEvent.entity;
        comp.entityDidSpawn();
      }
    }
  }

  entityHit(hitEvent: EntityHitEntityAfterEvent) {
    let id = hitEvent.damagingEntity.id;

    let entityComponents = this.ensureEntityComponents(id);

    for (let typeId in this.componentsByEntity) {
      let comp = entityComponents[typeId];

      if (comp && comp.active) {
        comp.entity = hitEvent.damagingEntity;
        comp.entityDidHitEntity();
      }
    }
  }

  entityHurt(hurtEvent: EntityHurtAfterEvent) {
    let id = hurtEvent.hurtEntity.id;

    let entityComponents = this.ensureEntityComponents(id);

    for (let typeId in this.componentsByEntity) {
      let comp = entityComponents[typeId];

      if (comp && comp.active) {
        comp.entity = hurtEvent.hurtEntity;
        comp.entityDidHurt();
      }
    }
  }

  entityDie(dieEvent: EntityDieAfterEvent) {
    if (!dieEvent.deadEntity) {
      return;
    }
    if (!dieEvent.deadEntity.isValid()) {
      return;
    }

    let id = dieEvent.deadEntity.id;

    let entityComponents = this.ensureEntityComponents(id);

    for (let compId in this.componentsByEntity) {
      let comp = entityComponents[compId];

      if (comp && comp.active) {
        comp.entity = dieEvent.deadEntity;
        comp.entityDidDie();
      }
    }
  }

  registerType<T extends typeof ScriptComponent>(componentId: string, type: T, supportOnEntityTypes: string[]) {
    this.types[ScriptComponentFramework.canonicalizeId(componentId)] = type;

    for (const et of supportOnEntityTypes) {
      if (!this.hasEntityType(et)) {
        this.entityTypes.push(et);
      }
    }
  }

  hasEntityType(entityType: string) {
    for (const et of this.entityTypes) {
      if (et === entityType) {
        return true;
      }
    }

    return false;
  }
}

const fx = new ScriptComponentFramework();

export function initScriptComponentFramework() {
  fx.init();
}

export function registerScriptComponentForTypes<T extends typeof ScriptComponent>(
  componentId: string,
  type: T,
  entityTypes: string[]
) {
  fx.registerType(componentId, type, entityTypes);
}
