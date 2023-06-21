import EntityFramework from "./EntityFramework";
import EntityItem from "./EntityItem";
import { Entity, EntityQueryOptions, Vector3 } from "@minecraft/server";

export default class EntityBase extends EntityItem {
  fx?: EntityFramework;

  id: string = "";
  typeId: string = "";
  lastSecond: number = 0;
  lastSecondLoc: Vector3 = { x: 0, y: 0, z: 0 };

  constructor() {
    super();

    this.notifySecondElapsed = this.notifySecondElapsed.bind(this);
  }

  init(id: string, typeId: string, fx: EntityFramework) {
    this.id = id;
    this.typeId = typeId;
    this.fx = fx;
    this.lastSecondLoc = { x: 0, y: 0, z: 0 };
    this.lastSecond = 0;
    this.onInit();
  }

  entities(options: EntityQueryOptions): EntityBase[] {
    if (!this.isValid || !this.entity || !this.fx) {
      console.warn("Object is not prepared.");
      return [];
    }

    options.location = this.entity.location;

    let entities = this.entity.dimension.getEntities(options);

    let entityResults: EntityBase[] = [];
    for (let ent of entities) {
      let eb = this.fx.ensureInstance(ent);

      if (eb) {
        eb.entity = ent;
        entityResults.push(eb);
      }
    }

    return entityResults;
  }

  nearbyPeers(maxDistance?: number, minDistance?: number): EntityBase[] {
    if (maxDistance === undefined) {
      maxDistance = 25;
    }

    if (minDistance === undefined) {
      minDistance = 0;
    }

    return this.entities({
      minDistance: minDistance,
      maxDistance: maxDistance,
      type: this.typeId,
    });
  }

  nearby(maxDistance?: number, minDistance?: number): EntityBase[] {
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

  nearbyOthers(maxDistance?: number, minDistance?: number): EntityBase[] {
    if (maxDistance === undefined) {
      maxDistance = 25;
    }

    if (minDistance === undefined) {
      minDistance = 0;
    }

    return this.entities({
      minDistance: minDistance,
      maxDistance: maxDistance,
      excludeTypes: [this.typeId],
    });
  }

  notifySecondElapsed() {
    let curDate = new Date().getTime();

    if (curDate > this.lastSecond + 949) {
      this.lastSecond = curDate;

      if (this.entity) {
        let loc: Vector3 | undefined = undefined;
        try {
          loc = this.entity.location;
        } catch (e) {
          this.invalidate();
        }

        if (loc) {
          if (Math.abs(loc.x - this.lastSecondLoc.x) >= 1 || Math.abs(loc.z - this.lastSecondLoc.z) >= 1) {
            this.lastSecondLoc = loc;
            this.didMoveBlock();
          }
        }
      }

      this.secondElapsed();
    }
  }

  secondElapsed() {}

  didMoveBlock() {}

  onInit() {}
  didSpawn() {}
  didHitEntity() {}
  didHurt() {}
  didDie() {}
}
