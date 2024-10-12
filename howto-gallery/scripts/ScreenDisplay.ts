import { DimensionLocation, system, world } from "@minecraft/server";

/**
 * Sets a title overlay on the player's screen
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/ScreenDisplay
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/ScreenDisplay#setTitle
 */
export function setTitle(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const players = world.getPlayers();

  if (players.length > 0) {
    players[0].onScreenDisplay.setTitle("§o§6Fancy Title§r");
  }
}

/**
 * Sets a title and subtitle overlay on the player's screen
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/ScreenDisplay
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/ScreenDisplay#setTitle
 */
export function setTitleAndSubtitle(
  log: (message: string, status?: number) => void,
  targetLocation: DimensionLocation
) {
  const players = world.getPlayers();

  players[0].onScreenDisplay.setTitle("Chapter 1", {
    stayDuration: 100,
    fadeInDuration: 2,
    fadeOutDuration: 4,
    subtitle: "Trouble in Block Town",
  });
}

/**
 * Runs a countdown from 10 to 0.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/ScreenDisplay
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/ScreenDisplay#setTitle
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/ScreenDisplay#updateSubtitle
 */
export function countdown(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const players = world.getPlayers();

  players[0].onScreenDisplay.setTitle("Get ready!", {
    stayDuration: 220,
    fadeInDuration: 2,
    fadeOutDuration: 4,
    subtitle: "10",
  });

  let countdown = 10;

  const intervalId = system.runInterval(() => {
    countdown--;
    players[0].onScreenDisplay.updateSubtitle(countdown.toString());

    if (countdown == 0) {
      system.clearRun(intervalId);
    }
  }, 20);
}
