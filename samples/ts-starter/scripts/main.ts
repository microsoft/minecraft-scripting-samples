import { world, system } from "@minecraft/server";

function mainTick() {
  if (system.currentTick % 100 === 0) {
    const message = { rawtext: [{ translate: "starter:welcome_message" }] };
    world.sendMessage(message);
  }

  system.run(mainTick);
}

system.run(mainTick);
