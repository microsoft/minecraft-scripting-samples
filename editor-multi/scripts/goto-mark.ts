// Copyright (c) Mojang AB.  All rights reserved.

import {
  ActionTypes,
  IButtonPropertyItem,
  IDropdownPropertyItemEntry,
  IDropdownPropertyItem,
  IModalTool,
  IObservable,
  IPlayerUISession,
  IPropertyPane,
  IRootPropertyPane,
  UserDefinedTransactionHandle,
  makeObservable,
  registerEditorExtension,
  registerUserDefinedTransactionHandler,
} from "@minecraft/server-editor";
import { Vector3, system } from "@minecraft/server";

const storedLocationDynamicPropertyName = "goto-mark:storedLocations"; // The key of the stored location dynamic property
const storedLocationNameMaxLength = 16; // This is the maximum length of the name of a stored location
const storedLocationsMax = 9; // The maximum number of stored locations

type GotoTeleportTransactionPayload = {
  current: Vector3;
  destination: Vector3;
};

// The stored location data structure that represents each of the stored locations
// this is also the JSON format that is stored in the dynamic property
type LocationData = {
  location: Vector3;
  name: string;
};

// UI Pane data for the whole extension pane
type ParentPaneDataSourceType = {
  playerLocation: Vector3;
};

// Extension storage data which is pertinent to the the player's context of this extension
type ExtensionStorage = {
  tool?: IModalTool; // The tool handle for the extension
  previousLocation: Vector3; // The players last recorded position

  updateHandle?: number; // The handle for the repeating interval that updates the player position

  parentPaneDataSource?: ParentPaneDataSourceType; // The data source for the parent pane
  parentPane?: IPropertyPane; // The parent pane
  dropdownMenu?: IDropdownPropertyItem; // The dropdown

  newLocationName: IObservable<string>;

  storedLocations: LocationData[]; // The list of stored locations

  transactionHandler: UserDefinedTransactionHandle<GotoTeleportTransactionPayload>; // The transaction handler for the extension

  teleportButton?: IButtonPropertyItem;
};

// Handy helper to turn a Vector3 into a pretty string
function vector3ToString(vec: Vector3): string {
  return `(${vec.x}, ${vec.y}, ${vec.z})`;
}

// Equality check for a Vector3
function vector3Equals(vec1: Vector3, vec2: Vector3): boolean {
  return vec1.x === vec2.x && vec1.y === vec2.y && vec1.z === vec2.z;
}

// Truncate a Vector3 to the nearest block
function vector3Truncate(vec: Vector3): Vector3 {
  const blockLocation: Vector3 = { x: Math.floor(vec.x), y: Math.floor(vec.y), z: Math.floor(vec.z) };
  return blockLocation;
}

function mapDropdownItems(storage: ExtensionStorage): IDropdownPropertyItemEntry[] {
  return storage.storedLocations.map((v, index): IDropdownPropertyItemEntry => {
    const item: IDropdownPropertyItemEntry = {
      label: `${index + 1}: ${v.name} (${vector3ToString(v.location)})`,
      value: index,
    };
    return item;
  });
}

function createTransaction(uiSession: IPlayerUISession<ExtensionStorage>, current: Vector3, destination: Vector3) {
  const transactionPayload: GotoTeleportTransactionPayload = {
    current,
    destination,
  };
  if (!uiSession.scratchStorage) {
    return;
  }

  uiSession.extensionContext.transactionManager.openTransaction("goto position");
  uiSession.scratchStorage.transactionHandler.addUserDefinedOperation(transactionPayload, "Goto(Teleport)");
  uiSession.extensionContext.transactionManager.commitOpenTransaction();
}

function teleportTo(uiSession: IPlayerUISession<ExtensionStorage>, destination: Vector3) {
  createTransaction(uiSession, uiSession.extensionContext.player.location, destination);
  uiSession.log.info(`Teleporting to location ${vector3ToString(destination)}`);
  try {
    uiSession.extensionContext.player.teleport(destination);
  } catch (e) {
    uiSession.log.error(`Teleport failed: ${stringFromException(e)}`);
  }
}

function stringFromException(e: any) {
  return e.toString();
}

// Add the extension to the tool rail and give it an icon
function addExtensionTool(uiSession: IPlayerUISession<ExtensionStorage>): IModalTool {
  const tool = uiSession.toolRail.addTool("editorSample:goToMarkTool", {
    title: "sample.gotomark.tool.title",
    icon: "pack://textures/goto-mark.png",
    tooltip: "Set or Jump to a stored location",
  });
  return tool;
}

function buildParentPane(uiSession: IPlayerUISession<ExtensionStorage>, storage: ExtensionStorage): IRootPropertyPane {
  const parentPane = uiSession.createPropertyPane({
    title: "sample.gotomark.pane.title",
  });

  const playerLocation = makeObservable<Vector3>(vector3Truncate(uiSession.extensionContext.player.location));
  storage.previousLocation = playerLocation.value;

  parentPane.addVector3(playerLocation, {
    title: "sample.gotomark.pane.location",
  });

  // Run interval to refresh coordinate population
  // Issue with refresh on tick rate with show/hide
  storage.updateHandle = system.runInterval(() => {
    if (!storage.parentPaneDataSource) {
      return;
    }

    const currentLocation = vector3Truncate(uiSession.extensionContext.player.location);
    const previousLocation = vector3Truncate(storage.previousLocation);

    // Player hasn't moved - don't refresh
    if (vector3Equals(currentLocation, previousLocation) || !parentPane.visible) {
      return;
    }

    storage.previousLocation = currentLocation;
    storage.parentPaneDataSource.playerLocation = { ...currentLocation };
  }, 10);

  // Jump directly to the location specified in the Vector3 UI control
  parentPane.addButton(
    uiSession.actionManager.createAction({
      actionType: ActionTypes.NoArgsAction,
      onExecute: () => {
        if (!storage.parentPaneDataSource) {
          uiSession.log.error("An error occurred: No UI pane datasource could be found");
          return;
        }

        const panelLocation = storage.parentPaneDataSource.playerLocation;
        teleportTo(uiSession, panelLocation);
      },
    }),
    {
      title: "sample.gotomark.pane.button.teleport",
      visible: true,
    }
  );

  parentPane.addDivider();

  // Set the players spawn location based on the current location (or the location typed into the
  // Vector3 UI control)
  parentPane.addButton(
    uiSession.actionManager.createAction({
      actionType: ActionTypes.NoArgsAction,
      onExecute: () => {
        if (!storage.parentPaneDataSource) {
          uiSession.log.error("An error occurred: No UI pane datasource could be found");
          return;
        }
        const currentLocation = storage.parentPaneDataSource.playerLocation;
        uiSession.log.info(`Setting Spawn Location to ${vector3ToString(currentLocation)}`);
        uiSession.extensionContext.player.setSpawnPoint({
          ...currentLocation,
          dimension: uiSession.extensionContext.player.dimension,
        });
      },
    }),
    {
      title: "sample.gotomark.pane.button.setspawn",
      visible: true,
    }
  );

  // Jump to the player's spawn location (stored in the entity)
  parentPane.addButton(
    uiSession.actionManager.createAction({
      actionType: ActionTypes.NoArgsAction,
      onExecute: () => {
        const spawnLocation = uiSession.extensionContext.player.getSpawnPoint();
        if (!spawnLocation) {
          uiSession.log.error("Player Spawn Location is not yet set");
        } else {
          teleportTo(uiSession, spawnLocation);
        }
      },
    }),
    {
      title: "sample.gotomark.pane.button.gotospawn",
      visible: true,
    }
  );

  storage.parentPane = parentPane;

  // Build/Rebuild a sub-pane with the more dynamic UI controls
  buildLocationPane(uiSession, storage, 0);

  return parentPane;
}

function buildLocationPane(
  uiSession: IPlayerUISession<ExtensionStorage>,
  storage: ExtensionStorage,
  initialSelection: number
) {
  if (!storage.parentPane) {
    uiSession.log.error("An error occurred: No UI pane could be found");
    return;
  }

  const locationPane = storage.parentPane.createSubPane({
    title: "sample.gotomark.pane.locationpane.title",
  });

  const currentSelection = makeObservable(initialSelection);

  const dropdownItems = mapDropdownItems(storage);

  storage.dropdownMenu = locationPane.addDropdown(currentSelection, {
    title: "sample.gotomark.pane.locationpane.dropdownLabel",
    entries: dropdownItems,
    onChange: (newValue: number) => {
      if (storage.teleportButton) {
        storage.teleportButton.setTitle({
          id: "sample.gotomark.pane.locationpane.button.teleport",
          props: [`${newValue + 1}`],
        });
      }
    },
  });

  locationPane.addDivider();

  // Jump to the stored location selected in the dropdown
  storage.teleportButton = locationPane.addButton(
    uiSession.actionManager.createAction({
      actionType: ActionTypes.NoArgsAction,
      onExecute: () => {
        if (currentSelection.value < 0 || currentSelection.value >= storage.storedLocations.length) {
          uiSession.log.error("No stored locations to delete");
          return;
        }

        const destination = storage.storedLocations[currentSelection.value].location;
        teleportTo(uiSession, destination);
      },
    }),
    {
      title: {
        id: "sample.gotomark.pane.locationpane.button.teleport",
        props: [dropdownItems.length > 0 ? `${currentSelection.value + 1}` : ""],
      },
      visible: true,
    }
  );
  // Delete the stored location selected in the dropdown
  locationPane.addButton(
    uiSession.actionManager.createAction({
      actionType: ActionTypes.NoArgsAction,
      onExecute: () => {
        const selectionValue = currentSelection.value;
        if (selectionValue < 0 || selectionValue >= storage.storedLocations.length) {
          uiSession.log.error("No stored locations to delete");
          return;
        }
        const locationData = storage.storedLocations[selectionValue];
        const locationName = locationData.name;

        uiSession.log.info(`Deleting stored location name "${locationName}"`);
        storage.storedLocations.splice(selectionValue, 1);

        storeLocationsToPlayer(uiSession, storage);

        const dropdownItems = mapDropdownItems(storage);
        const newValue =
          selectionValue >= dropdownItems.length && selectionValue > 0 ? selectionValue - 1 : selectionValue;
        storage.dropdownMenu?.updateEntries(dropdownItems, newValue);

        storage.teleportButton?.setTitle({
          id: "sample.gotomark.pane.locationpane.button.teleport",
          props: [dropdownItems.length > 0 ? `${newValue + 1}` : ""],
        });
      },
    }),
    {
      title: "sample.gotomark.pane.locationpane.button.delete",
      visible: true,
    }
  );

  locationPane.addString(storage.newLocationName, {
    title: "sample.gotomark.pane.locationpane.input.name",
  });

  locationPane.addButton(
    uiSession.actionManager.createAction({
      actionType: ActionTypes.NoArgsAction,
      onExecute: () => {
        if (!storage.parentPaneDataSource) {
          uiSession.log.error("An error occurred: No UI pane datasource could be found");
          return;
        }
        if (storage.storedLocations.length >= storedLocationsMax) {
          uiSession.log.error(`Cannot store more than ${storedLocationsMax} locations`);
          return;
        }
        const currentLocation = vector3Truncate(storage.parentPaneDataSource.playerLocation);
        const newName = storage.newLocationName;
        if (!newName.value) {
          newName.set(`Location ${storage.storedLocations.length + 1}`);
        } else {
          const trimmedName = newName.value.trim();
          if (trimmedName.length > storedLocationNameMaxLength) {
            newName.set(trimmedName.substring(0, storedLocationNameMaxLength));
          }
        }

        uiSession.log.info(`Adding Location ${vector3ToString(currentLocation)} as "${newName.value}"`);
        storage.storedLocations.push({
          name: newName.value,
          location: currentLocation,
        });

        storeLocationsToPlayer(uiSession, storage);

        const newSelectionIndex = storage.storedLocations.length - 1;

        const dropdownItems = mapDropdownItems(storage);
        storage.dropdownMenu?.updateEntries(dropdownItems, newSelectionIndex);

        storage.teleportButton?.setTitle({
          id: "sample.gotomark.pane.locationpane.button.teleport",
          props: [`${newSelectionIndex + 1}`],
        });
      },
    }),
    {
      title: "sample.gotomark.pane.locationpane.button.store",
    }
  );
}

function storeLocationsToPlayer(uiSession: IPlayerUISession<ExtensionStorage>, storage: ExtensionStorage) {
  const me = uiSession.extensionContext.player;
  me.setDynamicProperty(storedLocationDynamicPropertyName, JSON.stringify(storage.storedLocations));
}

export function registerGotoMarkExtension() {
  registerEditorExtension<ExtensionStorage>(
    "goto-mark-sample",
    (uiSession) => {
      uiSession.log.debug(
        `Initializing extension [${uiSession.extensionContext.extensionInfo.name}] for player [${uiSession.extensionContext.player.name}]`
      );

      const storage: ExtensionStorage = {
        previousLocation: uiSession.extensionContext.player.location,
        storedLocations: [],
        newLocationName: makeObservable(""),
        transactionHandler: registerUserDefinedTransactionHandler<GotoTeleportTransactionPayload>(
          uiSession.extensionContext.transactionManager,
          (payload: GotoTeleportTransactionPayload) => {
            // undo handler
            uiSession.log.info(`Teleporting to location ${vector3ToString(payload.current)}`);
            try {
              uiSession.extensionContext.player.teleport(payload.current);
            } catch (e) {
              uiSession.log.error(`Teleport failed: ${stringFromException(e)}`);
            }
          },
          (payload: GotoTeleportTransactionPayload) => {
            // redo handler
            uiSession.log.info(`Teleporting to location ${vector3ToString(payload.destination)}`);
            try {
              uiSession.extensionContext.player.teleport(payload.destination);
            } catch (e) {
              uiSession.log.error(`Teleport failed: ${stringFromException(e)}`);
            }
          }
        ),
      };

      const me = uiSession.extensionContext.player;
      try {
        const fetchedLocationsString = me.getDynamicProperty(storedLocationDynamicPropertyName) as string;
        if (!fetchedLocationsString) {
          uiSession.log.info("No stored locations found during initialization");
        } else {
          const fetchedLocationsArray = JSON.parse(fetchedLocationsString) as LocationData[];

          if (fetchedLocationsArray) {
            storage.storedLocations = fetchedLocationsArray;
          }
          uiSession.log.info(`Found ${storage.storedLocations.length} stored locations during initialization`);
        }
      } catch (e) {
        uiSession.log.info("No stored locations found during initialization");
      }

      storage.tool = addExtensionTool(uiSession);
      const pane = buildParentPane(uiSession, storage);
      storage.tool.bindPropertyPane(pane);

      uiSession.scratchStorage = storage;

      return [];
    },

    (uiSession: IPlayerUISession<ExtensionStorage>) => {
      uiSession.log.debug(
        `Shutting down extension [${uiSession.extensionContext.extensionInfo.name}] for player [${uiSession.extensionContext.player.name}]`
      );

      if (uiSession.scratchStorage) {
        // If we still have a system interval runner, then shut it down
        if (uiSession.scratchStorage.updateHandle) {
          system.clearRun(uiSession.scratchStorage.updateHandle);
        }
      }
    },
    {
      description: '"Go to Bookmark" Sample Extension',
      notes: "by Chloe, Eser & Dave",
    }
  );
}
