import * as mc from "@minecraft/server";
import * as mcui from "@minecraft/server-ui";

/**
 * Shows a very basic action form.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server-ui/ActionFormData
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server-ui/ActionFormResponse
 */
export async function showActionForm(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  const playerList = mc.world.getPlayers();

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
      log("Player exited out of the dialog. Note that if the chat window is up, dialogs are automatically canceled.");
      return -1;
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
export function showFavoriteMonth(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  const players = mc.world.getPlayers();

  if (players.length >= 1) {
    const form = new mcui.ActionFormData()
      .title("Months")
      .body("Choose your favorite month!")
      .button("January")
      .button("February")
      .button("March")
      .button("April")
      .button("May");

    form.show(players[0]).then((response: mcui.ActionFormResponse) => {
      if (response.selection === 3) {
        log("I like April too!");
        return -1;
      }
    });
  }
}

/**
 * Shows an example two-button dialog.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server-ui/MessageFormData
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server-ui/MessageFormResponse
 */
export function showBasicMessageForm(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  const players = mc.world.getPlayers();

  const messageForm = new mcui.MessageFormData()
    .title("Message Form Example")
    .body("This shows a simple example using §o§7MessageFormData§r.")
    .button1("Button 1")
    .button2("Button 2");

  messageForm
    .show(players[0])
    .then((formData: mcui.MessageFormResponse) => {
      // player canceled the form, or another dialog was up and open.
      if (formData.canceled || formData.selection === undefined) {
        return;
      }

      log(`You selected ${formData.selection === 0 ? "Button 1" : "Button 2"}`);
    })
    .catch((error: Error) => {
      log("Failed to show form: " + error);
      return -1;
    });
}

/**
 * Shows an example translated two-button dialog dialog.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server-ui/MessageFormData
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server-ui/MessageFormResponse
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/RawMessage
 */
export function showTranslatedMessageForm(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  const players = mc.world.getPlayers();

  const messageForm = new mcui.MessageFormData()
    .title({ translate: "permissions.removeplayer" })
    .body({ translate: "accessibility.list.or.two", with: ["Player 1", "Player 2"] })
    .button1("Player 1")
    .button2("Player 2");

  messageForm
    .show(players[0])
    .then((formData: mcui.MessageFormResponse) => {
      // player canceled the form, or another dialog was up and open.
      if (formData.canceled || formData.selection === undefined) {
        return;
      }

      log(`You selected ${formData.selection === 0 ? "Player 1" : "Player 2"}`);
    })
    .catch((error: Error) => {
      log("Failed to show form: " + error);
      return -1;
    });
}

/**
 * Shows an example multiple-control modal dialog.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server-ui/ModalFormData
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server-ui/ModalFormResponse
 */
export function showBasicModalForm(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  const players = mc.world.getPlayers();

  const modalForm = new mcui.ModalFormData().title("Example Modal Controls for §o§7ModalFormData§r");

  modalForm.toggle("Toggle w/o default");
  modalForm.toggle("Toggle w/ default", true);

  modalForm.slider("Slider w/o default", 0, 50, 5);
  modalForm.slider("Slider w/ default", 0, 50, 5, 30);

  modalForm.dropdown("Dropdown w/o default", ["option 1", "option 2", "option 3"]);
  modalForm.dropdown("Dropdown w/ default", ["option 1", "option 2", "option 3"], 2);

  modalForm.textField("Input w/o default", "type text here");
  modalForm.textField("Input w/ default", "type text here", "this is default");

  modalForm
    .show(players[0])
    .then((formData) => {
      players[0].sendMessage(`Modal form results: ${JSON.stringify(formData.formValues, undefined, 2)}`);
    })
    .catch((error: Error) => {
      log("Failed to show form: " + error);
      return -1;
    });
}
