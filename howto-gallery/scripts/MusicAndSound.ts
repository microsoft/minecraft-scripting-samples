import { DimensionLocation, MusicOptions, PlayerSoundOptions, world, WorldSoundOptions } from "@minecraft/server";

/**
 * Plays some music and sound effects.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/world#playmusic
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/world#playsound
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/player#playsound
 */
export function playMusicAndSound(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const players = world.getPlayers();

  const musicOptions: MusicOptions = {
    fade: 0.5,
    loop: true,
    volume: 1.0,
  };
  world.playMusic("music.menu", musicOptions);

  const worldSoundOptions: WorldSoundOptions = {
    pitch: 0.5,
    volume: 4.0,
  };
  world.playSound("ambient.weather.thunder", targetLocation, worldSoundOptions);

  const playerSoundOptions: PlayerSoundOptions = {
    pitch: 1.0,
    volume: 1.0,
  };

  players[0].playSound("bucket.fill_water", playerSoundOptions);
}
