// Copyright (c) Mojang AB.  All rights reserved.

import { registerEditorExtension } from '@minecraft/server-editor';

/**
 * Provides a sample extension registration function
 * @public
 */
export function registerEmptyExtension() {
    registerEditorExtension(
        'empty-template-sample',
        uiSession => {
            uiSession.log.debug(
                `Initializing extension [${uiSession.extensionContext.extensionInfo.name}] for player [${uiSession.extensionContext.player.name}]`
            );
            return [];
        },

        uiSession => {
            uiSession.log.debug(
                `Shutting down extension [${uiSession.extensionContext.extensionInfo.name}] for player [${uiSession.extensionContext.player.name}]`
            );
        },
        {
            description: 'Empty Sample Extension'
        }
    );
}
