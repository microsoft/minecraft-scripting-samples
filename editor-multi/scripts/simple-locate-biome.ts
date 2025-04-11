// Copyright (c) Mojang AB.  All rights reserved.

import { VECTOR3_ZERO, Vector3Utils } from "@minecraft/math";
import {
  ActionTypes,
  IDropdownItem,
  IObservable,
  IPlayerUISession,
  ISimpleToolOptions,
  ISimpleToolPaneComponent,
  InputModifier,
  KeyboardKey,
  SimpleToolWrapper,
  makeObservable,
  registerEditorExtension,
} from "@minecraft/server-editor";
import { BiomeTypes, Player, Vector3 } from "@minecraft/server";

enum LocateMode {
  Biome = 0,
  Structure,
}

type LocateSelectorType = {
  locateMode: IObservable<LocateMode>;
};

type LocateBiomeSourceType = {
  biomeId: IObservable<number>;
  biomePos: Vector3;
};

type ResultsType = {
  foundType: string;
  foundPos: Vector3;
};

// Implementation of a simple tool that allows the player to locate a biome
// This tool demonstrates the use of the SimpleToolWrapper class (and the associated
// ISimpleTool<T>Options interfaces)
export class SimpleLocate extends SimpleToolWrapper {
  private _results: ResultsType = {
    foundType: "",
    foundPos: VECTOR3_ZERO,
  };

  // Activate the results pane with the found biome/structure and position in the
  // world.  This uses the SimpleToolWrapper's showPane method to display the results
  // in a pre-constructed pane which is generally hidden until results are valid.
  activateResultsPane(biome: string, pos: Vector3): void {
    this.simpleTool.logInfo(`Found ${biome} at ${Vector3Utils.toString(pos)}`);

    this._results.foundType = biome;
    this._results.foundPos = pos;

    // Hopefully, we'll be able to get rid of this function in the near future.
    // reconstructing the pane is a last-resort hack to get the pane to update
    // certain UI components which do not currently support dynamic data binding.
    // It's a necessary evil for now, but we're working on a better solution.
    // We certainly don't recommend doing this more than necessary - it causes a
    // lot of classes to be re-created and can be very slow, especially if there
    // are a lot of child panes and UI components.
    const foundPane = this.simpleTool.pane.findPane("results-found");
    foundPane?.reconstructPane();

    // Show the results pane (this will cause the other sibling panes
    // (like 'results-notfound') to be hidden because they're flagged as mutually
    // exclusive)
    this.simpleTool.showPane("results-found");
  }

  activateNoResultsPane(): void {
    // Show the results-notfound pane (this will cause the other sibling panes
    // (like 'results-found') to be hidden because they're flagged as mutually
    // exclusive)
    this.simpleTool.showPane("results-notfound");
  }

  hideResultsPane(): void {
    // Hide the results pane
    // We generally do this when we're changing options or don't have a valid set
    // of results to display.
    // Note that this will hide both the `results-found` and `results-notfound` panes
    // because they're child panes of this one
    this.simpleTool.hidePane("results");
  }

  // The 'typeSelector' pane is the initial pane that allows the player to select the
  // type of 'thing' they want to locate (biome or structure).  This function builds
  // a dropdown containing the two options.
  // The onChange event handler is used to show the appropriate sub-pane based on the
  // selection.
  buildTypeSelectionPane(component: ISimpleToolPaneComponent): void {
    const actualPane = component.pane;

    // We create a data binding between this pane/server script and the client-side
    // UI component.  This binding allows changes here to be reflected in the UI and
    // changes made to the UI to be reflected here.
    // It creates a bi-directional networking link between the client and server.
    // We use this to ensure that the selected type is always up-to-date.
    const locatorType: LocateSelectorType = {
      locateMode: makeObservable(LocateMode.Biome),
    };

    // Create a dropdown with two options: Biome and Structure
    // and an event handler to show the appropriate sub-pane when the selection changes
    actualPane.addDropdown(locatorType.locateMode, {
      title: "sample.simplelocate.tool.locatetype.title",
      entries: [
        {
          label: "sample.simplelocate.tool.locatetype.biome",
          value: LocateMode.Biome,
        },
        {
          label: "sample.simplelocate.tool.locatetype.structure",
          value: LocateMode.Structure,
        },
      ],
      onChange: (newValue: number) => {
        const mode = newValue as LocateMode;
        if (mode === LocateMode.Biome) {
          component.simpleTool.showPane("type-biome");
        } else {
          component.simpleTool.showPane("type-structure");
        }
        component.simpleTool.hidePane("results");
      },
    });
  }

  buildBiomeSearchPane(component: ISimpleToolPaneComponent): void {
    const actualPane = component.pane;

    const biomeType: LocateBiomeSourceType = {
      biomeId: makeObservable(0),
      biomePos: VECTOR3_ZERO,
    };

    const listOfBiomes = BiomeTypes.getAll().map((v, i) => {
      const names = v.id;
      const item: IDropdownItem = {
        label: names.replace("minecraft:", "").replace("_", " "),
        value: i,
      };
      return item;
    });

    actualPane.addDropdown(biomeType.biomeId, {
      title: "sample.simplelocate.tool.biome.title",
      entries: listOfBiomes,
      onChange: () => {
        component.simpleTool.hidePane("results");
      },
    });

    const locateBiomeAction = component.session.actionManager.createAction({
      actionType: ActionTypes.NoArgsAction,
      onExecute: () => {
        const biome = BiomeTypes.getAll()[biomeType.biomeId.value].id;
        const player: Player = component.session.extensionContext.player;
        const biomePos = player.dimension.findClosestBiome(player.location, biome);
        if (biomePos) {
          this.activateResultsPane(biome, biomePos);
        } else {
          this.activateNoResultsPane();
        }
      },
    });

    actualPane.addButton(locateBiomeAction, {
      title: "sample.simplelocate.tool.biome.find",
      visible: true,
      icon: "pinIcon",
    });
  }

  buildStructurePane(component: ISimpleToolPaneComponent): void {
    const actualPane = component.pane;
    actualPane.addText("sample.simplelocate.tool.structure.message", {
      border: true,
    });
  }

  buildResultsPane(component: ISimpleToolPaneComponent): void {
    const actualPane = component.pane;
    actualPane.addText(`Found ${this._results.foundType}`);

    actualPane.addVector3_deprecated(this._results, "foundPos", {
      title: "sample.simplelocate.tool.results.foundat",
      enable: false,
      visible: true,
    });

    actualPane.addButton(
      component.session.actionManager.createAction({
        actionType: ActionTypes.NoArgsAction,
        onExecute: () => {
          const pos = this._results.foundPos;
          component.session.extensionContext.player.teleport(pos);
        },
      }),
      {
        title: "sample.simplelocate.tool.results.goto",
      }
    );
  }

  buildNoResultsPane(component: ISimpleToolPaneComponent): void {
    const actualPane = component.pane;
    actualPane.addText("sample.simplelocate.tool.results.notfound", {
      border: true,
    });
  }

  constructor(session: IPlayerUISession) {
    super();

    const toolOptions: ISimpleToolOptions = {
      id: "editor:simpleLocateBiome",
      name: "Simple Locate Biome",
      activationKeyBinding: {
        binding: {
          key: KeyboardKey.KEY_L,
          modifier: InputModifier.Control | InputModifier.Shift,
        },
        info: {
          uniqueId: "editorSample:locateBiomeToolKeyBinding:toggleTool",
          label: "sample.simplelocate.tool.keyBinding.toggleTool",
        },
      },

      propertyPaneOptions: {
        id: "pane",
        title: "sample.simplelocate.tool.title",

        childPaneInitiallyVisible: "typeSelector",

        // There are 2 sub-panes in the root window, and 2 sub-panes in the first sub-pane
        // 1        typeSelector            - The Locate Type Selector
        //  1-1         type-biome          - The Biome Locator
        //  1-2         type-structure      - The Structure Locator
        // 2        results                 - The results
        //  2-1         results-found       - Actual Results
        //  2-2         results-notfound    - Not Found warning
        childPanes: [
          {
            id: "typeSelector",
            title: "sample.simplelocate.tool.locatetype.title",

            onBeginFinalize: (component) => this.buildTypeSelectionPane(component),

            childPaneInitiallyVisible: "type-biome",
            childPanesMutuallyExclusive: true,

            childPanes: [
              {
                id: "type-biome",
                title: "sample.simplelocate.tool.locatetype.biome.title",
                onBeginFinalize: (component) => this.buildBiomeSearchPane(component),
              },
              {
                id: "type-structure",
                title: "sample.simplelocate.tool.locatetype.structure.title",
                onBeginFinalize: (component) => this.buildStructurePane(component),
              },
            ],
          },
          {
            id: "results",
            title: "sample.simplelocate.tool.results.title",

            childPanesMutuallyExclusive: true,

            childPanes: [
              {
                id: "results-found",
                title: "sample.simplelocate.tool.results.foundat.title",

                onBeginFinalize: (component) => this.buildResultsPane(component),
              },
              {
                id: "results-notfound",
                title: "sample.simplelocate.tool.results.notfound.title",

                onBeginFinalize: (component) => this.buildNoResultsPane(component),
              },
            ],
          },
        ],
      },
    };

    this.setupSimpleTool(session, toolOptions);
  }
}

/**
 * Provides a "Simple Biome Locate" extension to demonstrate the new Simple Tool wrapper system
 * @beta
 */
export function registerSimpleLocateBiomeExtension() {
  registerEditorExtension(
    "simple-locate-sample",
    (uiSession) => {
      uiSession.log.debug(`Initializing extension [${uiSession.extensionContext.extensionInfo.name}]`);

      // Just instantiate the tool and return it to the editor - the editor will deal with cleaning up
      // and shutting down the tool when it's no longer required
      const simpleLocateTool = new SimpleLocate(uiSession);

      // Return an array of things for the editor to clean up.
      // If you wanted to, you can create many individual tools in this single register function
      // and return them all in the array, and the editor will clean them all up when the extension
      // is unloaded
      return [simpleLocateTool];
    },
    (uiSession) => {
      uiSession.log.debug(
        `Shutting down extension [${uiSession.extensionContext.extensionInfo.name}] for player [${uiSession.extensionContext.player.name}]`
      );
    },
    {
      description: '"Simple Locate Biome Tool" Sample Extension',
      notes: "by Dave & Mitch",
    }
  );
}
