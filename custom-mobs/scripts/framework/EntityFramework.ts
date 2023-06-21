import {
  world,
  system,
  EntitySpawnAfterEvent,
  Entity,
  EntityHitEntityAfterEvent,
  EntityHurtAfterEvent,
  EntityDieAfterEvent,
} from "@minecraft/server";
import EntityBase from "./EntityBase";

export default class EntityFramework {
  tickIndex = 0;
  types: { [name: string]: typeof EntityBase } = {};
  instances: { [entityId: string]: EntityBase } = {};
  instanceList: EntityBase[] = [];

  constructor() {
    this.tick = this.tick.bind(this);
    this.entitySpawn = this.entitySpawn.bind(this);
    this.entityDie = this.entityDie.bind(this);
    this.entityHurt = this.entityHurt.bind(this);
    this.entityHit = this.entityHit.bind(this);
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

      let mod = this.tickIndex % 20;

      for (let i = mod; i < this.instanceList.length; i += 20) {
        this.instanceList[i].notifySecondElapsed();
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
  }

  ensureInstance(entity: Entity) {
    if (!entity.isValid()) {
      return undefined;
    }

    let instance = this.ensureInstanceFromId(entity.id, entity.typeId);

    if (instance) {
      instance.entity = entity;
    }

    return instance;
  }

  ensureInstanceFromId(id: string, typeId: string) {
    let instance = this.instances[id];

    if (!instance) {
      let baseType = this.types[EntityFramework.canonicalizeId(typeId)];

      if (!baseType) {
        baseType = EntityBase;
      }

      instance = new baseType();

      if (instance) {
        instance.init(id, typeId, this);

        this.instances[id] = instance;
        this.instanceList.push(instance);
      }
    }

    return instance;
  }

  entitySpawn(spawnEvent: EntitySpawnAfterEvent) {
    let inst = this.ensureInstance(spawnEvent.entity);

    if (inst === undefined) {
      return;
    }

    inst.entity = spawnEvent.entity;
    inst.didSpawn();
  }

  entityHit(hitEvent: EntityHitEntityAfterEvent) {
    let inst = this.ensureInstance(hitEvent.damagingEntity);

    if (inst === undefined) {
      return;
    }

    inst.entity = hitEvent.damagingEntity;
    inst.didHitEntity();
  }

  entityHurt(hurtEvent: EntityHurtAfterEvent) {
    let inst = this.ensureInstance(hurtEvent.hurtEntity);

    if (inst === undefined) {
      return;
    }

    inst.entity = hurtEvent.hurtEntity;
    inst.didHurt();
  }

  entityDie(dieEntity: EntityDieAfterEvent) {
    let inst = this.ensureInstance(dieEntity.deadEntity);

    if (inst === undefined) {
      return;
    }

    inst.didDie();
  }

  registerType<T extends typeof EntityBase>(minecraftEntityTypeId: string, type: T) {
    this.types[EntityFramework.canonicalizeId(minecraftEntityTypeId)] = type;
  }
}

const fx = new EntityFramework();

export function initEntityFramework() {
  fx.init();
}

export function registerEntityType<T extends typeof EntityBase>(minecraftEntityTypeId: string, type: T) {
  fx.registerType(minecraftEntityTypeId, type);
}
