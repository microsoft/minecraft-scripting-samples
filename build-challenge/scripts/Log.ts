import { world, system } from "@minecraft/server";

export default class Log {
  static debug(name: string) {
    console.warn(name);

//    world.say("debug: " + name);
  }

  static debugAssert(condition: boolean, text?: string) {
    if (!condition) {
      let errorText = "Assertion failed";

      if (text) {
        errorText += ": " + text;
      }

      Log.debug(errorText);
    }
  }
}
