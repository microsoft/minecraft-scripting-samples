import * as mc from "@minecraft/server";

// When running a world with this behavior pack, type 'run' in chat to trigger this code.
export function scriptBox(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  mc.world.sendMessage("Hello world! Replace this line with your code.");
}
