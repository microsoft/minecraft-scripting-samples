import * as mc from "@minecraft/server";
import * as mcui from "@minecraft/server-ui";

/**
 * Shows a very basic action form.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server-ui/ActionFormData
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server-ui/ActionFormResponse
 */
// @ts-ignore
export async function showActionForm(log: (message: string, status?: number) => void, targetLocation: mc.Location) {
  const players = mc.world.getPlayers();

  const playerList = Array.from(players);

  if (playerList.length >= 1) {
    const form = new mcui.ActionFormData()
      .title("Test Title")
      .body("Body text here!")
      .button("btn 1")
      .button("btn 2")
      .button("btn 3")
      .button("btn 4")
      .button("btn 5");

    const result = await form.show(playerList[0]);

    if (result.canceled) {
      log("Player exited out of the dialog.");
    } else {
      log("Your result was: " + result.selection);
    }
  }
}

/**
 * Shows a dialog that lets a player pick their favorite month.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server-ui/ActionFormData
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server-ui/ActionFormResponse
 */
// @ts-ignore
export function showFavoriteMonth(log: (message: string, status?: number) => void, targetLocation: mc.Location) {
  const players = mc.world.getPlayers();

  const playerList = Array.from(players);

  if (playerList.length >= 1) {
    const form = new mcui.ActionFormData()
      .title("Months")
      .body("Choose your favorite month!")
      .button("January")
      .button("February")
      .button("March")
      .button("April")
      .button("May");

    form.show(playerList[0]).then((response: mcui.ActionFormResponse) => {
      if (response.selection === 3) {
        log("I like April too!");
      }
    });
  }
}
