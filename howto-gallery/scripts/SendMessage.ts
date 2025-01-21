import { DimensionLocation, world } from "@minecraft/server";

/**
 * Sends a basic message.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/Player#sendMessage
 */
export function sendBasicMessage(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const players = world.getPlayers();

  players[0].sendMessage("Hello World!");
}

/**
 * Sends a translated message.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/Player#sendMessage
 */
export function sendTranslatedMessage(
  log: (message: string, status?: number) => void,
  targetLocation: DimensionLocation
) {
  const players = world.getPlayers();

  players[0].sendMessage({ translate: "authentication.welcome", with: ["Amazing Player 1"] });
}

/**
 * Sends a message with nested translation.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/Player#sendMessage
 */
export function nestedTranslation(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  // Displays "Apple or Coal"
  const rawMessage = {
    translate: "accessibility.list.or.two",
    with: { rawtext: [{ translate: "item.apple.name" }, { translate: "item.coal.name" }] },
  };
  world.sendMessage(rawMessage);
}

/**
 * Sends a message with a wildcard score.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/Player#sendMessage
 */
export function scoreWildcard(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  // Displays the player's score for objective "obj". Each player will see their own score.
  const rawMessage = { score: { name: "*", objective: "obj" } };
  world.sendMessage(rawMessage);
}
