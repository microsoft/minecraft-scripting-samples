import { Vector3 } from "@minecraft/server";

export default class Track {
  from: Vector3;
  to: Vector3;
  facingAdjust: Vector3;
  constructor(newFrom: Vector3, newTo: Vector3, newFacingAdjust: Vector3) {
    this.from = newFrom;
    this.to = newTo;
    this.facingAdjust = newFacingAdjust;
  }
}
