import * as mc from "mojang-minecraft";
import * as mcui from "mojang-minecraft-ui";

/**
 * Shows a very basic action form.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://docs.microsoft.com/minecraft/creator/scriptapi/mojang-minecraft-ui/ActionFormData
 * @see https://docs.microsoft.com/minecraft/creator/scriptapi/mojang-minecraft-ui/ActionFormResponse
 */
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

    if (result.isCanceled) {
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
 * @see https://docs.microsoft.com/minecraft/creator/scriptapi/mojang-minecraft-ui/ActionFormData
 * @see https://docs.microsoft.com/minecraft/creator/scriptapi/mojang-minecraft-ui/ActionFormResponse
 */
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
