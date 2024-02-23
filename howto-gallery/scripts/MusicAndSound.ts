// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as mc from "@minecraft/server";

/**
 * Plays some music and sound effects.
 * This sample uses only stable APIs.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/world#playmusic
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/world#playsound
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/player#playsound
 */
export function playMusicAndSound(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  let players = mc.world.getPlayers();

  const musicOptions: mc.MusicOptions = {
    fade: 0.5,
    loop: true,
    volume: 1.0,
  };
  mc.world.playMusic("music.menu", musicOptions);

  const worldSoundOptions: mc.WorldSoundOptions = {
    pitch: 0.5,
    volume: 4.0,
  };
  mc.world.playSound("ambient.weather.thunder", targetLocation, worldSoundOptions);

  const playerSoundOptions: mc.PlayerSoundOptions = {
    pitch: 1.0,
    volume: 1.0,
  };

  players[0].playSound("bucket.fill_water", playerSoundOptions);
}
