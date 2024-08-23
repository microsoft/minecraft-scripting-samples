// Copyright (c) Mojang AB.  All rights reserved.

import {
  ActionTypes,
  CoreMenuType,
  IMenu,
  IPlayerUISession,
  PropertyBag,
  bindDataSource,
  registerEditorExtension,
} from "@minecraft/server-editor";

/**
 * Per player storage can be attached to the IPlayerUISession type in a type safe manner for anything
 * you'd like to store and access in a player contextual manner. This makes the data safe for multiplayer
 * usage. This type can be passed to the registerEditorExtension function as a generic parameter to make
 * all access type safe.
 */
type PerPlayerStorage = {
  NUM_TIMES_PLAYER_CLICKED: number;
};

// Output a message in the log window displaying the player's name and the number of times
// the button has been clicked
function showPlayerMessage(uiSession: IPlayerUISession<PerPlayerStorage>) {
  if (!uiSession.scratchStorage) {
    uiSession.log.error("We're missing scratch storage - this shouldn't happen!");
    return;
  }
  const clickCount = uiSession.scratchStorage.NUM_TIMES_PLAYER_CLICKED;
  uiSession.log.info(`Hello ${uiSession.extensionContext.player.name} - You clicked ${clickCount} times`);
}

function incrementClickValue(storage: PerPlayerStorage) {
  storage.NUM_TIMES_PLAYER_CLICKED++;
}

/**
 * Provides a sample extension registration function
 * @public
 */
export function registerBasicsExtension() {
  registerEditorExtension<PerPlayerStorage>(
    "minimal-template-sample",

    // Provide a function closure which is executed when each player connects to the server
    // The uiSession object holds the context for the extension and the player
    (uiSession) => {
      uiSession.log.debug(
        `Initializing extension [${uiSession.extensionContext.extensionInfo.name}] for player [${uiSession.extensionContext.player.name}]`
      );

      // Initialize the player specific, custom extension storage structure with whatever
      // the extension needs to store, and assign it to the `uiSession.scratchStorage` variable.
      // Using this in combination with JavaScript closure captures, you can access this player/extension
      // storage area in whatever events you need it
      const storage: PerPlayerStorage = {
        NUM_TIMES_PLAYER_CLICKED: 0,
      };
      uiSession.scratchStorage = storage;

      // Create a basic property pane with a button.  Property panes are the basic panels on to which you
      // can attach buttons, sliders and various other UI elements.
      // When you create a property pane, you bind it with an object which contains the values which represent
      // the contents of the UI elements you bind to the pane.  The binding object is a 'property bag' - a simple
      // key/value pair collection which the UI elements modify when they are actioned.
      // E.g. if you were to create a slider, the slider would be bound to a property 'mySlider' for example, and
      // when you adjust the slider, you can inspect the binding object property 'mySlider' for the current value.
      const extensionPane = uiSession.createPropertyPane({
        titleStringId: "sample.minimal.pane.title",
        titleAltText: "Extension Pane",
      });

      // Bind the property bag containing your dynamic data to the property pane - this is the common area
      // which you can query and set values which cause the UI to update (and will be updated BY the UI)
      const paneData: PropertyBag = {
        mySliderValue: 0,
      };
      bindDataSource(extensionPane, paneData);

      // Creating UI elements like buttons and sliders require a couple of simple steps.
      // - Create an action (a function declaration of what you want to happen when the element is actioned)
      // - Create the UI element and bind it to the action
      // (You can define a single action and bind it to many UI elements if you wish)

      const buttonAction = uiSession.actionManager.createAction({
        actionType: ActionTypes.NoArgsAction,
        onExecute: () => {
          // Increment the click value in the player's storage
          incrementClickValue(storage);
          // Send a message to the log window showing the player's name and the number of times
          // you've hit the button
          showPlayerMessage(uiSession);
        },
      });

      // Now create a button and bind the action you want to execute when it's pressed
      extensionPane.addButton(buttonAction, {
        titleStringId: "sample.minimal.pane.button.clickme",
        titleAltText: "Click me!",
        visible: true,
      });

      // Try to get predefined top level core menu
      uiSession.menuBar
        .getMenu(CoreMenuType.Extensions)
        .then((coreMenu: IMenu) => {
          // Create a menu entry in the menu bar Core menu
          const extensionMenu = coreMenu.addItem({
            displayStringId: "sample.minimal.menu.title",
            name: "My Extension",
          });

          // Adds a child menu item to show the property pane
          // Note - we're creating an action too, which can be executed when the menu
          // item is selected
          extensionMenu.addItem(
            {
              displayStringId: "sample.minimal.menu.showpane",
              name: "Show My Property Pane",
            },
            uiSession.actionManager.createAction({
              actionType: ActionTypes.NoArgsAction,
              onExecute: () => {
                // make sure we show the property pane (in case you might have closed it)
                extensionPane.show();
              },
            })
          );
        })
        .catch((error: Error) => {
          uiSession.log.error(error.message);
        });

      // Normally we return a collection of IDisposable objects that the extension system will clean
      // up and dispose of on shutdown.  We don't have any in this example, so let's just return
      // an empty collection
      return [];
    },

    // Provide a function which is executed when the player disconnects from the server
    // This is where the extension would normally clean up any resources it created/loaded during activation
    (uiSession: IPlayerUISession<PerPlayerStorage>) => {
      // Do any explicit cleanup when a player is leaving and the extension instance is shutting down
      uiSession.log.debug(
        `Shutting down extension [${uiSession.extensionContext.extensionInfo.name}] for player [${uiSession.extensionContext.player.name}]`
      );
    },

    // Descriptor for the extension
    {
      description: "Basic Sample Extension",
    }
  );
}
