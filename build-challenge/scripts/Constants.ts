export const POST_INIT_TICK = 20;
export const TEAM_INIT_TICK = 40;
export const TEAM_SIZE_X = 6;
export const TEAM_SIZE_Z = 6;
export const PAD_SIZE_X = 32;
export const PAD_SIZE_Y = 64;
export const PAD_SIZE_Z = 32;
export const PAD_SURROUND_X = 32;
export const PAD_SURROUND_Z = 32;
export const AIRSPACE_GAP = 6;

export const TOTAL_X = TEAM_SIZE_X * PAD_SIZE_X + (TEAM_SIZE_X - 1) * PAD_SURROUND_X;
export const TOTAL_Y = PAD_SIZE_Y;
export const TOTAL_Z = TEAM_SIZE_Z * PAD_SIZE_Z + (TEAM_SIZE_Z - 1) * PAD_SURROUND_Z;

export const JOIN_TEAM_X = 3;
export const JOIN_TEAM_Y = 1;
export const JOIN_TEAM_Z = PAD_SIZE_Z + PAD_SURROUND_Z - 6;

export const TEAM_OPTIONS_X = 5;
export const TEAM_OPTIONS_Y = 1;
export const TEAM_OPTIONS_Z = PAD_SIZE_Z + PAD_SURROUND_Z - 6;

export const OPTIONS_AREA_TEAM_X = 2;
export const OPTIONS_AREA_TEAM_Y = 0;
export const OPTIONS_AREA_TEAM_Z = PAD_SIZE_Z + PAD_SURROUND_Z - 8;

export const SPAWN_TEAM_X = 2;
export const SPAWN_TEAM_Y = 1;
export const SPAWN_TEAM_Z = PAD_SIZE_Z + PAD_SURROUND_Z - 1;

export const MAX_SLOTS = 32;

export const BLOCK_SCORESHEET: { [type: string]: number } = {
  bedrock: 100,
  gold_ore: 10,
  iron_ore: 10,
  coal_ore: 10,
  log: 10,
  glass: 10,
  lapis_block: 10,
  sandstone: 10,
  noteblock: 10,
  bed: 10,
  tallgrass: 10,
  deadbush: 10,
  piston: 10,
  piston_head: 10,
  wool: 10,
  piston_extension: 10,
  yellow_flower: 10,
  red_flower: 10,
  gold_block: 10,
  iron_block: 10,
  double_stone_slab: 10,
  stone_slab: 10,
  brick_block: 10,
  tnt: 10,
  bookshelf: 10,
  mossy_cobblestone: 10,
  obsidian: 10,
  torch: 10,
  dirt: 2,
  stone: 3,
  cobblestone: 2,
  chest: 20,
};

export const ITEM_SCORESHEET: { [type: string]: number } = {
  dirt: 1,
  stone: 2,
  cobblestone: 1,
};
