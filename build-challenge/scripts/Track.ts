// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Vector } from "@minecraft/server";

export default class Track {
  from: Vector;
  to: Vector;
  facingAdjust: Vector;
  constructor(newFrom: Vector, newTo: Vector, newFacingAdjust: Vector) {
    this.from = newFrom;
    this.to = newTo;
    this.facingAdjust = newFacingAdjust;
  }
}
