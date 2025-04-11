// Copyright (c) Mojang AB.  All rights reserved.

import {
  ActionTypes,
  ColorPickerPropertyItemVariant,
  CursorTargetMode,
  IDropdownItem,
  IModalTool,
  IObservable,
  IPlayerUISession,
  makeObservable,
  ModalToolLifecycleEventPayload,
  MouseActionType,
  MouseInputType,
  MouseProps,
  registerEditorExtension,
  Selection,
} from "@minecraft/server-editor";
import {
  BlockVolume,
  BoundingBox,
  BoundingBoxUtils,
  RGBA,
  CompoundBlockVolumeAction,
  Dimension,
  Direction,
  EntityColorComponent,
  Player,
  Vector3,
  RGB,
} from "@minecraft/server";
import { Vector3Utils, VECTOR3_UP } from "@minecraft/math";

// Color identifiers expected by EntityColorComponent
enum EntityColor {
  White = 0,
  Orange = 1,
  Magenta = 2,
  LightBlue = 3,
  Yellow = 4,
  LightGreen = 5,
  Pink = 6,
  Gray = 7,
  Silver = 8,
  Cyan = 9,
  Purple = 10,
  Blue = 11,
  Brown = 12,
  Green = 13,
  Red = 14,
  Black = 15,
}

const directionLookup: Record<Direction, Vector3> = {
  [Direction.North]: { x: 0, y: 0, z: 1 },
  [Direction.East]: { x: -1, y: 0, z: 0 },
  [Direction.South]: { x: 0, y: 0, z: -1 },
  [Direction.West]: { x: 1, y: 0, z: 0 },
  [Direction.Up]: { x: 0, y: 1, z: 0 },
  [Direction.Down]: { x: 0, y: -1, z: 0 },
};

const directionToQuadrant: Record<Direction, number> = {
  [Direction.North]: 0,
  [Direction.East]: 1,
  [Direction.South]: 2,
  [Direction.West]: 3,
  [Direction.Up]: 4,
  [Direction.Down]: 5,
};

const quadrantToDirection: Record<number, Direction> = {
  [0]: Direction.North,
  [1]: Direction.East,
  [2]: Direction.South,
  [3]: Direction.West,
  [4]: Direction.Up,
  [5]: Direction.Down,
};

export function getRotationCorrectedDirection(rotationY: number, realDirection: Direction): Direction {
  if (realDirection === Direction.Up || realDirection === Direction.Down) {
    return realDirection;
  }
  const quadrant = directionToQuadrant[realDirection];
  const rotatedQuadrant = Math.floor(((rotationY + 405 + quadrant * 90) % 360) / 90);
  const rotatedDirection = quadrantToDirection[rotatedQuadrant];
  return rotatedDirection;
}

export function getRotationCorrectedDirectionVector(rotationY: number, realDirection: Direction): Vector3 {
  const relativeDirection = getRotationCorrectedDirection(rotationY, realDirection);
  return directionLookup[relativeDirection];
}

// Calculate nearest entity color to an RGBA color
function findClosestColor(targetColor: RGBA, colorPalette: Map<EntityColor, RGB>): EntityColor {
  let minDistance = Number.MAX_VALUE;
  let closestColor: EntityColor = EntityColor.White;

  colorPalette.forEach((paletteColor, color) => {
    const distance = Math.sqrt(
      Math.pow(targetColor.red - paletteColor.red, 2) +
        Math.pow(targetColor.green - paletteColor.green, 2) +
        Math.pow(targetColor.blue - paletteColor.blue, 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = color;
    }
  });

  return closestColor;
}

const colorPalette = new Map<EntityColor, RGB>([
  [EntityColor.White, { red: 1, green: 1, blue: 1 }],
  [EntityColor.Orange, { red: 0.95, green: 0.459, blue: 0 }],
  [EntityColor.Magenta, { red: 0.94, green: 0, blue: 0.9 }],
  [EntityColor.LightBlue, { red: 0, green: 0.85, blue: 0.95 }],
  [EntityColor.Yellow, { red: 0.85, green: 0.95, blue: 0 }],
  [EntityColor.LightGreen, { red: 0, green: 0.95, blue: 0.6 }],
  [EntityColor.Pink, { red: 0.9, green: 0.65, blue: 0.85 }],
  [EntityColor.Gray, { red: 0.6, green: 0.6, blue: 0.6 }],
  [EntityColor.Silver, { red: 0.75, green: 0.75, blue: 0.75 }],
  [EntityColor.Cyan, { red: 0, green: 0.9, blue: 0.9 }],
  [EntityColor.Purple, { red: 0.45, green: 0, blue: 0.9 }],
  [EntityColor.Blue, { red: 0, green: 0, blue: 1 }],
  [EntityColor.Brown, { red: 0.8, green: 0.5, blue: 0.1 }],
  [EntityColor.Green, { red: 0, green: 1, blue: 0 }],
  [EntityColor.Red, { red: 1, green: 0, blue: 0 }],
  [EntityColor.Black, { red: 0, green: 0, blue: 0 }],
]);

interface DyeBrushStorage {
  previewSelection: Selection;
  lastVolumePlaced?: BoundingBox;
  currentColor: EntityColor;
  brushColor: IObservable<RGBA>;
  brushSize: number;
}

type DyeBrushSession = IPlayerUISession<DyeBrushStorage>;

function onColorUpdated(newColor: RGBA, uiSession: DyeBrushSession) {
  if (uiSession.scratchStorage) {
    uiSession.scratchStorage.previewSelection.setFillColor(newColor);
    uiSession.scratchStorage.previewSelection.setOutlineColor({ ...newColor, alpha: 1 });
    const cursorProps = uiSession.extensionContext.cursor.getProperties();
    cursorProps.outlineColor = { ...newColor, alpha: 1 };
    cursorProps.targetMode = CursorTargetMode.Face;
    uiSession.extensionContext.cursor.setProperties(cursorProps);
  }
}

function addDyeBrushPane(uiSession: DyeBrushSession, tool: IModalTool) {
  if (!uiSession.scratchStorage) {
    throw Error("UI Session storage should exist");
  }
  const brushColor = uiSession.scratchStorage.brushColor;
  const brushSize = uiSession.scratchStorage.brushSize;

  const pane = uiSession.createPropertyPane({
    title: "sample.dyeBrush.pane.title",
  });

  const entityBrush = makeObservable(EntityColor.White);

  onColorUpdated(brushColor.value, uiSession);

  pane.addDropdown(entityBrush, {
    title: "Brush",
    entries: Object.values(EntityColor).reduce<IDropdownItem[]>((list, dye, index) => {
      if (typeof dye === "string") {
        list.push({
          label: dye,
          value: index,
        });
      }
      return list;
    }, []),
    onChange: (newVal: number) => {
      if (newVal in EntityColor) {
        const foundColor = colorPalette.get(newVal);
        if (foundColor) {
          brushColor.set({ ...foundColor, alpha: brushColor.value.alpha });
        }
        onColorUpdated(brushColor.value, uiSession);
      }
    },
  });

  pane.addColorPicker(brushColor, {
    variant: ColorPickerPropertyItemVariant.Expanded,
    onChange: (color: RGBA) => {
      entityBrush.set(findClosestColor(color, colorPalette));
      onColorUpdated(brushColor.value, uiSession);
    },
  });

  tool.bindPropertyPane(pane);

  const onExecuteBrush = () => {
    if (uiSession.scratchStorage === undefined) {
      uiSession.log.error("Storage was not initialized.");
      return;
    }

    const previewSelection = uiSession.scratchStorage.previewSelection;

    const player = uiSession.extensionContext.player;
    const targetBlock = player.dimension.getBlock(uiSession.extensionContext.cursor.getPosition());
    if (targetBlock === undefined) {
      return;
    }

    const rotationY = uiSession.extensionContext.player.getRotation().y;
    const directionRight = getRotationCorrectedDirectionVector(rotationY, Direction.East);
    const directionForward = getRotationCorrectedDirectionVector(rotationY, Direction.South);
    const relativeDirection = Vector3Utils.add(Vector3Utils.add(directionRight, directionForward), VECTOR3_UP);

    const sizeHalf = Math.floor(brushSize / 2);
    let fromOffset = Vector3Utils.scale(relativeDirection, -sizeHalf);
    const toOffset = Vector3Utils.scale(relativeDirection, brushSize - 1);

    const isEven = brushSize % 2 === 0;
    if (isEven) {
      fromOffset = Vector3Utils.add(fromOffset, VECTOR3_UP);
    }

    const location = targetBlock.location;
    const from: Vector3 = {
      x: location.x + fromOffset.x,
      y: location.y + fromOffset.y,
      z: location.z + fromOffset.z,
    };
    const to: Vector3 = { x: from.x + toOffset.x, y: from.y + toOffset.y, z: from.z + toOffset.z };

    const blockVolume = new BlockVolume(from, to);
    const bounds = blockVolume.getBoundingBox();
    if (uiSession.scratchStorage.lastVolumePlaced) {
      if (BoundingBoxUtils.equals(uiSession.scratchStorage.lastVolumePlaced, bounds)) {
        return;
      }
    }

    previewSelection.pushVolume({ action: CompoundBlockVolumeAction.Add, volume: blockVolume });
    uiSession.scratchStorage.lastVolumePlaced = bounds;
  };

  const mouseButtonAction = uiSession.actionManager.createAction({
    actionType: ActionTypes.MouseRayCastAction,
    onExecute: (_, mouseProps: MouseProps) => {
      if (uiSession.scratchStorage === undefined) {
        uiSession.log.error("Storage was not initialized.");
        return;
      }

      if (mouseProps.mouseAction === MouseActionType.LeftButton) {
        if (mouseProps.inputType === MouseInputType.ButtonDown) {
          uiSession.scratchStorage.previewSelection.clear();
          onExecuteBrush();
        } else if (mouseProps.inputType === MouseInputType.ButtonUp) {
          const player: Player = uiSession.extensionContext.player;
          const dimension: Dimension = player.dimension;
          const iterator = uiSession.scratchStorage.previewSelection.getBlockLocationIterator();
          for (const pos of iterator) {
            const entities = dimension.getEntities({ location: pos, closest: 1 });
            for (const entity of entities) {
              const colorComp = entity.getComponent("minecraft:color") as EntityColorComponent;
              if (colorComp) {
                colorComp.value = entityBrush.value;
              }
            }
          }
          uiSession.scratchStorage.previewSelection.clear();
        }
      }
    },
  });
  tool.registerMouseButtonBinding(mouseButtonAction);

  const executeBrushRayAction = uiSession.actionManager.createAction({
    actionType: ActionTypes.MouseRayCastAction,
    onExecute: (_, mouseProps: MouseProps) => {
      if (mouseProps.inputType === MouseInputType.Drag) {
        onExecuteBrush();
      }
    },
  });
  tool.registerMouseDragBinding(executeBrushRayAction);

  // Example for adding mouse wheel
  const executeBrushSizeAction = uiSession.actionManager.createAction({
    actionType: ActionTypes.MouseRayCastAction,
    onExecute: (_, mouseProps: MouseProps) => {
      if (mouseProps.mouseAction === MouseActionType.Wheel) {
        if (mouseProps.inputType === MouseInputType.WheelOut) {
          if (entityBrush.value > 0) {
            entityBrush.set(entityBrush.value - 1);
          }
        } else if (mouseProps.inputType === MouseInputType.WheelIn) {
          if (entityBrush.value < 15) {
            entityBrush.set(entityBrush.value + 1);
          }
        }
        onColorUpdated(brushColor.value, uiSession);
      }
    },
  });
  tool.registerMouseWheelBinding(executeBrushSizeAction);

  tool.onModalToolActivation.subscribe((evt: ModalToolLifecycleEventPayload) => {
    if (evt.isActiveTool) {
      onColorUpdated(brushColor.value, uiSession);
    }
    uiSession.scratchStorage?.previewSelection?.clear();
  });

  pane.hide();
}

export function addDyeBrushTool(uiSession: DyeBrushSession) {
  const tool = uiSession.toolRail.addTool({
    title: "sample.dyebrush.tool.title",
    tooltip: "sample.dyebrush.tool.tooltip",
    icon: "pack://textures/dye-brush.png",
  });

  return tool;
}

export function registerDyeBrushExtension() {
  registerEditorExtension<DyeBrushStorage>(
    "dye-brush-sample",

    (uiSession: IPlayerUISession<DyeBrushStorage>) => {
      uiSession.log.debug(`Initializing extension [${uiSession.extensionContext.extensionInfo.name}]`);

      const previewSelection = uiSession.extensionContext.selectionManager.create();
      previewSelection.visible = true;

      const storage: DyeBrushStorage = {
        previewSelection: previewSelection,
        currentColor: EntityColor.White,
        brushColor: makeObservable<RGBA>({ red: 1, green: 1, blue: 1, alpha: 0.5 }),
        brushSize: 4,
      };
      uiSession.scratchStorage = storage;

      const cubeBrushTool = addDyeBrushTool(uiSession);

      addDyeBrushPane(uiSession, cubeBrushTool);

      return [];
    },

    (uiSession: IPlayerUISession<DyeBrushStorage>) => {
      uiSession.log.debug(`Shutting down extension [${uiSession.extensionContext.extensionInfo.name}] `);
    },
    {
      description: '"Dye Brush" Sample Extension',
      notes: "By Eser",
    }
  );
}
