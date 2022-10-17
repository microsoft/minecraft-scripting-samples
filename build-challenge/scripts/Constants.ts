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
export const PLAYER_DATA_STORAGE_SIZE = 8192;

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
  stone: 1,
  cobblestone: 1,
  granite: 1,
  polished_granite: 3,
  diorite: 1,
  polished_diorite: 3,
  grass_block: 1,
  coarse_dirt: 1,
  stone_slab: 8,
  double_stone_slab: 8,
  podzol: 1,
  planks: 3,
  sapling: 3,
  sand: 2,
  red_sand: 4,
  gravel: 1,
  gold_ore: 20,
  iron_ore: 10,
  coal_ore: 10,
  log: 6,
  log2: 6,
  leaves: 2,
  sponge: 5,
  glass: 6,
  lapis_ore: 11,
  lapis_block: 20,
  dispenser: 10,
  sandstone: 3,
  chiseled_sandstone: 4,
  cut_sandstone: 4,
  note_block: 12,
  powered_rail: 10,
  detector_rail: 10,
  sticky_piston: 10,
  cobweb: 5,
  grass: 2,
  fern: 2,
  dead_bush: 3,
  seagrass: 3,
  sea_pickle: 4,
  piston: 10,
  wool: 6,
  yellow_flower: 4,
  red_flower: 4,
  tallgrass: 4,
  bed: 8,
  golden_rail: 20,
  pistonarmcollision: 8,
  brown_mushroom: 5,
  red_mushroom: 5,
  gold_block: 100,
  iron_block: 70,
  brick_block: 30,
  tnt: 20,
  bookshelf: 30,
  obsidian: 60,
  torch: 12,
  fire: 3,
  mob_spawner: 20,
  oak_stairs: 7,
  chest: 20,
  redstone_wire: 6,
  diamond_ore: 40,
  diamond_block: 200,
  crafting_table: 30,
  wheat: 5,
  farmland: 10,
  furnace: 10,
  lit_furnace: 20,
  standing_sign: 16,
};
