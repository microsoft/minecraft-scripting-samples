import * as mc from "@minecraft/server";
import * as mcui from "@minecraft/server-ui";

const overworld = mc.world.getDimension("overworld");

export function scriptBox(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  mc.world.sendMessage("Hello world! Replace this line with your code.");
}
