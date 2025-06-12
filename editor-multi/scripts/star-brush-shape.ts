// Copyright (c) Mojang AB.  All rights reserved.

import {
    BlockVolume,
    CompoundBlockVolume,
    CompoundBlockVolumeAction,
    CompoundBlockVolumePositionRelativity,
} from '@minecraft/server';
import { IPlayerUISession, registerEditorExtension, SettingsUIElement } from '@minecraft/server-editor';

type Settings = {
    radius: number;
    includeVertical: boolean;
};

const MIN_RADIUS = 1;
const MAX_RADIUS = 12;

/**
 * Register Star Brush extension
 */
export function registerStarBrushExtension() {
    registerEditorExtension(
        'StarBrush',
        (uiSession: IPlayerUISession) => {
            uiSession.log.debug(`Initializing ${uiSession.extensionContext.extensionInfo.name}`);

            const settings: Settings = {
                radius: 3,
                includeVertical: true,
            };

            const rebuildStar = () => {
                const compoundVolume = new CompoundBlockVolume();

                // center
                compoundVolume.pushVolume({
                    action: CompoundBlockVolumeAction.Add,
                    locationRelativity: CompoundBlockVolumePositionRelativity.Relative,
                    volume: new BlockVolume({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }),
                });

                if (settings.radius > 1) {
                    const r = settings.radius;

                    // left
                    compoundVolume.pushVolume({
                        action: CompoundBlockVolumeAction.Add,
                        locationRelativity: CompoundBlockVolumePositionRelativity.Relative,
                        volume: new BlockVolume({ x: -r, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }),
                    });

                    // right
                    compoundVolume.pushVolume({
                        action: CompoundBlockVolumeAction.Add,
                        locationRelativity: CompoundBlockVolumePositionRelativity.Relative,
                        volume: new BlockVolume({ x: 0, y: 0, z: 0 }, { x: r, y: 0, z: 0 }),
                    });

                    // front
                    compoundVolume.pushVolume({
                        action: CompoundBlockVolumeAction.Add,
                        locationRelativity: CompoundBlockVolumePositionRelativity.Relative,
                        volume: new BlockVolume({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: r }),
                    });

                    // back
                    compoundVolume.pushVolume({
                        action: CompoundBlockVolumeAction.Add,
                        locationRelativity: CompoundBlockVolumePositionRelativity.Relative,
                        volume: new BlockVolume({ x: 0, y: 0, z: -r }, { x: 0, y: 0, z: 0 }),
                    });

                    if (settings.includeVertical) {
                        // up
                        compoundVolume.pushVolume({
                            action: CompoundBlockVolumeAction.Add,
                            locationRelativity: CompoundBlockVolumePositionRelativity.Relative,
                            volume: new BlockVolume({ x: 0, y: 0, z: 0 }, { x: 0, y: r, z: 0 }),
                        });

                        // down
                        compoundVolume.pushVolume({
                            action: CompoundBlockVolumeAction.Add,
                            locationRelativity: CompoundBlockVolumePositionRelativity.Relative,
                            volume: new BlockVolume({ x: 0, y: 0, z: 0 }, { x: 0, y: -r, z: 0 }),
                        });
                    }
                }

                return compoundVolume;
            };

            const getStarUISettings = (): SettingsUIElement[] => {
                return [
                    new SettingsUIElement(
                        'Radius',
                        settings.radius,
                        arg => {
                            if (arg !== undefined && typeof arg === 'number') {
                                settings.radius = arg;
                            }
                        },
                        {
                            min: MIN_RADIUS,
                            max: MAX_RADIUS,
                        }
                    ),
                    new SettingsUIElement(
                        'includeVertical',
                        settings.includeVertical,
                        arg => {
                            if (arg !== undefined && typeof arg === 'boolean') {
                                settings.includeVertical = arg;
                            }
                        },
                        { refreshOnChange: true }
                    ),
                    new SettingsUIElement('Vector3', { x: 1, y: 2, z: 3 }, _value => {}),
                ];
            };

            uiSession.extensionContext.brushShapeManager.registerBrushShape(
                'Star-sample',
                'star',
                rebuildStar,
                getStarUISettings
            );

            return [];
        },
        (uiSession: IPlayerUISession) => {
            uiSession.log.debug(`Uninitializing ${uiSession.extensionContext.extensionInfo.name}`);
        },
        {
            description: 'Star brush shape sample extension',
            notes: 'An example of registering a custom brush shape.',
        }
    );
}
