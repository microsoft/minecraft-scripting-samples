import { DimensionLocation, world } from "@minecraft/server";

/**
 * Sends player a number of diverse message types.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/Player#sendMessage
 */
export function sendPlayerMessages(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  for (const player of world.getAllPlayers()) {
    // Displays "First or Second"
    const rawMessage = { translate: "accessibility.list.or.two", with: ["First", "Second"] };
    player.sendMessage(rawMessage);

    // Displays "Hello, world!"
    player.sendMessage("Hello, world!");

    // Displays "Welcome, Amazing Player 1!"
    player.sendMessage({ translate: "authentication.welcome", with: ["Amazing Player 1"] });

    // Displays the player's score for objective "obj". Each player will see their own score.
    const rawMessageWithScore = { score: { name: "*", objective: "obj" } };
    player.sendMessage(rawMessageWithScore);

    // Displays "Apple or Coal"
    const rawMessageWithNestedTranslations = {
      translate: "accessibility.list.or.two",
      with: { rawtext: [{ translate: "item.apple.name" }, { translate: "item.coal.name" }] },
    };
    player.sendMessage(rawMessageWithNestedTranslations);
  }
}
