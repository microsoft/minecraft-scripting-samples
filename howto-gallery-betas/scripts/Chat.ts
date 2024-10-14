import { Vector3Utils } from "@minecraft/math";
import { BlockPermutation, DimensionLocation, world } from "@minecraft/server";
import { MinecraftBlockTypes } from "@minecraft/vanilla-data";

/**
 * Implements a very basic command system using the experiment chatbefore event.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/ChatSendBeforeEventSignal
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/world#beforeEvents
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/WorldBeforeEvents#chatSend
 */
export function customCommand(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const chatCallback = world.beforeEvents.chatSend.subscribe((eventData) => {
    if (eventData.message.includes("cancel")) {
      // Cancel event if the message contains "cancel"
      eventData.cancel = true;
    } else {
      const args = eventData.message.split(" ");

      if (args.length > 0) {
        switch (args[0].toLowerCase()) {
          case "echo":
            // Send a modified version of chat message
            world.sendMessage(`Echo '${eventData.message.substring(4).trim()}'`);
            break;
          case "help":
            world.sendMessage(`Available commands: echo <message>`);
            break;
        }
      }
    }
  });
}
