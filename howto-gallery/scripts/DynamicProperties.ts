import { DimensionLocation, world } from "@minecraft/server";

/**
 * Increments a dynamic numeric persisted property.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/world#getDynamicProperty
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/world#setDynamicProperty
 */
export function incrementDynamicProperty(
  log: (message: string, status?: number) => void,
  targetLocation: DimensionLocation
) {
  let number = world.getDynamicProperty("samplelibrary:number");

  log("Current value is: " + number);

  if (number === undefined) {
    number = 0;
  }

  if (typeof number !== "number") {
    log("Number is of an unexpected type.");
    return -1;
  }

  world.setDynamicProperty("samplelibrary:number", number + 1);
}

/**
 * Increments a dynamic numeric persisted property.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/world#getDynamicProperty
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/world#setDynamicProperty
 */
export function incrementDynamicPropertyInJsonBlob(
  log: (message: string, status?: number) => void,
  targetLocation: DimensionLocation
) {
  let paintStr = world.getDynamicProperty("samplelibrary:longerjson");
  let paint: { color: string; intensity: number } | undefined = undefined;

  log("Current value is: " + paintStr);

  if (paintStr === undefined) {
    paint = {
      color: "purple",
      intensity: 0,
    };
  } else {
    if (typeof paintStr !== "string") {
      log("Paint is of an unexpected type.");
      return -1;
    }

    try {
      paint = JSON.parse(paintStr);
    } catch (e) {
      log("Error parsing serialized struct.");
      return -1;
    }
  }

  if (!paint) {
    log("Error parsing serialized struct.");
    return -1;
  }

  paint.intensity++;
  paintStr = JSON.stringify(paint); // be very careful to ensure your serialized JSON str cannot exceed limits
  world.setDynamicProperty("samplelibrary:longerjson", paintStr);
}
