// Copyright (c) Mojang AB.  All rights reserved.

import {
  BoolPropertyItemVariant,
  CursorTargetMode,
  IDisposable,
  ImageResourceType,
  IObservable,
  IRootPropertyPane,
  makeObservable,
  NumberPropertyItemVariant,
  Ray,
} from "@minecraft/server-editor";
import {
  IPlayerUISession,
  registerEditorExtension,
  IModalTool,
  ActionTypes,
  MouseProps,
  MouseActionType,
  MouseInputType,
  KeyboardKey,
  InputModifier,
  EditorInputContext,
  IPropertyPane,
} from "@minecraft/server-editor";
import { Vector3 } from "@minecraft/server";
import { MinecraftBlockTypes } from "@minecraft/vanilla-data";

enum PortalType {
  Nether = 0,
  End = 1,
}

enum PortalOrientation {
  X = 0,
  Z = 1,
}

type ExtensionStorage = {
  tool?: IModalTool;
};

type PortalGeneratorSession = IPlayerUISession<ExtensionStorage>;

type PaneSettingsType = {
  portalType: IObservable<number>;
  shouldReplaceFloor: IObservable<boolean>;
};

interface IPortalGenerator {
  set parentPane(value: IPropertyPane);

  subPane(uiSession: PortalGeneratorSession): IPropertyPane | undefined;

  activatePane(uiSession: PortalGeneratorSession): void;
  deactivatePane(): void;

  generatePortal(uiSession: PortalGeneratorSession): void;
}

class PortalGenerator implements IDisposable {
  private _netherPortal: NetherPortal;
  private _endPortal: EndPortal;
  private _activePortal?: IPortalGenerator;

  private _pane?: IRootPropertyPane;
  private _settings: PaneSettingsType = {
    portalType: makeObservable<number>(PortalType.Nether),
    shouldReplaceFloor: makeObservable(true),
  };

  constructor() {
    this._netherPortal = new NetherPortal();
    this._endPortal = new EndPortal();
  }

  public toolPane(uiSession: PortalGeneratorSession): IRootPropertyPane | undefined {
    if (!this._pane) {
      uiSession.log.error("Tool pane not initialized");
      return undefined;
    }
    return this._pane;
  }

  initialize(uiSession: PortalGeneratorSession, storage: ExtensionStorage) {
    // Create Action
    const toolToggleAction = uiSession.actionManager.createAction({
      actionType: ActionTypes.NoArgsAction,
      onExecute: () => {
        uiSession.toolRail.setSelectedToolId(tool.id);
      },
    });

    // Add the extension to the tool rail and give it an icon
    const tool = uiSession.toolRail.addTool("editorSample:portalTool", {
      title: "sample.portalgenerator.title",
      icon: "pack://textures/portal-generator.png",
      tooltip: "sample.portalgenerator.tooltip",
      action: toolToggleAction,
    });

    // Register a global shortcut (CTRL + SHIFT + P) to select the tool
    uiSession.inputManager.registerKeyBinding(
      EditorInputContext.GlobalToolMode,
      toolToggleAction,
      { key: KeyboardKey.KEY_P, modifier: InputModifier.Control | InputModifier.Shift },
      {
        uniqueId: "editorSamples:portalGenerator:toggleTool",
        label: "sample.portalgenerator.keyBinding.toggleTool",
      }
    );

    // Create an action that will be executed on left mouse click
    const executeMouseAction = uiSession.actionManager.createAction({
      actionType: ActionTypes.MouseRayCastAction,
      onExecute: (_mouseRay: Ray, mouseProps: MouseProps) => {
        if (
          mouseProps.mouseAction === MouseActionType.LeftButton &&
          mouseProps.inputType === MouseInputType.ButtonDown &&
          this._activePortal
        ) {
          this._activePortal.generatePortal(uiSession);
        }
      },
    });
    tool.registerMouseButtonBinding(executeMouseAction);

    storage.tool = tool;

    // Build the UI components (and the sub pane with the options)
    this.buildPane(uiSession);

    if (this._pane) {
      tool.bindPropertyPane(this._pane);
      this.activatePortalGenerator(uiSession, this._settings.portalType.value);
    }
  }

  teardown(): void {}

  buildPane(uiSession: PortalGeneratorSession) {
    const pane = uiSession.createPropertyPane({
      title: "sample.portalgenerator.pane.title",
    });

    pane.addBool(this._settings.shouldReplaceFloor, {
      title: "sample.portalgenerator.pane.replacefloor",
      onChange: (current: boolean) => {
        const targetMode = current ? CursorTargetMode.Block : CursorTargetMode.Face;
        uiSession.extensionContext.cursor.setProperties({ targetMode });
      },
      variant: BoolPropertyItemVariant.ToggleSwitch,
    });

    pane.addDropdown(this._settings.portalType, {
      title: "sample.portalgenerator.pane.portaltype",
      entries: [
        {
          label: "sample.portalgenerator.pane.portaltype.nether",
          value: PortalType.Nether,
          imageData: { path: "portal", type: ImageResourceType.Block },
        },
        {
          label: "sample.portalgenerator.pane.portaltype.end",
          value: PortalType.End,
          imageData: { path: "enderEyeIcon", type: ImageResourceType.Icon },
        },
      ],
      onChange: (newValue: number) => {
        this.activatePortalGenerator(uiSession, newValue);
      },
    });

    this._pane = pane;
    this._endPortal.parentPane = pane;
    this._netherPortal.parentPane = pane;
  }

  activatePortalGenerator(uiSession: PortalGeneratorSession, portalType: PortalType): void {
    this._pane?.hide();

    if (this._activePortal) {
      this._activePortal.deactivatePane();
    }

    if (portalType === PortalType.Nether) {
      this._activePortal = this._netherPortal;
    } else {
      this._activePortal = this._endPortal;
    }

    this._activePortal.activatePane(uiSession);

    this._pane?.show();
  }
}

class NetherPortal implements IPortalGenerator {
  private _pane?: IPropertyPane;
  private _parentPane?: IPropertyPane;

  // Settings
  private _sizeX: IObservable<number> = makeObservable(4);
  private _sizeY: IObservable<number> = makeObservable(5);
  private _percentComplete: IObservable<number> = makeObservable(100);
  private _orientation: IObservable<number> = makeObservable(PortalOrientation.X);
  private _hasCorners: IObservable<boolean> = makeObservable(true);

  constructor() {}

  public subPane(uiSession: PortalGeneratorSession): IPropertyPane | undefined {
    if (!this._pane) {
      uiSession.log.error("Sub pane not initialized");
      return undefined;
    }
    return this._pane;
  }

  public set parentPane(value: IPropertyPane) {
    this._parentPane = value;
  }

  activatePane(uiSession: PortalGeneratorSession): void {
    if (this._pane) {
      this.deactivatePane();
    }

    this._pane = this.buildSubPane(uiSession);
    this._pane?.show();
  }

  deactivatePane(): void {
    if (this._pane) {
      this._pane.hide();
      this._parentPane?.removeSubPane(this._pane);
    }

    this._pane = undefined;
  }

  buildSubPane(uiSession: PortalGeneratorSession): IPropertyPane | undefined {
    const windowPane = this._parentPane;
    if (!windowPane) {
      uiSession.log.error("Failed to find window binding");
      return undefined;
    }

    const subPane = windowPane.createSubPane({
      title: "sample.portalgenerator.pane.nether.pane.title",
    });

    subPane.addDropdown(this._orientation, {
      title: "sample.portalgenerator.pane.nether.pane.orientation",
      entries: [
        {
          label: "sample.portalgenerator.pane.nether.pane.orientation.x",
          value: PortalOrientation.X,
        },
        {
          label: "sample.portalgenerator.pane.nether.pane.orientation.y",
          value: PortalOrientation.Z,
        },
      ],
    });

    subPane.addNumber(this._sizeX, {
      title: "sample.portalgenerator.pane.nether.pane.width",
      min: 4,
      max: 23,
      isInteger: true,
    });

    subPane.addNumber(this._sizeY, {
      title: "sample.portalgenerator.pane.nether.pane.height",
      min: 5,
      max: 23,
      isInteger: true,
    });

    subPane.addBool(this._hasCorners, {
      title: "sample.portalgenerator.pane.nether.pane.corners",
      tooltip: "sample.portalgenerator.pane.nether.pane.corners.tooltip",
    });

    subPane.addNumber(this._percentComplete, {
      title: "sample.portalgenerator.pane.nether.pane.percentage",
      min: 0,
      max: 100,
      variant: NumberPropertyItemVariant.InputFieldAndSlider,
    });

    return subPane;
  }

  generatePortal(uiSession: PortalGeneratorSession): void {
    const me = uiSession.extensionContext.player;
    const location = uiSession.extensionContext.cursor.getPosition();

    const targetBlock = me.dimension.getBlock(location);
    if (targetBlock === undefined) {
      uiSession.log.warning("No block selected");
      return;
    }

    if (this._percentComplete.value === 0) {
      return;
    }

    if (me.dimension.id.endsWith("the_end")) {
      uiSession.log.warning("You cannot create a nether portal in the end");
      return;
    }

    uiSession.extensionContext.transactionManager.openTransaction("Transaction group portal generator");

    let from: Vector3 = location;
    let to: Vector3 = { x: 0, y: 0, z: 0 };

    if (this._orientation.value === PortalOrientation.X) {
      to = {
        x: location.x + this._sizeX.value,
        y: location.y + this._sizeY.value,
        z: location.z,
      };
    } else if (this._orientation.value === PortalOrientation.Z) {
      to = {
        x: location.x,
        y: location.y + this._sizeY.value,
        z: location.z + this._sizeX.value,
      };
    } else {
      uiSession.log.error("Failed to get valid orientation");
      uiSession.extensionContext.transactionManager.discardOpenTransaction();
      return;
    }

    const yEnd = this._sizeY.value - 1;
    const xEnd = this._sizeX.value - 1;
    uiSession.extensionContext.transactionManager.trackBlockChangeArea(from, to);
    for (let y = 0; y < this._sizeY.value; ++y) {
      for (let x = 0; x < this._sizeX.value; ++x) {
        let block = MinecraftBlockTypes.Air;

        // Percent complete is randomized percentage
        if (this._percentComplete.value !== 100) {
          const randVal = getRandomInt(100);
          if (this._percentComplete.value - randVal < 0) {
            continue;
          }
        }

        // Set as obsidian for bottom, top, and edges of portal
        if (
          !this._hasCorners.value &&
          ((y === 0 && x === 0) || (y === 0 && x === xEnd) || (y === yEnd && x === xEnd) || (y === yEnd && x === 0))
        ) {
          continue; // no corners
        } else if (y === 0 || y === yEnd || x === 0 || x === xEnd) {
          block = MinecraftBlockTypes.Obsidian;
        } else {
          continue;
        }

        const loc: Vector3 =
          this._orientation.value === PortalOrientation.X
            ? { x: location.x + x, y: location.y + y, z: location.z }
            : { x: location.x, y: location.y + y, z: location.z + x };

        me.dimension.getBlock(loc)?.setType(block);
      }
    }

    let ori = "x";
    if (this._orientation.value === PortalOrientation.Z) {
      ori = "z";
      from = { x: location.x, y: location.y + 1, z: location.z + 1 };
      to = {
        x: location.x,
        y: location.y + this._sizeY.value - 2,
        z: location.z + this._sizeX.value - 2,
      };
    } else {
      from = { x: location.x + 1, y: location.y + 1, z: location.z };
      to = {
        x: location.x + this._sizeX.value - 2,
        y: location.y + this._sizeY.value - 2,
        z: location.z,
      };
    }

    if (this._percentComplete.value === 100) {
      // We must fill the portals as it must have the axis set while setting the type
      // or the engine will destroy the block and the scripting API wont allow both in one operation
      me.dimension.runCommand(
        `FILL ${from.x} ${from.y} ${from.z} ${to.x} ${to.y} ${to.z} portal ["portal_axis":"${ori}"]`
      );
    }

    uiSession.extensionContext.transactionManager.commitOpenTransaction();
  }
}

class EndPortal implements IPortalGenerator {
  private _pane?: IPropertyPane;
  private _parentPane?: IPropertyPane;

  // Settings
  private _filledEyeCount: IObservable<number> = makeObservable(12);

  constructor() {}

  public subPane(uiSession: PortalGeneratorSession): IPropertyPane | undefined {
    if (!this._pane) {
      uiSession.log.error("Sub pane not initialized");
      return undefined;
    }
    return this._pane;
  }

  public set parentPane(value: IPropertyPane) {
    this._parentPane = value;
  }

  activatePane(uiSession: PortalGeneratorSession): void {
    if (this._pane) {
      this.deactivatePane();
    }

    this._pane = this.buildSubPane(uiSession);
    this._pane?.show();
  }

  deactivatePane(): void {
    if (this._pane) {
      this._pane.hide();
      this._parentPane?.removeSubPane(this._pane);
    }

    this._pane = undefined;
  }

  buildSubPane(uiSession: PortalGeneratorSession): IPropertyPane | undefined {
    const windowPane = this._parentPane;
    if (!windowPane) {
      uiSession.log.error("Failed to find window pane");
      return undefined;
    }

    const subPane = windowPane.createSubPane({
      title: "sample.portalgenerator.pane.end.pane.title",
    });

    subPane.addNumber(this._filledEyeCount, {
      title: "sample.portalgenerator.pane.end.pane.filledcount",
      min: 0,
      max: 12,
      variant: NumberPropertyItemVariant.InputFieldAndSlider,
      isInteger: true,
    });

    return subPane;
  }

  generatePortal(uiSession: PortalGeneratorSession): void {
    const me = uiSession.extensionContext.player;
    const location = uiSession.extensionContext.cursor.getPosition();

    const targetBlock = me.dimension.getBlock(location);
    if (targetBlock === undefined) {
      uiSession.log.error("No block selected");
      return;
    }

    uiSession.extensionContext.transactionManager.openTransaction("Transaction group portal generator");

    const from: Vector3 = { x: location.x, y: location.y, z: location.z };
    const to: Vector3 = { x: location.x + 4, y: location.y, z: location.z + 4 };

    let eyesToUse: boolean[] = [false, false, false, false, false, false, false, false, false, false, false, false];
    if (this._filledEyeCount.value === 12) {
      eyesToUse = [true, true, true, true, true, true, true, true, true, true, true, true];
    } else if (this._filledEyeCount.value !== 0) {
      const possibleEyeLocs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      for (let i = 0; i < this._filledEyeCount.value; ++i) {
        const rand = Math.floor(Math.random() * possibleEyeLocs.length);
        eyesToUse[possibleEyeLocs[rand]] = true;
        possibleEyeLocs.splice(rand, 1);
      }
    }

    let i = 0;
    uiSession.extensionContext.transactionManager.trackBlockChangeArea(from, to);

    for (let z = 0; z < 5; ++z) {
      for (let x = 0; x < 5; ++x) {
        let rot = 0;
        let blockType = MinecraftBlockTypes.Air;
        if (x === 0 && z !== 0 && z !== 4) {
          // west edge
          blockType = MinecraftBlockTypes.EndPortalFrame;
          rot = 3;
        } else if (x === 4 && z !== 0 && z !== 4) {
          // east edge
          blockType = MinecraftBlockTypes.EndPortalFrame;
          rot = 1;
        } else if (z === 0 && x !== 0 && x !== 4) {
          // south edge
          blockType = MinecraftBlockTypes.EndPortalFrame;
          rot = 0;
        } else if (z === 4 && x !== 0 && x !== 4) {
          // north edge
          blockType = MinecraftBlockTypes.EndPortalFrame;
          rot = 2;
        } else if (this._filledEyeCount.value === 12 && x >= 1 && z >= 1 && x <= 3 && z <= 3) {
          // center
          blockType = MinecraftBlockTypes.EndPortal;
        } else {
          continue;
        }

        const block = me.dimension.getBlock({ x: location.x + x, y: location.y, z: location.z + z });

        if (block) {
          block.setType(blockType);
          if (blockType === MinecraftBlockTypes.EndPortalFrame) {
            const perm = block.permutation.withState("direction", rot).withState("end_portal_eye_bit", eyesToUse[i]);
            block.setPermutation(perm);
            i += 1;
          }
        } else {
          uiSession.log.error("Failed to get block");
        }
      }
    }

    uiSession.extensionContext.transactionManager.commitOpenTransaction();
  }
}

function getRandomInt(upper: number) {
  return Math.ceil(Math.random() * (upper + 1));
}

/**
 * Register Portal Generator extension
 */
export function registerPortalGeneratorExtension() {
  registerEditorExtension<ExtensionStorage>(
    "portal-generator-sample",
    (uiSession) => {
      uiSession.log.debug(`Initializing [${uiSession.extensionContext.extensionInfo.name}] extension`);

      uiSession.scratchStorage = {};

      const generator = new PortalGenerator();
      generator.initialize(uiSession, uiSession.scratchStorage);

      return [generator];
    },
    (uiSession) => {
      uiSession.log.debug(`Shutting down [${uiSession.extensionContext.extensionInfo.name}] extension`);
    },
    {
      description: '"Portal Generator" Sample Extension',
      notes: "by Andrew",
    }
  );
}
