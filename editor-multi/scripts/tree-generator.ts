// Copyright (c) Mojang AB.  All rights reserved.

import {
  ActionTypes,
  EditorInputContext,
  IDropdownPropertyItemEntry,
  IModalTool,
  IObservable,
  IPlayerUISession,
  InputModifier,
  KeyboardKey,
  MouseActionType,
  MouseInputType,
  MouseProps,
  NumberPropertyItemVariant,
  Ray,
  makeObservable,
  registerEditorExtension,
} from "@minecraft/server-editor";
import { BlockPermutation, Vector3 } from "@minecraft/server";
import { MinecraftBlockTypes } from "@minecraft/vanilla-data";

interface TreeToolSettings {
  height: IObservable<number>;
  randomHeightVariance: IObservable<number>;
  treeType: IObservable<number>;
}

interface TreeBlockChangeData {
  location: Vector3;
  newBlock: BlockPermutation;
}

interface ITree {
  place(location: Vector3, settings: TreeToolSettings): TreeBlockChangeData[];
}

export class SimpleTree implements ITree {
  logType: BlockPermutation;
  leafType: BlockPermutation;

  constructor(logType: BlockPermutation, leafType: BlockPermutation) {
    this.logType = logType;
    this.leafType = leafType;
  }

  place(location: Vector3, settings: TreeToolSettings): TreeBlockChangeData[] {
    const result: TreeBlockChangeData[] = [];

    const heightOffset =
      Math.floor(Math.random() * settings.randomHeightVariance.value) - settings.randomHeightVariance.value / 2;
    const calculatedHeight = settings.height.value + heightOffset;

    ///
    // Trunk
    ///
    for (let y = 0; y <= calculatedHeight; ++y) {
      const offsetLocation: Vector3 = {
        x: location.x,
        y: location.y + y,
        z: location.z,
      };
      result.push({
        location: offsetLocation,
        newBlock: this.logType,
      });
    }

    ///
    // Leaves
    ///

    ///
    // Plus sign on top
    ///
    const leafBlocks = [
      { x: 0, y: 1, z: 0 },
      { x: 1, y: 1, z: 0 },
      { x: -1, y: 1, z: 0 },
      { x: 0, y: 1, z: 1 },
      { x: 0, y: 1, z: -1 },

      { x: 1, y: 0, z: 0 },
      { x: -1, y: 0, z: 0 },
      { x: 0, y: 0, z: 1 },
      { x: 0, y: 0, z: -1 },
    ];

    const randomPlusBlocks = [
      { x: 1, y: 0, z: 1 },
      { x: -1, y: 0, z: 1 },
      { x: -1, y: 0, z: -1 },
      { x: 1, y: 0, z: -1 },
    ];
    randomPlusBlocks.forEach((randBlock) => {
      if (Math.random() > 0.5) {
        leafBlocks.push(randBlock);
      }
    });

    ///
    // Fat bottom
    ///
    leafBlocks.push(
      ...[
        { x: 1, y: -1, z: -1 },
        { x: 1, y: -1, z: 0 },
        { x: 1, y: -1, z: 1 },

        { x: 0, y: -1, z: 1 },
        { x: 0, y: -1, z: -1 },

        { x: -1, y: -1, z: -1 },
        { x: -1, y: -1, z: 1 },
        { x: -1, y: -1, z: 0 },
      ]
    );

    if (calculatedHeight > 4) {
      leafBlocks.push(
        ...[
          { x: 1, y: -2, z: -1 },
          { x: 1, y: -2, z: 0 },
          { x: 1, y: -2, z: 1 },

          { x: 0, y: -2, z: 1 },
          { x: 0, y: -2, z: -1 },

          { x: -1, y: -2, z: -1 },
          { x: -1, y: -2, z: 1 },
          { x: -1, y: -2, z: 0 },

          // Outer
          { x: -2, y: -1, z: -1 },
          { x: -2, y: -1, z: 0 },
          { x: -2, y: -1, z: 1 },

          { x: -1, y: -1, z: -2 },
          { x: -1, y: -1, z: -1 },
          { x: -1, y: -1, z: 0 },
          { x: -1, y: -1, z: 1 },
          { x: -1, y: -1, z: 2 },

          { x: 0, y: -1, z: -2 },
          { x: 0, y: -1, z: -1 },
          { x: 0, y: -1, z: 1 },
          { x: 0, y: -1, z: 2 },

          { x: 1, y: -1, z: -2 },
          { x: 1, y: -1, z: -1 },
          { x: 1, y: -1, z: 0 },
          { x: 1, y: -1, z: 1 },
          { x: 1, y: -1, z: 2 },

          { x: 2, y: -1, z: -1 },
          { x: 2, y: -1, z: 0 },
          { x: 2, y: -1, z: 1 },

          { x: -2, y: -2, z: -1 },
          { x: -2, y: -2, z: 0 },
          { x: -2, y: -2, z: 1 },

          { x: -1, y: -2, z: -2 },
          { x: -1, y: -2, z: -1 },
          { x: -1, y: -2, z: 0 },
          { x: -1, y: -2, z: 1 },
          { x: -1, y: -2, z: 2 },

          { x: 0, y: -2, z: -2 },
          { x: 0, y: -2, z: -1 },
          { x: 0, y: -2, z: 1 },
          { x: 0, y: -2, z: 2 },

          { x: 1, y: -2, z: -2 },
          { x: 1, y: -2, z: -1 },
          { x: 1, y: -2, z: 0 },
          { x: 1, y: -2, z: 1 },
          { x: 1, y: -2, z: 2 },

          { x: 2, y: -2, z: -1 },
          { x: 2, y: -2, z: 0 },
          { x: 2, y: -2, z: 1 },
        ]
      );
    }

    const randomFatBottomBlocks = [
      { x: -2, y: -1, z: -2 },
      { x: -2, y: -1, z: 2 },

      { x: 2, y: -1, z: -2 },
      { x: 2, y: -1, z: 2 },
    ];

    if (calculatedHeight > 4) {
      randomFatBottomBlocks.push(
        ...[
          { x: -2, y: -2, z: -2 },
          { x: -2, y: -2, z: 2 },

          { x: 2, y: -2, z: -2 },
          { x: 2, y: -2, z: 2 },
        ]
      );
    }

    leafBlocks.forEach((block) => {
      const offsetLocation: Vector3 = {
        x: location.x + block.x,
        y: location.y + calculatedHeight + block.y,
        z: location.z + block.z,
      };
      result.push({
        location: offsetLocation,
        newBlock: this.leafType,
      });
    });

    return result;
  }
}

const TreeTypes = [
  {
    name: "Oak",
    type: new SimpleTree(
      BlockPermutation.resolve(MinecraftBlockTypes.OakLog),
      BlockPermutation.resolve(MinecraftBlockTypes.OakLeaves)
    ),
  },
  {
    name: "Spruce",
    type: new SimpleTree(
      BlockPermutation.resolve(MinecraftBlockTypes.SpruceLog),
      BlockPermutation.resolve(MinecraftBlockTypes.SpruceLeaves)
    ),
  },
  {
    name: "Birch",
    type: new SimpleTree(
      BlockPermutation.resolve(MinecraftBlockTypes.BirchLog),
      BlockPermutation.resolve(MinecraftBlockTypes.BirchLeaves)
    ),
  },
  {
    name: "Jungle",
    type: new SimpleTree(
      BlockPermutation.resolve(MinecraftBlockTypes.JungleLog),
      BlockPermutation.resolve(MinecraftBlockTypes.JungleLeaves)
    ),
  },

  {
    name: "Acacia",
    type: new SimpleTree(
      BlockPermutation.resolve(MinecraftBlockTypes.AcaciaLog),
      BlockPermutation.resolve(MinecraftBlockTypes.AcaciaLeaves)
    ),
  },
  {
    name: "Dark Oak",
    type: new SimpleTree(
      BlockPermutation.resolve(MinecraftBlockTypes.DarkOakLog),
      BlockPermutation.resolve(MinecraftBlockTypes.DarkOakLeaves)
    ),
  },
];

function addToolSettingsPane(uiSession: IPlayerUISession, tool: IModalTool) {
  // Create a pane that will be shown when the tool is selected
  const pane = uiSession.createPropertyPane({
    title: "sample.treegenerator.pane.title",
  });

  // Settings
  const settings: TreeToolSettings = {
    height: makeObservable(5),
    randomHeightVariance: makeObservable(0),
    treeType: makeObservable(0),
  };

  const onExecuteTool = (ray?: Ray) => {
    const player = uiSession.extensionContext.player;

    let location: Vector3;

    // Try finding a valid block to place a tree
    if (ray) {
      const raycastResult = player.dimension.getBlockFromRay(ray.location, ray.direction);
      if (!raycastResult) {
        uiSession.log.warning("Invalid target block!");
        return;
      }
      location = raycastResult.block.location;
    } else {
      const targetBlock = player.dimension.getBlock(uiSession.extensionContext.cursor.getPosition());
      if (!targetBlock) {
        uiSession.log.warning("Invalid target block!");
        return;
      }
      location = targetBlock.location;
    }

    // Begin transaction
    uiSession.extensionContext.transactionManager.openTransaction("Tree Tool");

    const selectedTreeType = TreeTypes[settings.treeType.value];
    const affectedBlocks = selectedTreeType.type.place(location, settings);

    // Track changes
    uiSession.extensionContext.transactionManager.trackBlockChangeList(affectedBlocks.map((x) => x.location));

    // Apply changes
    let invalidBlockCount = 0;
    affectedBlocks.forEach((item) => {
      const block = player.dimension.getBlock(item.location);
      if (block) {
        block.setPermutation(item.newBlock);
      } else {
        ++invalidBlockCount;
      }
    });

    if (invalidBlockCount > 0) {
      uiSession.log.warning(`There were ${invalidBlockCount} invalid blocks while placing a tree!`);
    }

    // End transaction
    uiSession.extensionContext.transactionManager.commitOpenTransaction();
  };

  // Add a dropdown for available tree types
  pane.addDropdown(settings.treeType, {
    title: "sample.treegenerator.pane.type",
    enable: true,
    entries: TreeTypes.map((tree, index): IDropdownPropertyItemEntry => {
      return {
        label: tree.name,
        value: index,
      };
    }, []),
  });

  pane.addNumber(settings.height, {
    title: "sample.treegenerator.pane.height",
    min: 1,
    max: 16,
    variant: NumberPropertyItemVariant.InputFieldAndSlider,
    isInteger: true,
  });

  pane.addNumber(settings.randomHeightVariance, {
    title: "sample.treegenerator.pane.variance",
    min: 0,
    max: 5,
    variant: NumberPropertyItemVariant.InputFieldAndSlider,
    isInteger: true,
  });

  // Create and an action that will be executed on key press
  const executeAction = uiSession.actionManager.createAction({
    actionType: ActionTypes.NoArgsAction,
    onExecute: onExecuteTool,
  });

  // Register the action as a keyboard shortcut
  tool.registerKeyBinding(
    executeAction,
    { key: KeyboardKey.KEY_T },
    { uniqueId: "editorSamples:treeGenerator:place", label: "sample.treegenerator.keyBinding.place" }
  );
  tool.bindPropertyPane(pane);

  pane.hide();
  // Create an action that will be executed on left mouse click
  const executeMouseAction = uiSession.actionManager.createAction({
    actionType: ActionTypes.MouseRayCastAction,
    onExecute: (mouseRay: Ray, mouseProps: MouseProps) => {
      if (mouseProps.mouseAction === MouseActionType.LeftButton && mouseProps.inputType === MouseInputType.ButtonDown) {
        onExecuteTool(mouseRay);
      }
    },
  });
  // Register the action for mouse button
  tool.registerMouseButtonBinding(executeMouseAction);

  return settings;
}

/**
 * Create a new tool rail item for tree generator
 */
function addTool(uiSession: IPlayerUISession) {
  // Create action
  const toolToggleAction = uiSession.actionManager.createAction({
    actionType: ActionTypes.NoArgsAction,
    onExecute: () => {
      uiSession.toolRail.setSelectedToolId(tool.id);
    },
  });

  const tool = uiSession.toolRail.addTool(
    {
      title: "sample.treegenerator.tool.title",
      icon: "pack://textures/tree-generator.png",
      tooltip: "sample.treegenerator.tool.tooltip",
      inputContextId: "editorSamples:treeGenerator",
      inputContextLabel: "sample.treegenerator.tool.title",
    },
    toolToggleAction
  );

  // Register a global shortcut to select the tool
  uiSession.inputManager.registerKeyBinding(
    EditorInputContext.GlobalToolMode,
    toolToggleAction,
    { key: KeyboardKey.KEY_T, modifier: InputModifier.Control | InputModifier.Shift },
    { uniqueId: "editorSamples:treeGenerator:toggleTool", label: "sample.treegenerator.keyBinding.toggleTool" }
  );

  return tool;
}

/**
 * Register Tree Generator extension
 */
export function registerTreeGeneratorExtension() {
  registerEditorExtension(
    "TreeGenerator-sample",
    (uiSession: IPlayerUISession) => {
      uiSession.log.debug(`Initializing [${uiSession.extensionContext.extensionInfo.name}] extension`);

      // Add extension tool to tool rail
      const tool = addTool(uiSession);

      // Create settings pane/window for the extension
      addToolSettingsPane(uiSession, tool);

      return [];
    },
    (uiSession: IPlayerUISession) => {
      uiSession.log.debug(`Shutting down [${uiSession.extensionContext.extensionInfo.name}] extension`);
    },
    {
      description: '"Tree Generator" Sample Extension',
      notes: "by Jake",
    }
  );
}
