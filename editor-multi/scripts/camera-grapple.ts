// Copyright (c) Mojang AB.  All rights reserved.

import { Vector3Utils } from "@minecraft/math";
import {
  ActionTypes,
  CursorControlMode,
  EditorInputContext,
  IPlayerUISession,
  KeyboardKey,
  registerEditorExtension,
} from "@minecraft/server-editor";
import { EasingType, TicksPerSecond, Vector3, system } from "@minecraft/server";

interface GrappleStorage {
  latestRunId?: number;
}

type GrappleSession = IPlayerUISession<GrappleStorage>;

function flyCameraToTarget(uiSession: GrappleSession, viewTarget: Vector3, radius: number) {
  if (uiSession.scratchStorage) {
    const player = uiSession.extensionContext.player;
    // This is imperfect and causes a visible pop.  Would be better if we could get the player's exact eye height
    const eyeHeight = Vector3Utils.subtract(player.getHeadLocation(), player.location);
    const viewVector = player.getViewDirection();
    radius = Math.max(radius, 1);
    // FOV in first_person.json is 66 degrees
    const halfFOV = 66 / 2;
    // Compute adjacent side of triangle (distance) when opposite side is radius
    const distanceAway = radius / Math.tan((halfFOV * Math.PI) / 180);
    const destCameraLocation = Vector3Utils.subtract(viewTarget, Vector3Utils.scale(viewVector, distanceAway));
    const destPlayerLocation = Vector3Utils.subtract(destCameraLocation, eyeHeight);
    const easeTimeInSeconds = 1.5;
    // Unhook camera and have it start moving to the new location
    player.camera.setCamera("minecraft:free", {
      rotation: { x: player.getRotation().x, y: player.getRotation().y },
      location: { x: destCameraLocation.x, y: destCameraLocation.y, z: destCameraLocation.z },
      easeOptions: {
        easeTime: easeTimeInSeconds,
        easeType: EasingType.InOutQuad,
      },
    });
    uiSession.scratchStorage.latestRunId = system.runTimeout(() => {
      // Move the player to the final location and re-hook the camera to it
      player.teleport(destPlayerLocation);
      player.camera.clear();
    }, easeTimeInSeconds * TicksPerSecond);
  }
}
/**
 * Provides a "Grapple" extension for quickly moving the player around the world
 * @beta
 */
export function registerCameraGrapple() {
  registerEditorExtension(
    "camera-grapple-sample",
    (uiSession: GrappleSession) => {
      uiSession.log.debug(`Initializing extension [${uiSession.extensionContext.extensionInfo.name}]`);

      const grappleAction = uiSession.actionManager.createAction({
        actionType: ActionTypes.NoArgsAction,
        onExecute: () => {
          // don't execute if there is already a command running as this can be visually disorienting
          if (uiSession.scratchStorage?.latestRunId) {
            return;
          }
          let destBlockLoc: Vector3 | undefined = undefined;
          const cursor = uiSession.extensionContext.cursor;

          // Fixed cursor mode will default to the player view direction
          if (cursor.isVisible && cursor.getProperties().controlMode !== CursorControlMode.Fixed) {
            destBlockLoc = cursor.getPosition();
          } else {
            const result = uiSession.extensionContext.player.getBlockFromViewDirection();
            if (!result) {
              uiSession.log.warning("No Block Found.  Aborting Grapple");
              return;
            }
            destBlockLoc = result?.block.location;
          }

          // Location of the center of the block
          const viewTarget = Vector3Utils.add(destBlockLoc, { x: 0.5, y: 0.5, z: 0.5 });
          flyCameraToTarget(uiSession, viewTarget, 2);
        },
      });

      const frameAction = uiSession.actionManager.createAction({
        actionType: ActionTypes.NoArgsAction,
        onExecute: () => {
          // don't execute if there is already a command running as this can be visually disorienting
          if (uiSession.scratchStorage?.latestRunId) {
            return;
          }
          const selection = uiSession.extensionContext.selectionManager.selection;
          if (selection.isEmpty) {
            return;
          }

          const bounds = selection.getBoundingBox();
          bounds.max = Vector3Utils.add(bounds.max, { x: 1, y: 1, z: 1 });
          const halfSize = Vector3Utils.scale(Vector3Utils.subtract(bounds.max, bounds.min), 0.5);
          const viewTarget = Vector3Utils.add(bounds.min, halfSize);
          const radius = Math.sqrt(halfSize.x * halfSize.x + halfSize.y * halfSize.y + halfSize.z * halfSize.z);

          flyCameraToTarget(uiSession, viewTarget, radius);
        },
      });

      uiSession.inputManager.registerKeyBinding(
        EditorInputContext.GlobalToolMode,
        grappleAction,
        { key: KeyboardKey.KEY_Y },
        {
          uniqueId: "editorSamples:grapple:flyToCursor",
          label: "sample.cameragrapple.keyBinding.flyToCursor",
        }
      );
      uiSession.inputManager.registerKeyBinding(
        EditorInputContext.GlobalToolMode,
        frameAction,
        { key: KeyboardKey.KEY_H },
        {
          uniqueId: "editorSamples:grapple:flyToSelection",
          label: "sample.cameragrapple.keyBinding.flyToSelection",
        }
      );

      return [];
    },
    (uiSession: GrappleSession) => {
      uiSession.log.debug(
        `Shutting down extension [${uiSession.extensionContext.extensionInfo.name}] for player [${uiSession.extensionContext.player.name}]`
      );
      if (uiSession.scratchStorage?.latestRunId) {
        system.clearRun(uiSession.scratchStorage.latestRunId);
        uiSession.scratchStorage.latestRunId = undefined;
      }
    },
    {
      description: '"Camera Grapple" Sample Extension',
      notes: "by Jonas",
    }
  );
}
