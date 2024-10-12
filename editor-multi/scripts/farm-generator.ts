// Copyright (c) Mojang AB.  All rights reserved.

import { VECTOR3_ZERO } from "@minecraft/math";
import {
  ActionTypes,
  EditorInputContext,
  IModalTool,
  IObservable,
  IPlayerUISession,
  InputModifier,
  KeyboardKey,
  MouseActionType,
  MouseInputType,
  MouseProps,
  Ray,
  makeObservable,
  registerEditorExtension,
} from "@minecraft/server-editor";
import { Player, Vector3 } from "@minecraft/server";
import { MinecraftBlockTypes, MinecraftEntityTypes } from "@minecraft/vanilla-data";

type CommonSettingsType = {
  farmWidth: IObservable<number>;
  farmLength: IObservable<number>;
  irrigation: IObservable<boolean>;
  fenceType: IObservable<number>;
};

type CropSettingsType = {
  wheat: IObservable<boolean>;
  pumpkin: IObservable<boolean>;
  potato: IObservable<boolean>;
  carrot: IObservable<boolean>;
  beetroot: IObservable<boolean>;
};

type AnimalSettingsType = {
  pig: IObservable<boolean>;
  sheep: IObservable<boolean>;
  cow: IObservable<boolean>;
};

function getRandomInt(upper: number) {
  return Math.floor(Math.random() * (upper + 1));
}

function fenceTypeToBlockType(fenceType: number): string {
  switch (fenceType) {
    case 0:
      return MinecraftBlockTypes.OakFence;
    case 1:
      return MinecraftBlockTypes.BirchFence;
    case 2:
      return MinecraftBlockTypes.AcaciaFence;
    case 3:
      return MinecraftBlockTypes.BambooFence;
    case 4:
      return MinecraftBlockTypes.CherryFence;
    case 5:
      return MinecraftBlockTypes.JungleFence;
    case 6:
      return MinecraftBlockTypes.SpruceFence;
    case 7:
      return MinecraftBlockTypes.WarpedFence;
    case 8:
      return MinecraftBlockTypes.CrimsonFence;
    default:
      return MinecraftBlockTypes.OakFence;
  }
}

const buildFarm = (
  targetCorner: Vector3,
  x: number,
  z: number,
  length: number,
  width: number,
  possibleAnimals: MinecraftEntityTypes[],
  possibleCrops: string[],
  player: Player,
  commonSettings: CommonSettingsType
) => {
  let didPlaceAnimal = false;
  for (let i = 0; i < width; i++) {
    for (let j = length - 1; j > -1; j--) {
      const xOffset = i * x;
      const zOffset = z * j;
      const location: Vector3 = { x: targetCorner.x + xOffset, y: targetCorner.y, z: targetCorner.z + zOffset };
      const locationAbove: Vector3 = {
        x: targetCorner.x + xOffset,
        y: targetCorner.y + 1,
        z: targetCorner.z + zOffset,
      };
      const block = player.dimension.getBlock(location);
      const blockAbove = player.dimension.getBlock(locationAbove);
      const isBorder = i === 0 || i === width - 1 || j === 0 || j === length - 1;
      if (xOffset % 3 === 0 && !isBorder && commonSettings.irrigation.value) {
        block?.setType(MinecraftBlockTypes.Water);
      } else {
        block?.setType(MinecraftBlockTypes.Farmland);
      }
      if (isBorder) {
        blockAbove?.setType(fenceTypeToBlockType(commonSettings.fenceType.value));
      } else if (possibleAnimals.length > 0 && getRandomInt(5) === 5) {
        const animal = getRandomInt(possibleAnimals.length - 1);
        const entityType = possibleAnimals[animal];
        player.dimension.spawnEntity(entityType, blockAbove?.location ?? VECTOR3_ZERO, {
          initialPersistence: true,
        });
        didPlaceAnimal = true;
      } else if (!block?.isLiquid && possibleCrops.length > 0) {
        const crop = getRandomInt(possibleCrops.length - 1);
        const blockType = possibleCrops[crop];
        blockAbove?.setType(blockType);
      }
    }
  }

  // Guarantee there is at least one animal spawned if we haven't placed one yet and there is room to place one
  if (!didPlaceAnimal && possibleAnimals.length > 0 && width > 2 && length > 2) {
    const locationAbove: Vector3 = {
      x: targetCorner.x + x,
      y: targetCorner.y + 1,
      z: targetCorner.z + z,
    };
    const blockAbove = player.dimension.getBlock(locationAbove);
    const animal = getRandomInt(possibleAnimals.length - 1);
    const entityType = possibleAnimals[animal];
    player.dimension.spawnEntity(entityType, blockAbove?.location ?? VECTOR3_ZERO, { initialPersistence: true });
  }
};

function addFarmGeneratorSettingsPane(uiSession: IPlayerUISession, tool: IModalTool) {
  const windowPane = uiSession.createPropertyPane({
    title: "sample.farmgenerator.pane.title",
  });
  const cropPane = windowPane.createSubPane({
    title: "sample.farmgenerator.pane.crops.title",
  });
  const animalPane = windowPane.createSubPane({
    title: "sample.farmgenerator.pane.animals.title",
  });

  const commonSettings: CommonSettingsType = {
    farmWidth: makeObservable(10),
    farmLength: makeObservable(10),
    irrigation: makeObservable(false),
    fenceType: makeObservable(0),
  };

  const cropSettings: CropSettingsType = {
    wheat: makeObservable(false),
    pumpkin: makeObservable(false),
    potato: makeObservable(false),
    carrot: makeObservable(false),
    beetroot: makeObservable(false),
  };

  const animalSettings: AnimalSettingsType = {
    pig: makeObservable(false),
    sheep: makeObservable(false),
    cow: makeObservable(false),
  };

  const onExecuteGenerator = (ray?: Ray) => {
    const player: Player = uiSession.extensionContext.player;

    // Use the mouse ray if it is available
    const raycastResult =
      ray !== undefined
        ? player.dimension.getBlockFromRay(ray.location, ray.direction)
        : player.getBlockFromViewDirection();

    if (!raycastResult) {
      uiSession.log.error("No block from view vector");
      return;
    }
    const targetBlock = raycastResult.block;

    let targetCorner: Vector3 = { x: targetBlock.location.x, y: targetBlock.location.y, z: targetBlock.location.z };
    const possibleCrops: string[] = [];
    if (cropSettings.beetroot.value) {
      possibleCrops.push(MinecraftBlockTypes.Beetroot);
    }
    if (cropSettings.carrot.value) {
      possibleCrops.push(MinecraftBlockTypes.Carrots);
    }
    if (cropSettings.pumpkin.value) {
      possibleCrops.push(MinecraftBlockTypes.Pumpkin);
    }
    if (cropSettings.wheat.value) {
      possibleCrops.push(MinecraftBlockTypes.Wheat);
    }
    if (cropSettings.potato.value) {
      possibleCrops.push(MinecraftBlockTypes.Potatoes);
    }
    const possibleAnimals: MinecraftEntityTypes[] = [];
    if (animalSettings.sheep.value) {
      possibleAnimals.push(MinecraftEntityTypes.Sheep);
    }
    if (animalSettings.cow.value) {
      possibleAnimals.push(MinecraftEntityTypes.Cow);
    }
    if (animalSettings.pig.value) {
      possibleAnimals.push(MinecraftEntityTypes.Pig);
    }
    let x = 1;
    let z = 1;
    let length = commonSettings.farmLength.value;
    let width = commonSettings.farmWidth.value;
    if (Math.round(player.getViewDirection().z) === -1) {
      targetCorner = {
        x: targetCorner.x + (commonSettings.farmWidth.value / 2 - 1),
        y: targetCorner.y,
        z: targetCorner.z - (commonSettings.farmLength.value / 2 - 1),
      };
      uiSession.log.info("Facing north");
      x = -1;
    } else if (Math.round(player.getViewDirection().x) === 1) {
      targetCorner = {
        x: targetCorner.x + (commonSettings.farmWidth.value / 2 - 1),
        y: targetCorner.y,
        z: targetCorner.z + (commonSettings.farmLength.value / 2 - 1),
      };
      uiSession.log.info("Facing east");
      length = commonSettings.farmWidth.value;
      width = commonSettings.farmLength.value;
      x = -1;
      z = -1;
    }
    if (Math.round(player.getViewDirection().z) === 1) {
      targetCorner = {
        x: targetCorner.x - (commonSettings.farmWidth.value / 2 - 1),
        y: targetCorner.y,
        z: targetCorner.z + (commonSettings.farmLength.value / 2 - 1),
      };
      uiSession.log.info("Facing south");
      z = -1;
    } else if (Math.round(player.getViewDirection().x) === -1) {
      targetCorner = {
        x: targetCorner.x - (commonSettings.farmWidth.value / 2 - 1),
        y: targetCorner.y,
        z: targetCorner.z - (commonSettings.farmLength.value / 2 - 1),
      };
      uiSession.log.info("Facing west");
      length = commonSettings.farmWidth.value;
      width = commonSettings.farmLength.value;
    }
    buildFarm(targetCorner, x, z, length, width, possibleAnimals, possibleCrops, player, commonSettings);
  };

  // Create an action that will be executed on left mouse click
  const executeMouseAction = uiSession.actionManager.createAction({
    actionType: ActionTypes.MouseRayCastAction,
    onExecute: (mouseRay: Ray, mouseProps: MouseProps) => {
      if (mouseProps.mouseAction === MouseActionType.LeftButton && mouseProps.inputType === MouseInputType.ButtonDown) {
        onExecuteGenerator(mouseRay);
      }
    },
  });

  // Create and an action that will be executed on CTRL + P
  const executeKeyAction = uiSession.actionManager.createAction({
    actionType: ActionTypes.NoArgsAction,
    onExecute: () => {
      onExecuteGenerator();
    },
  });

  // Register actions as input bindings to tool context
  tool.registerKeyBinding(
    executeKeyAction,
    { key: KeyboardKey.KEY_P, modifier: InputModifier.Control },
    {
      uniqueId: "editorSamples:farmGenerator:place",
      label: "sample.farmgenerator.keyBinding.place",
    }
  );

  tool.registerMouseButtonBinding(executeMouseAction);

  windowPane.addNumber(commonSettings.farmLength, {
    title: "sample.farmgenerator.pane.length",
    min: 2,
    max: 20,
    isInteger: true,
  });
  windowPane.addNumber(commonSettings.farmWidth, {
    title: "sample.farmgenerator.pane.width",
    min: 2,
    max: 20,
    isInteger: true,
  });
  windowPane.addDropdown(commonSettings.fenceType, {
    title: "sample.farmgenerator.pane.fence",
    enable: true,
    entries: [
      {
        label: "Oak",
        value: 0,
      },
      {
        label: "Birch",
        value: 1,
      },
      {
        label: "Acacia",
        value: 2,
      },
      {
        label: "Bamboo",
        value: 3,
      },
      {
        label: "Cherry",
        value: 4,
      },
      {
        label: "Jungle",
        value: 5,
      },
      {
        label: "Spruce",
        value: 6,
      },
      {
        label: "Warped",
        value: 7,
      },
      {
        label: "Crimson",
        value: 8,
      },
    ],
  });

  windowPane.addBool(commonSettings.irrigation, {
    title: "sample.farmgenerator.pane.irrigation",
    tooltip: "sample.farmgenerator.pane.irrigation.tooltip",
  });
  cropPane.addBool(cropSettings.wheat, {
    title: "sample.farmgenerator.pane.crops.wheat",
  });
  cropPane.addBool(cropSettings.potato, {
    title: "sample.farmgenerator.pane.crops.potato",
  });
  cropPane.addBool(cropSettings.beetroot, {
    title: "sample.farmgenerator.pane.crops.beets",
  });
  cropPane.addBool(cropSettings.pumpkin, {
    title: "sample.farmgenerator.pane.crops.pumpkin",
  });
  cropPane.addBool(cropSettings.carrot, {
    title: "sample.farmgenerator.pane.crops.carrot",
  });
  animalPane.addBool(animalSettings.cow, {
    title: "sample.farmgenerator.pane.animals.cow",
  });
  animalPane.addBool(animalSettings.sheep, {
    title: "sample.farmgenerator.pane.animals.sheep",
  });
  animalPane.addBool(animalSettings.pig, {
    title: "sample.farmgenerator.pane.animals.pig",
  });

  tool.bindPropertyPane(windowPane);
}

/**
 * Create a new tool rail item for farm generator
 */
function addFarmGeneratorTool(uiSession: IPlayerUISession) {
  // Create action
  const toolToggleAction = uiSession.actionManager.createAction({
    actionType: ActionTypes.NoArgsAction,
    onExecute: () => {
      uiSession.toolRail.setSelectedToolId(tool.id);
    },
  });

  const tool = uiSession.toolRail.addTool(
    {
      title: "sample.farmgenerator.tool.title",
      icon: "pack://textures/farm-generator.png",
      tooltip: "sample.farmgenerator.tool.tooltip",
      inputContextId: "editorSamples:farmGenerator",
      inputContextLabel: "sample.farmgenerator.tool.title",
    },
    toolToggleAction
  );

  // Register a global shortcut (CTRL + SHIFT + P) to select the tool
  uiSession.inputManager.registerKeyBinding(
    EditorInputContext.GlobalToolMode,
    toolToggleAction,
    { key: KeyboardKey.KEY_F, modifier: InputModifier.Control | InputModifier.Shift },
    {
      uniqueId: "editorSamples:farmGenerator:toggleTool",
      label: "sample.farmgenerator.keyBinding.toggleTool",
    }
  );

  return tool;
}

/**
 * Register Farm Generator extension
 */
export function registerFarmGeneratorExtension() {
  registerEditorExtension(
    "FarmGenerator-sample",
    (uiSession: IPlayerUISession) => {
      uiSession.log.debug(`Initializing [${uiSession.extensionContext.extensionInfo.name}] extension`);

      // Add tool to tool rail
      const farmGeneratorTool = addFarmGeneratorTool(uiSession);

      // Create settings pane/window
      addFarmGeneratorSettingsPane(uiSession, farmGeneratorTool);

      return [];
    },
    (uiSession: IPlayerUISession) => {
      uiSession.log.debug(`Initializing [${uiSession.extensionContext.extensionInfo.name}] extension`);
    },
    {
      description: '"Farm Generator" Sample Extension',
      notes: "by Molly",
    }
  );
}
