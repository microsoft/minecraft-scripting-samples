// Copyright (c) Mojang AB.  All rights reserved.

import {
  ActionTypes,
  CoreMenuType,
  IMenu,
  IPlayerUISession,
  PropertyBag,
  registerEditorExtension,
} from "@minecraft/server-editor";

type PerPlayerStorage = {
  NUM_TIMES_PLAYER_CLICKED: number;
};

function showPlayerMessage(uiSession: IPlayerUISession<PerPlayerStorage>) {
  if (!uiSession.scratchStorage) {
    uiSession.log.error("We're missing scratch storage.");
    return;
  }
  const clickCount = uiSession.scratchStorage.NUM_TIMES_PLAYER_CLICKED;
  uiSession.log.info(`Hello ${uiSession.extensionContext.player.name} - You clicked ${clickCount} times`);
}

function incrementClickValue(storage: PerPlayerStorage) {
  storage.NUM_TIMES_PLAYER_CLICKED++;
}

export function registerExtension() {
  registerEditorExtension<PerPlayerStorage>(
    "minimal-template-sample",

    (uiSession) => {
      uiSession.log.debug(
        `Initializing extension [${uiSession.extensionContext.extensionInfo.name}] for player [${uiSession.extensionContext.player.name}]`
      );

      const storage: PerPlayerStorage = {
        NUM_TIMES_PLAYER_CLICKED: 0,
      };
      uiSession.scratchStorage = storage;

      const extensionPane = uiSession.createPropertyPane({
        title: {
          id: "sample.minimal.pane.title",
        },
      });
      
      const buttonAction = uiSession.actionManager.createAction({
        actionType: ActionTypes.NoArgsAction,
        onExecute: () => {
          incrementClickValue(storage);
          showPlayerMessage(uiSession);
        },
      });

      extensionPane.addButton(buttonAction, {
        title: { id: "sample.minimal.pane.button.clickme" },
        visible: true,
      });

      uiSession.menuBar
        .getMenu(CoreMenuType.Extensions)
        .then((coreMenu: IMenu) => {
          // Create a menu entry in the menu bar Core menu
          const extensionMenu = coreMenu.addItem({
            label: "sample.minimal.menu.title",
          });

          extensionMenu.addItem(
            {
              label: "sample.minimal.menu.showpane",
            },
            uiSession.actionManager.createAction({
              actionType: ActionTypes.NoArgsAction,
              onExecute: () => {
                extensionPane.show();
              },
            })
          );
        })
        .catch((error: Error) => {
          uiSession.log.error(error.message);
        });

      return [];
    },

    (uiSession: IPlayerUISession<PerPlayerStorage>) => {
      uiSession.log.debug(
        `Shutting down extension [${uiSession.extensionContext.extensionInfo.name}] for player [${uiSession.extensionContext.player.name}]`
      );
    },
    {
      description: "Basic Sample Extension",
    }
  );
}
