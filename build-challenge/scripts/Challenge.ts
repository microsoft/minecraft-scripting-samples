import Team from "./Team.js";
import {
  world,
  system,
  PlayerJoinAfterEvent,
  PlayerSpawnAfterEvent,
  PlayerLeaveAfterEvent,
  LeverActionAfterEvent,
  TitleDisplayOptions,
  Player,
  BlockInventoryComponent,
  ChatSendBeforeEvent,
  PropertyRegistry,
  MinecraftBlockTypes,
  MinecraftEntityTypes,
  DynamicPropertiesDefinition,
  WorldSoundOptions,
  Vector,
} from "@minecraft/server";
import ChallengePlayer, { ChallengePlayerRole, IPlayerData } from "./ChallengePlayer.js";
import Log from "./Log.js";
import {
  AIRSPACE_GAP,
  JOIN_TEAM_X,
  JOIN_TEAM_Y,
  JOIN_TEAM_Z,
  MAX_SLOTS as MAX_SLOTS,
  PAD_SIZE_X,
  PAD_SIZE_Y,
  PAD_SIZE_Z,
  POST_INIT_TICK,
  BLOCK_SCORESHEET as BLOCK_SCORESHEET,
  TEAM_INIT_TICK,
  TEAM_SIZE_X,
  TEAM_SIZE_Z,
  TOTAL_X,
  TOTAL_Y,
  TOTAL_Z,
  ITEM_SCORESHEET,
  TEAM_OPTIONS_X,
  TEAM_OPTIONS_Y,
  TEAM_OPTIONS_Z,
  PAD_SURROUND_X,
  PAD_SURROUND_Z,
  PLAYER_DATA_STORAGE_SIZE,
  STANDARD_TRACK_TIME,
  MAX_PLAYERS_TEAM,
  MAX_TIME_TO_SWITCH_TEAMS_TICK,
} from "./Constants.js";
import Utilities from "./Utilities.js";
import Track from "./Track.js";

export enum ChallengePhase {
  setup = 1,
  pre = 2,
  build = 3,
  vote = 4,
  post = 5,
}

export enum ChallengeBoardSize {
  small = 4,
  medium = 8,
  large = 16,
  xtralarge = 32,
}

export default class Challenge {
  nwbLocation = { x: 0, y: 0, z: 0 }; // nwb = north west bottom
  teams: Team[] = [];
  tracks: Track[] = [];
  totalTrackTime = 0;
  tickIndex = 0;
  challengePlayers: { [name: string]: ChallengePlayer } = {};
  #phase: ChallengePhase = ChallengePhase.pre;
  #size: ChallengeBoardSize = ChallengeBoardSize.small;
  #motdTitle: string = "Build Challenge";
  #motdSubtitle: string = "A place to showcase your build skills";
  refreshTeamIter = 0;
  clearTeamIter = 0;

  activeTeamScore = -1;

  get phase() {
    return this.#phase;
  }

  set phase(newPhase: number) {
    if (this.#phase !== newPhase) {
      let oldPhase = this.#phase;
      this.#phase = newPhase;

      this.applyPhase();

      // update pads to add or remove the vote pedestal
      if (oldPhase === ChallengePhase.vote || newPhase === ChallengePhase.vote) {
        this.refreshTeamIter = 0;

        this.refreshTeam();
      }

      this.save();
    }
  }

  get size() {
    return this.#size;
  }

  set size(newSize: ChallengeBoardSize) {
    if (newSize > this.#size) {
      this.save();

      this.sendToAllPlayers("Extending team size: " + newSize);

      this.clearTeamIter = this.#size;
      system.run(this.clearTeamArea);

      this.#size = newSize;

      this.initTeams();
      this.loadTeams();

      this.save();
    }
  }

  get motdTitle() {
    return this.#motdTitle;
  }

  set motdTitle(newMotdTitle: string) {
    if (newMotdTitle.length < 1 || newMotdTitle.length > 40 || newMotdTitle == this.#motdTitle) {
      return;
    }

    this.#motdTitle = newMotdTitle;
    this.save();
  }

  get motdSubtitle() {
    return this.#motdSubtitle;
  }

  set motdSubtitle(newMotdSubtitle: string) {
    if (newMotdSubtitle.length < 1 || newMotdSubtitle.length > 40 || newMotdSubtitle == this.#motdSubtitle) {
      return;
    }

    this.#motdSubtitle = newMotdSubtitle;
    this.save();
  }

  constructor() {
    this.tick = this.tick.bind(this);
    this.playerSpawnedFirstTime = this.playerSpawnedFirstTime.bind(this);
    this.playerLeft = this.playerLeft.bind(this);
    this.leverActivate = this.leverActivate.bind(this);
    this.beforeChat = this.beforeChat.bind(this);
    this.refreshTeam = this.refreshTeam.bind(this);
    this.clearTeamArea = this.clearTeamArea.bind(this);
    this.postInit = this.postInit.bind(this);
    this.continueInit = this.continueInit.bind(this);
    this.continueInit2 = this.continueInit2.bind(this);
    this.applyPhase = this.applyPhase.bind(this);
    this.updateMetaBonuses = this.updateMetaBonuses.bind(this);
    this.refreshTeamScores = this.refreshTeamScores.bind(this);
    this.clearPads = this.clearPads.bind(this);
  }

  save() {
    world.setDynamicProperty("challenge:phase", this.#phase);
    world.setDynamicProperty("challenge:size", this.#size);
    world.setDynamicProperty("challenge:motdTitle", this.#motdTitle);
    world.setDynamicProperty("challenge:motdSubtitle", this.#motdSubtitle);
    world.setDynamicProperty("challenge:nwbX", this.nwbLocation.x);
    world.setDynamicProperty("challenge:nwbY", this.nwbLocation.y);
    world.setDynamicProperty("challenge:nwbZ", this.nwbLocation.z);

    let data = [];

    for (let i = 0; i < this.teams.length; i++) {
      data.push(this.teams[i].getSaveData());
    }

    let dataStr = JSON.stringify(data);

    world.setDynamicProperty("challenge:teamData", dataStr);

    let playerData: { [name: string]: IPlayerData } = {};
    let charLength = 10;

    for (let challPlayerName in this.challengePlayers) {
      let challPlayer = this.challengePlayers[challPlayerName];
      challPlayer.save();

      let playerDataObj = challPlayer.getSaveData();

      // only store a player if they are on a team or have voted.
      if (playerDataObj.t >= 0 || playerDataObj.v >= 0 || playerDataObj.x >= 0) {
        charLength += challPlayerName.length + 30; // 22 chars of overhead assuming + 2 chars per number

        if (charLength < PLAYER_DATA_STORAGE_SIZE) {
          playerData[challPlayerName] = playerDataObj;
        }
      }
    }

    if (charLength > PLAYER_DATA_STORAGE_SIZE - 50) {
      Log.debug("WARNING: Max number of players historically exceeded");
    }

    const playerDataStr = JSON.stringify(playerData);

    world.setDynamicProperty("challenge:playerState", playerDataStr);
  }

  public getTeamIndexFromSlot(slotIndex: number) {
    // convert
    //  0  1  2  3  4  5
    //  6  7  8  9 10 11
    // 12 13       14 15
    // 16 17       18 19
    // 20 21 22 23 24 25
    // 26 27 28 29 30 31
    //
    // to
    //
    // 16 17  8  9 18 19
    // 20 21  4  5 22 23
    // 14  0        2 10
    // 15  1        3 11
    // 24 25  6  7 26 27
    // 28 29 12 13 30 31

    if (slotIndex === 13) {
      return 0;
    } else if (slotIndex === 17) {
      return 1;
    } else if (slotIndex === 14) {
      return 2;
    } else if (slotIndex === 18) {
      return 3;
    } else if (slotIndex === 12) {
      return 14;
    } else if (slotIndex === 15) {
      return 10;
    } else if (slotIndex === 16) {
      return 15;
    } else if (slotIndex === 19) {
      return 11;
    } else if (slotIndex === 28) {
      return 12;
    } else if (slotIndex === 29) {
      return 13;
    } else if (slotIndex >= 8 && slotIndex <= 9) {
      // 4 & 5
      return slotIndex - 4;
    } else if (slotIndex >= 22 && slotIndex <= 23) {
      // 6 & 7
      return slotIndex - 16;
    } else if (slotIndex >= 0 && slotIndex <= 1) {
      // 16 & 17
      return slotIndex + 16;
    } else if (slotIndex >= 2 && slotIndex <= 3) {
      // 8 & 9
      return slotIndex + 6;
    } else if (slotIndex >= 4 && slotIndex <= 7) {
      // 18, 19, 20, 21
      return slotIndex + 14;
    } else if (slotIndex >= 10 && slotIndex <= 11) {
      // 22, 23
      return slotIndex + 12;
    } else if (slotIndex >= 20 && slotIndex <= 21) {
      // 24, 25
      return slotIndex + 4;
    } else if (slotIndex >= 24 && slotIndex <= 27) {
      // 26, 27, 28, 29
      return slotIndex + 2;
    } else {
      return slotIndex; // 30, 31
    }
  }

  initTeams() {
    let slot = 0;

    for (let i = 0; i < TEAM_SIZE_X; i++) {
      for (let j = 0; j < TEAM_SIZE_Z; j++) {
        // leave a donut hole in the middle.
        if (i < TEAM_SIZE_X / 2 - 1 || i > TEAM_SIZE_X / 2 || j < TEAM_SIZE_Z / 2 - 1 || j > TEAM_SIZE_Z / 2) {
          let teamIndex = this.getTeamIndexFromSlot(slot);

          if (teamIndex < this.#size) {
            if (this.teams[teamIndex] === undefined) {
              const team = new Team(this, teamIndex, i, j);

              this.teams[teamIndex] = team;
            }
          }

          slot++;
        }
      }
    }
  }

  loadPlayerState() {
    let playerStr = world.getDynamicProperty("challenge:playerState") as string;

    if (playerStr) {
      try {
        let playerObjs = JSON.parse(playerStr);

        for (let playerName in playerObjs) {
          let playerObj = playerObjs[playerName] as IPlayerData;

          if (playerObj.t) {
            this.ensurePlayerFromData(playerName, playerObj);
          }
        }
      } catch (e) {
        Log.debug("Could not parse player data '" + playerStr + "'");
      }
    }
  }

  loadTeams() {
    let teamDataStr = world.getDynamicProperty("challenge:teamData") as string;

    if (teamDataStr) {
      try {
        let teamDataObj = JSON.parse(teamDataStr);

        if (teamDataObj.length) {
          for (let i = 0; i < Math.min(teamDataObj.length, this.teams.length); i++) {
            this.teams[i].loadFromData(teamDataObj[i]);
          }
        }
      } catch (e) {
        Log.debug("Could not parse team data '" + teamDataStr + "'");
      }
    }

    for (let i = 0; i < this.teams.length; i++) {
      this.teams[i].init();
    }

    this.refreshTeamIter = 0;

    this.refreshTeam();
  }

  init(registry: PropertyRegistry) {
    if (this.teams.length > 0) {
      Log.debug("Challenge initialized twice");
      return;
    }

    let playerPropertyDefs = new DynamicPropertiesDefinition();
    let worldPropertyDefs = new DynamicPropertiesDefinition();

    try {
      playerPropertyDefs.defineNumber("challenge:teamId");
      playerPropertyDefs.defineNumber("challenge:voteA");
      playerPropertyDefs.defineNumber("challenge:voteB");
      playerPropertyDefs.defineNumber("challenge:role");

      registry.registerEntityTypeDynamicProperties(playerPropertyDefs, MinecraftEntityTypes.player);

      worldPropertyDefs.defineNumber("challenge:phase");
      worldPropertyDefs.defineNumber("challenge:size");
      worldPropertyDefs.defineNumber("challenge:nwbX");
      worldPropertyDefs.defineNumber("challenge:nwbY");
      worldPropertyDefs.defineNumber("challenge:nwbZ");
      worldPropertyDefs.defineString("challenge:motdTitle", 40);
      worldPropertyDefs.defineString("challenge:motdSubtitle", 40);
      worldPropertyDefs.defineString("challenge:teamData", 1536); // ~32 teams * 30 chars for team
      worldPropertyDefs.defineString("challenge:playerState", PLAYER_DATA_STORAGE_SIZE); // should allow for up to ~170 players to be tracked at 48 chars per player (which may not be enough?)

      registry.registerWorldDynamicProperties(worldPropertyDefs);
    } catch (e: any) {
      Log.debug(e.toString());
    }

    let candNwbX = world.getDynamicProperty("challenge:nwbX") as number;
    let candNwbY = world.getDynamicProperty("challenge:nwbY") as number;
    let candNwbZ = world.getDynamicProperty("challenge:nwbZ") as number;

    if (candNwbX !== undefined && candNwbY !== undefined && candNwbZ !== undefined) {
      this.nwbLocation = { x: candNwbX, y: candNwbY, z: candNwbZ };
    }

    let val = world.getDynamicProperty("challenge:phase") as number;

    if (val) {
      this.#phase = val;
    } else {
      this.#phase = ChallengePhase.pre;
    }

    let motdTitle = world.getDynamicProperty("challenge:motdTitle") as string;

    if (motdTitle) {
      this.#motdTitle = motdTitle;
    }

    let motdSubtitle = world.getDynamicProperty("challenge:motdSubtitle") as string;

    if (motdSubtitle) {
      this.#motdSubtitle = motdSubtitle;
    }

    let sizeVal = world.getDynamicProperty("challenge:size") as number;

    if (sizeVal) {
      this.#size = sizeVal;
    } else {
      this.#size = ChallengeBoardSize.small;
    }

    system.run(this.continueInit);
  }

  continueInit() {
    system.run(this.continueInit2);

    this.initTeams();
    this.loadTeams();
    this.setupTracks();
  }

  continueInit2() {
    system.run(this.tick);
    system.run(this.applyPhase);

    const overworld = world.getDimension("overworld");

    world.afterEvents.playerSpawn.subscribe(this.playerSpawnedFirstTime);
    world.afterEvents.playerLeave.subscribe(this.playerLeft);
    world.beforeEvents.chatSend.subscribe(this.beforeChat);
    world.afterEvents.leverActivate.subscribe(this.leverActivate);

    this.loadPlayerState();
    this.ensureAllPlayers();
  }

  setupTracks() {
    this.tracks = [];
    let track = new Track(
      new Vector(this.nwbLocation.x, this.nwbLocation.y + 10, this.nwbLocation.z),
      new Vector(this.nwbLocation.x, this.nwbLocation.y + 10, this.nwbLocation.z + TOTAL_Z),
      new Vector(20, -10, 0)
    );

    this.tracks.push(track);

    track = new Track(
      new Vector(this.nwbLocation.x + TOTAL_X / 2, this.nwbLocation.y + 10, this.nwbLocation.z - 20),
      new Vector(this.nwbLocation.x + TOTAL_X / 2, this.nwbLocation.y + 10, this.nwbLocation.z + TOTAL_Z),
      new Vector(0, -10, 20)
    );

    this.tracks.push(track);

    track = new Track(
      new Vector(this.nwbLocation.x + TOTAL_X, this.nwbLocation.y + 10, this.nwbLocation.z),
      new Vector(this.nwbLocation.x + TOTAL_X, this.nwbLocation.y + 10, this.nwbLocation.z + TOTAL_Z),
      new Vector(-20, -10, 0)
    );

    this.tracks.push(track);

    this.totalTrackTime = this.tracks.length * STANDARD_TRACK_TIME;
  }

  refreshTeamScores() {
    let obj = world.scoreboard.getObjective("main");
    let ow = world.getDimension("overworld");
    ow.runCommandAsync("scoreboard objectives remove main");
    this.addScores();
  }

  beforeChat(event: ChatSendBeforeEvent) {
    let mess = event.message;

    if (event.sender && event.sender.typeId === "minecraft:player" && mess) {
      let messageSender = this.ensurePlayer(event.sender);

      if (!messageSender) {
        return;
      }

      mess = mess.toLowerCase().trim();

      if (mess.startsWith("!")) {
        let nextSpace = mess.indexOf(" ");
        event.cancel = true;
        let content = "";
        let contentSep: string[] = [];

        if (nextSpace < 0) {
          nextSpace = mess.length;
          content = "";
        } else {
          content = mess.substring(nextSpace + 1, mess.length);
          contentSep = content.split(" ");
        }
        let command = mess.substring(1, nextSpace);

        if (nextSpace > 0) {
          switch (command) {
            case "setmotdtitle":
              if (!messageSender.isAdmin) {
                this.sendMessageToAdminsPlus(
                  "Cannot run setmotdtitle, " + messageSender.name + " is not an admin.",
                  event.sender
                );
                return;
              }

              if (content.length > 39 || content.length < 2) {
                this.sendMessageToAdminsPlus("Message must be less than 40 chars.", event.sender);
                return;
              }

              this.motdTitle = event.message.substring(event.message.indexOf(" ") + 1);
              this.showMotd(event.sender);
              break;

            case "setmotdsubtitle":
              if (!messageSender.isAdmin) {
                this.sendMessageToAdminsPlus(
                  "Cannot run setmotdsubtitle, " + messageSender.name + " is not an admin.",
                  event.sender
                );
                return;
              }

              if (content.length > 39 || content.length < 2) {
                this.sendMessageToAdminsPlus("Message must be less than 40 chars.", event.sender);
                return;
              }

              this.motdSubtitle = event.message.substring(event.message.indexOf(" ") + 1);
              this.showMotd(event.sender);
              break;

            case "setstart":
              if (this.#phase !== ChallengePhase.setup) {
                this.sendMessageToAdminsPlus("Cannot run setstart outside of setup phase.", event.sender);
                return;
              }

              if (!messageSender.isAdmin) {
                this.sendMessageToAdminsPlus(
                  "Cannot run setstart, " + messageSender.name + " is not an admin.",
                  event.sender
                );
                return;
              }

              if (contentSep.length === 3) {
                try {
                  let x = parseInt(contentSep[0]);
                  let y = parseInt(contentSep[1]);
                  let z = parseInt(contentSep[2]);

                  this.sendMessageToAdminsPlus("Setting new start location to " + x + " " + y + " " + z, event.sender);

                  this.setStart(x, y, z);
                } catch (e) {}
              }
              break;

            case "debug":
              this.save();

              this.sendMessageToAdminsPlus(
                "State: Ph:" +
                  this.#phase +
                  " Size:" +
                  this.#size +
                  " " +
                  " NWB: " +
                  this.nwbLocation.x +
                  " " +
                  this.nwbLocation.y +
                  " " +
                  this.nwbLocation.z
              );
              this.sendMessageToAdminsPlus("Team:" + world.getDynamicProperty("challenge:teamData"));
              this.sendMessageToAdminsPlus("Player:" + world.getDynamicProperty("challenge:playerState"));
              break;

            case "setphase":
              if (!messageSender.isAdmin) {
                this.sendMessageToAdminsPlus(
                  "Cannot run setphase, " + messageSender.name + " is not an admin.",
                  event.sender
                );
                return;
              }

              if (contentSep.length === 1) {
                switch (contentSep[0].toLowerCase()) {
                  case "pre":
                    this.phase = ChallengePhase.pre;
                    break;
                  case "post":
                    this.phase = ChallengePhase.post;
                    break;
                  case "build":
                    this.phase = ChallengePhase.build;
                    break;
                  case "vote":
                    this.phase = ChallengePhase.vote;
                    break;
                  case "setup":
                    this.phase = ChallengePhase.setup;
                    break;
                }
              }
              break;

            case "setrole":
              if (contentSep.length === 2) {
                let name = contentSep[0];

                let player = this.getPlayer(name);

                if (!player) {
                  this.sendMessageToAdminsPlus("Could not find player '" + name + "'", event.sender);
                  return;
                }

                if (!messageSender.isAdmin) {
                  this.sendMessageToAdminsPlus(
                    "Cannot run setrole, " + messageSender.name + " is not an admin.",
                    event.sender
                  );
                  return;
                }

                switch (contentSep[1].toLowerCase()) {
                  case "spectator":
                    if (player.role == ChallengePlayerRole.admin) {
                      this.sendMessageToAdminsPlus("Setting player '" + name + "' to adminSpectator.", event.sender);
                      player.role = ChallengePlayerRole.adminSpectator;
                    } else {
                      this.sendMessageToAdminsPlus("Setting player '" + name + "' to spectator.", event.sender);
                      player.role = ChallengePlayerRole.spectator;
                    }
                    break;
                  case "admin":
                    this.sendMessageToAdminsPlus("Setting player '" + name + "' to admin.", event.sender);
                    player.role = ChallengePlayerRole.admin;
                    break;
                  case "judge":
                    this.sendMessageToAdminsPlus("Setting player '" + name + "' to judge.", event.sender);
                    player.role = ChallengePlayerRole.judge;
                    break;
                  case "player":
                    this.sendMessageToAdminsPlus("Setting player '" + name + "' to player.", event.sender);
                    player.lastTeamSwitchTick = this.tickIndex;
                    player.role = ChallengePlayerRole.admin;
                    break;
                }
              }
              break;

            case "setsize":
              if (this.#phase !== ChallengePhase.setup) {
                Log.debug("Cannot run setsize outside of setup phase.");
                return;
              }

              if (!messageSender.isAdmin) {
                this.sendMessageToAdminsPlus(
                  "Cannot run setsize, " + messageSender.name + " is not an admin.",
                  event.sender
                );
                return;
              }

              if (contentSep.length === 1) {
                switch (contentSep[0].toLowerCase()) {
                  case "s":
                    this.size = ChallengeBoardSize.small;
                    break;
                  case "m":
                    this.size = ChallengeBoardSize.medium;
                    break;
                  case "l":
                    this.size = ChallengeBoardSize.large;
                    break;
                  case "xl":
                    this.size = ChallengeBoardSize.xtralarge;
                    break;
                }
              }

              break;

            case "clearpads":
              if (this.#phase !== ChallengePhase.setup) {
                Log.debug("Cannot run clearpads outside of setup phase.");
                return;
              }

              if (!messageSender.isAdmin) {
                this.sendMessageToAdminsPlus(
                  "Cannot run clearpads, " + messageSender.name + " is not an admin.",
                  event.sender
                );
                return;
              }

              this.sendMessageToAdminsPlus("Clearing pads!", event.sender);

              this.clearPads();
              break;
          }
        }
      }
    }
  }

  getPlayer(name: string) {
    name = name.toLowerCase();

    for (let playerName in this.challengePlayers) {
      let playerNameCand = playerName.toLowerCase();

      if (name === playerNameCand) {
        return this.challengePlayers[playerName];
      }
    }

    return undefined;
  }

  setStart(x: number, y: number, z: number) {
    Log.debug("Setting new start: " + x + " " + y + " " + z + " for " + this.teams.length + " teams");

    this.nwbLocation = { x: x, y: y, z: z };

    let ow = world.getDimension("overworld");

    const centerX = x + Math.floor((PAD_SIZE_X + PAD_SURROUND_X) * 2.5);
    const centerY = y + 1;
    const centerZ = z + Math.floor((PAD_SIZE_Z + PAD_SURROUND_Z) * 2.5);

    Utilities.fillBlock(
      MinecraftBlockTypes.air,
      centerX - 2,
      centerY - 2,
      centerZ - 2,
      centerX + 2,
      centerY + 2,
      centerZ + 2
    );

    ow.runCommandAsync(`tickingarea remove_all`);

    for (let i = 0; i < 8; i++) {
      ow.runCommandAsync(
        `tickingarea add ${x + (TOTAL_X / 8) * i} ${y} ${z} ${x + (TOTAL_X / 8) * (i + 1)} ${y + TOTAL_Y} ${
          z + TOTAL_Z
        } bc${i} true`
      );
    }

    ow.runCommandAsync(`setworldspawn ${centerX} ${centerY} ${centerZ}`);

    this.save();
    this.setupTracks();

    system.run(this.clearPads); // add a delay so that tickingareas have a moment to get instated
  }

  clearPads() {
    Log.debug("Clearing pads at " + this.nwbLocation.x + " " + this.nwbLocation.y + " " + this.nwbLocation.z);

    this.clearTeamIter = 0;

    this.clearTeamArea();
  }

  refreshTeam() {
    let effectiveTeam = this.getTeamIndexFromSlot(this.refreshTeamIter);

    if (effectiveTeam < this.teams.length) {
      this.teams[effectiveTeam].updateLocation();
      this.teams[effectiveTeam].ensurePad();
    }

    this.refreshTeamIter++;

    if (this.refreshTeamIter < MAX_SLOTS) {
      system.run(this.refreshTeam);
    }
  }

  clearTeamArea() {
    let effectiveTeam = this.getTeamIndexFromSlot(this.clearTeamIter % MAX_SLOTS);

    if (effectiveTeam < this.teams.length) {
      this.teams[effectiveTeam].updateLocation();

      this.teams[effectiveTeam].clearPad(Math.floor(this.clearTeamIter / MAX_SLOTS)); // <-- NOTE THIS CLEAR OUT THE AIR ABOVE A PAD
    }

    this.clearTeamIter++;

    if (this.clearTeamIter < MAX_SLOTS * 12) {
      system.run(this.clearTeamArea);
    } else {
      this.refreshTeamIter = 0;
      system.run(this.refreshTeam);
    }
  }

  ensureAllPlayers() {
    let players = world.getPlayers();

    for (let player of players) {
      this.ensurePlayer(player);
    }
  }

  updatePlayers() {
    let players = world.getPlayers();

    for (let player of players) {
      let challPlayer = this.ensurePlayer(player);

      if (challPlayer) {
        if (challPlayer.isSpectator) {
          let trackSequence = this.tickIndex % this.totalTrackTime;

          let trackIndex = Math.floor(trackSequence / STANDARD_TRACK_TIME);

          let track = this.tracks[trackIndex];

          let vec = Vector.lerp(track.from, track.to, (trackSequence % STANDARD_TRACK_TIME) / STANDARD_TRACK_TIME);
          player.teleport(vec, {
            dimension: world.getDimension("overworld"),
            facingLocation: {
            x: vec.x + track.facingAdjust.x,
            y: vec.y + track.facingAdjust.y,
            z: vec.z + track.facingAdjust.z,
          }});

          if (this.tickIndex % 1200 === 500 && this.#motdSubtitle && this.motdTitle) {
            player.onScreenDisplay.setTitle(this.motdTitle, {
              fadeInDuration: 1,
              fadeOutDuration: 1,
              stayDuration: 6,
              subtitle: this.#motdSubtitle,
            });
          }
        } else if (this.phase === ChallengePhase.build) {
          let loc = player.location;

          if (
            loc.x >= this.nwbLocation.x &&
            loc.x < this.nwbLocation.x + TOTAL_X && // is this player in the village area?
            loc.y >= this.nwbLocation.y &&
            loc.y < this.nwbLocation.y + TOTAL_Y &&
            loc.z >= this.nwbLocation.z &&
            loc.z < this.nwbLocation.z + TOTAL_Z
          ) {
            for (let team of this.teams) {
              if (team.index != challPlayer.teamId) {
                if (
                  loc.x >= team.padNwbX - AIRSPACE_GAP &&
                  loc.y >= team.padNwbY - AIRSPACE_GAP &&
                  loc.z >= team.padNwbZ - AIRSPACE_GAP &&
                  loc.x <= team.padNwbX + PAD_SIZE_X + AIRSPACE_GAP &&
                  loc.y <= team.padNwbY + PAD_SIZE_Y + AIRSPACE_GAP &&
                  loc.z <= team.padNwbZ + PAD_SIZE_Z + AIRSPACE_GAP
                ) {
                  let westGap = loc.x - (team.padNwbX + AIRSPACE_GAP);
                  let eastGap = team.padNwbX + PAD_SIZE_X + AIRSPACE_GAP - loc.x;
                  let northGap = loc.z - (team.padNwbZ + +AIRSPACE_GAP);
                  let southGap = team.padNwbZ + PAD_SIZE_Z + AIRSPACE_GAP - loc.z;
                  let topGap = team.padNwbY + PAD_SIZE_Y + AIRSPACE_GAP - loc.y;

                  let newX = loc.x,
                    newY = loc.y,
                    newZ = loc.z;

                  if (westGap < eastGap && westGap < northGap && westGap < southGap && westGap < topGap) {
                    newX = team.padNwbX - AIRSPACE_GAP - 2;
                  } else if (eastGap < westGap && eastGap < northGap && eastGap < southGap && eastGap < topGap) {
                    newX = team.padNwbX + AIRSPACE_GAP + PAD_SIZE_X + 2;
                  } else if (topGap < westGap && topGap < southGap && topGap < eastGap && topGap < northGap) {
                    newY = team.padNwbY + AIRSPACE_GAP + PAD_SIZE_Y + 2;
                  } else if (northGap < westGap && northGap < southGap && northGap < eastGap && northGap < topGap) {
                    newZ = team.padNwbZ - AIRSPACE_GAP - 2;
                  } else {
                    newZ = team.padNwbZ + AIRSPACE_GAP + PAD_SIZE_Z + 2;
                  }

                  player.onScreenDisplay.setTitle(" ", {
                    fadeInDuration: 1,
                    fadeOutDuration: 1,
                    stayDuration: 3,
                    subtitle: "You cannot enter " + team.name + "'s area",
                  });
                  player.runCommandAsync("tp @s " + newX + " " + newY + " " + newZ);
                }
              }
            }
          }
        }
      }
    }
  }

  postInit() {
    let ow = world.getDimension("overworld");

    if (this.#motdTitle) {
      ow.runCommandAsync('tellraw @a { "rawtext": [{ "text": "§l' + this.#motdTitle + '" }]  }');
    }

    if (this.#motdSubtitle) {
      ow.runCommandAsync('tellraw @a { "rawtext": [{ "text": "' + this.#motdSubtitle + '" }]  }');
    }

    ow.runCommandAsync("gamerule sendcommandfeedback false");
    ow.runCommandAsync("gamerule mobgriefing false");
    ow.runCommandAsync("gamerule commandblocksenabled false");
    ow.runCommandAsync("gamerule commandblockoutput false");
    ow.runCommandAsync("gamerule tntexplodes false");
    ow.runCommandAsync("gamerule pvp false");

    system.run(this.updateMetaBonuses);
    system.run(this.refreshTeamScores);
  }

  addScores() {
    let ow = world.getDimension("overworld");

    ow.runCommandAsync(`scoreboard objectives add main dummy "Team Score"`);
    ow.runCommandAsync("scoreboard objectives setdisplay sidebar main");

    for (let team of this.teams) {
      if (team.active || team.score > 0) {
        team.applyScore();
      }
    }
  }

  applyPhase() {
    let ow = world.getDimension("overworld");

    switch (this.phase) {
      case ChallengePhase.setup:
        this.sendToAllPlayers("Setup Phase", {
          fadeInDuration: 1,
          fadeOutDuration: 1,
          stayDuration: 7,
          subtitle: "OPs are getting the game ready, hold on",
        });
        ow.runCommandAsync("gamemode c");
        this.applyRoleToAllPlayers();
        break;

      case ChallengePhase.pre:
        this.sendToAllPlayers("Preliminary Phase", {
          fadeInDuration: 1,
          fadeOutDuration: 1,
          stayDuration: 7,
          subtitle: "Pull lever near a pad to join a team",
        });
        ow.runCommandAsync("gamemode a");
        this.applyRoleToAllPlayers();
        break;

      case ChallengePhase.build:
        this.sendToAllPlayers("Build Phase", {
          fadeInDuration: 1,
          fadeOutDuration: 1,
          stayDuration: 7,
          subtitle: "Build things on your team pad",
        });
        ow.runCommandAsync("gamemode s");
        this.applyRoleToAllPlayers();
        break;

      case ChallengePhase.vote:
        this.sendToAllPlayers("Vote Phase", {
          fadeInDuration: 1,
          fadeOutDuration: 1,
          stayDuration: 7,
          subtitle: "Pull lever to vote for a team (2 votes)",
        });
        ow.runCommandAsync("gamemode a");
        this.applyRoleToAllPlayers();
        break;

      case ChallengePhase.post:
        this.sendToAllPlayers("Post Phase", {
          fadeInDuration: 1,
          fadeOutDuration: 1,
          stayDuration: 7,
          subtitle: "Congratulate the winners",
        });
        ow.runCommandAsync("gamemode a");
        this.applyRoleToAllPlayers();
        break;
    }
  }

  sendMessageToAdminsPlus(message: string, additionalPlayer?: Player) {
    let ow = world.getDimension("overworld");
    Log.debug(message);

    for (let player of world.getPlayers()) {
      let challPlayer = this.ensurePlayer(player);

      if (
        challPlayer &&
        (challPlayer.isAdmin ||
          player === additionalPlayer ||
          (additionalPlayer && player.name === additionalPlayer.name))
      ) {
        player.sendMessage(message);
      }
    }
  }

  applyRoleToAllPlayers() {
    let ow = world.getDimension("overworld");

    for (let player of world.getPlayers()) {
      let challPlayer = this.ensurePlayer(player);

      if (challPlayer) {
        challPlayer.applyRole();
      }
    }
  }

  sendToAllPlayers(title: string, options?: TitleDisplayOptions) {
    for (let player of world.getPlayers()) {
      player.onScreenDisplay.setTitle(title, options);
    }
  }

  tick() {
    //    try {
    this.tickIndex++;

    if (this.tickIndex === POST_INIT_TICK) {
      this.postInit();
    }

    if (this.tickIndex >= TEAM_INIT_TICK && this.tickIndex < TEAM_INIT_TICK + this.teams.length) {
      this.teams[this.tickIndex - TEAM_INIT_TICK].initPad();
    }

    this.updatePlayers();

    this.updateCount(this.tickIndex);

    if (this.tickIndex % 400 === 0) {
      this.updateTocks();
    }

    if (this.tickIndex % 800 === 0) {
      this.updateMetaBonuses();
    }
    /*    } catch (e) {
      Log.debug("Challenge script error: " + e);
    }*/

    system.run(this.tick);
  }

  updateMetaBonuses() {
    let teamsByVote = [];
    let teamsByTocks = [];
    let hasChanged = false;

    for (let i = 0; i < this.teams.length; i++) {
      this.teams[i].votes = 0;

      this.teams[i].rankByVote = -1;

      teamsByVote.push(this.teams[i]);

      if (this.teams[i].active || (this.teams[i].score > 0 && this.teams[i].playerTocks > 0)) {
        teamsByTocks.push(this.teams[i]);
      }
    }

    if (this.phase === ChallengePhase.post || this.phase === ChallengePhase.vote) {
      for (let challengePlayerName in this.challengePlayers) {
        let challPlayer = this.challengePlayers[challengePlayerName];

        if (challPlayer) {
          if (challPlayer.voteA >= 0 && challPlayer.voteA < this.teams.length) {
            this.teams[challPlayer.voteA].votes++;
          }

          if (challPlayer.voteB >= 0 && challPlayer.voteB < this.teams.length) {
            this.teams[challPlayer.voteB].votes++;
          }
        }
      }

      teamsByVote.sort(function (teamA: Team, teamB: Team) {
        return teamB.votes - teamA.votes;
      });

      for (let i = 0; i < teamsByVote.length; i++) {
        if (teamsByVote[i].rankByVote !== i && teamsByVote[i].votes > 0) {
          teamsByVote[i].rankByVote = i;
          hasChanged = true;
        }
      }

      // in case of tie, adjust rank by vote
      if (teamsByVote[1].votes === teamsByVote[0].votes) {
        teamsByVote[1].rankByVote = teamsByVote[0].rankByVote;
      }

      if (teamsByVote[2].votes === teamsByVote[1].votes) {
        teamsByVote[2].rankByVote = teamsByVote[1].rankByVote;
      }
    }

    teamsByTocks.sort(function (teamA: Team, teamB: Team) {
      return teamB.playerTocks - teamA.playerTocks;
    });

    for (let i = 0; i < teamsByTocks.length; i++) {
      let newQuartile = Math.floor((i * 4) / teamsByTocks.length);

      if (teamsByTocks[i].teamUsageQuartile !== newQuartile) {
        teamsByTocks[i].teamUsageQuartile = newQuartile;
        hasChanged = true;
      }
    }

    if (hasChanged) {
      this.refreshTeamScores();
    }
  }

  updateTocks() {
    let isActive = false;

    for (let player of world.getPlayers()) {
      let collPlayer = this.ensurePlayer(player);

      if (collPlayer && collPlayer.teamId >= 0 && collPlayer.teamId < this.teams.length) {
        let team = this.teams[collPlayer.teamId];

        let loc = player.location;

        if (loc.x !== collPlayer.tockX || loc.y !== collPlayer.tockY || loc.z !== collPlayer.tockZ) {
          collPlayer.tockX = loc.x;
          collPlayer.tockY = loc.y;
          collPlayer.tockZ = loc.z;

          isActive = true;
          team.playerTocks++;
        }
      }
    }
    if (isActive) {
      this.save();
    }
  }

  updateCount(tick: number) {
    const teamIndex = Math.floor(tick / 16) % this.teams.length;

    let team = this.teams[teamIndex];

    if (team && !team.active) {
      return;
    }

    const area = tick % 16;

    if (area === 0) {
      this.activeTeamScore = 0;
    }

    let ow = world.getDimension("overworld");
    if (this.activeTeamScore >= 0) {
      let canaryLoc = { x:team.padNwbX, y: team.padNwbY, z: team.padNwbZ + (PAD_SIZE_Z / 16) * area};

      let canaryBlock = ow.getBlock(canaryLoc);

      // if we don't find blackstone at our canary location, assume the chunk is loaded and bail on calculating score.
      if (canaryBlock && canaryBlock.typeId !== "minecraft:blackstone") {
        Log.debug(
          "Did not find blackstone at " +
            team.padNwbX +
            " " +
            team.padNwbY +
            " " +
            String(team.padNwbZ + (PAD_SIZE_Z / 16) * area)
        );
        this.activeTeamScore = -1;
        return;
      }

      for (let i = 0; i < PAD_SIZE_X; i++) {
        for (let j = 0; j < PAD_SIZE_Y; j++) {
          for (let k = (PAD_SIZE_Z / 16) * area; k < (PAD_SIZE_Z / 16) * (area + 1); k++) {
            let loc = { x: team.padNwbX + i, y: team.padNwbY + j + 1, z:team.padNwbZ + k};
            let block = ow.getBlock(loc);

            if (block) {
              let typeId = block.typeId.toLowerCase().trim();

              if (typeId.startsWith("minecraft:")) {
                typeId = typeId.substring(10);
              }

              if (typeId !== "air") {
                if (BLOCK_SCORESHEET[typeId] > 0) {
                  this.activeTeamScore += BLOCK_SCORESHEET[typeId];
                }

                if (typeId === "chest") {
                  let leftLoc = { x: loc.x - 1, y: loc.y, z: loc.z};
                  let northLoc = { x: loc.x, y: loc.y, z: loc.z - 1};

                  let leftBlock = ow.getBlock(leftLoc);
                  let northBlock = ow.getBlock(northLoc);

                  // if this is a double chest, only calc inventory from the west or northern side of the chest
                  // todo: improve to accommodate double chests placed right next to each other
                  if (leftBlock && leftBlock.typeId.indexOf("chest") < 0 && northBlock && northBlock.typeId.indexOf("chest") < 0) {
                    let invComp = block.getComponent("inventory") as BlockInventoryComponent;

                    if (invComp) {
                      let cont = invComp.container;

                      for (let ci = 0; ci < cont.size; ci++) {
                        let item = cont.getItem(ci);

                        if (item) {
                          let itemTypeId = item.typeId.toLowerCase().trim();

                          if (itemTypeId.startsWith("minecraft:")) {
                            itemTypeId = itemTypeId.substring(10);
                          }

                          if (ITEM_SCORESHEET[itemTypeId] > 0) {
                            this.activeTeamScore += ITEM_SCORESHEET[itemTypeId] * item.amount;
                          } else if (BLOCK_SCORESHEET[itemTypeId] > 0) {
                            this.activeTeamScore += Math.floor(BLOCK_SCORESHEET[itemTypeId] / 2) * item.amount;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    if (area === 15) {
      if (this.activeTeamScore !== team.score && this.activeTeamScore >= 0) {
        if (this.activeTeamScore > team.score && team.score > 0) {
          for (let challPlayer of team.players) {
            if (challPlayer.player) {
              challPlayer.player.playSound("random.orb");
            }
          }
        }
        team.score = this.activeTeamScore;

        team.applyScore();

        this.save();
      }
    }
  }

  showMotd(player: Player) {
    if (this.#motdTitle) {
      player.sendMessage([`§l${this.#motdTitle}`]);
    }

    if (this.#motdSubtitle) {
      player.sendMessage([this.#motdSubtitle]);
    }
  }

  playerLeft(event: PlayerLeaveAfterEvent) {
    if (!event.playerName) {
      return;
    }

    let cp = this.getPlayerFromName(event.playerName);

    if (cp) {
      cp.player = undefined;
    }
  }

  playerSpawnedFirstTime(event: PlayerSpawnAfterEvent) {
    if (!event.player || !event.initialSpawn) {
      return;
    }

    this.ensurePlayer(event.player);

    this.showMotd(event.player);

    switch (this.phase) {
      case ChallengePhase.setup:
        event.player.onScreenDisplay.setTitle("Setup Phase", {
          fadeInDuration: 1,
          fadeOutDuration: 1,
          stayDuration: 7,
          subtitle: "OPs are getting the game ready, hold on",
        });

        break;

      case ChallengePhase.pre:
        event.player.onScreenDisplay.setTitle("Preliminary Phase", {
          fadeInDuration: 1,
          fadeOutDuration: 1,
          stayDuration: 7,
          subtitle: "Pull lever near a pad to join a team",
        });
        break;

      case ChallengePhase.build:
        event.player.onScreenDisplay.setTitle("Build Phase", {
          fadeInDuration: 1,
          fadeOutDuration: 1,
          stayDuration: 7,
          subtitle: "Build things on your team pad",
        });
        break;

      case ChallengePhase.vote:
        event.player.onScreenDisplay.setTitle("Vote Phase", {
          fadeInDuration: 1,
          fadeOutDuration: 1,
          stayDuration: 7,
          subtitle: "Pull lever to vote for a team (2 votes)",
        });
        break;

      case ChallengePhase.post:
        event.player.onScreenDisplay.setTitle("Post Phase", {
          fadeInDuration: 1,
          fadeOutDuration: 1,
          stayDuration: 7,
          subtitle: "Congratulate the winners",
        });
    }
  }

  leverActivate(event: LeverActionAfterEvent) {
    if (!event.player) {
      return;
    }

    let x = event.block.x;
    let y = event.block.y;
    let z = event.block.z;

    for (let team of this.teams) {
      if (x === team.nwbX + JOIN_TEAM_X && y === team.nwbY + JOIN_TEAM_Y && z === team.nwbZ + JOIN_TEAM_Z) {
        let challPlayer = this.ensurePlayer(event.player);

        if (challPlayer) {
          if (this.#phase === ChallengePhase.vote) {
            if (challPlayer.teamId === team.index) {
              event.player.onScreenDisplay.setTitle(`Nope`, {
                fadeInDuration: 1,
                fadeOutDuration: 1,
                stayDuration: 5,
                subtitle: "You can't vote for your own team.",
              });
            } else {
              if (challPlayer.voteA !== team.index && challPlayer.teamId !== team.index) {
                challPlayer.voteB = challPlayer.voteA;
                challPlayer.voteA = team.index;

                this.updateMetaBonuses();
              }

              if (challPlayer.voteB >= 0) {
                event.player.onScreenDisplay.setTitle(`Your votes`, {
                  fadeInDuration: 1,
                  fadeOutDuration: 1,
                  stayDuration: 5,
                  subtitle: this.teams[challPlayer.voteA].name + ", " + this.teams[challPlayer.voteB].name,
                });
              } else {
                event.player.onScreenDisplay.setTitle(`Your vote:`, {
                  fadeInDuration: 1,
                  fadeOutDuration: 1,
                  stayDuration: 5,
                  subtitle: this.teams[challPlayer.voteA].name,
                });
              }
            }
          } else if (challPlayer.teamId === team.index) {
            event.player.onScreenDisplay.setTitle(`Already joined ` + team.name);
          } else if (team.players.length >= MAX_PLAYERS_TEAM) {
            event.player.onScreenDisplay.setTitle(`Team ${team.name} is full at ${MAX_PLAYERS_TEAM}`);
          } else if (
            challPlayer.teamId >= 0 &&
            !challPlayer.isAdmin &&
            this.tickIndex > challPlayer.lastTeamSwitchTick + MAX_TIME_TO_SWITCH_TEAMS_TICK
          ) {
            event.player.onScreenDisplay.setTitle(`You can no longer switch teams.`);
          } else {
            if (challPlayer.teamId >= 0 && challPlayer.teamId < this.teams.length) {
              this.teams[challPlayer.teamId].removePlayer(challPlayer);
            }

            challPlayer.lastTeamSwitchTick = this.tickIndex;
            challPlayer.teamId = team.index;

            team.ensurePlayerIsOnTeam(challPlayer);

            event.player.onScreenDisplay.setTitle(`Joined`, {
              fadeInDuration: 1,
              fadeOutDuration: 1,
              stayDuration: 7,
              subtitle: team.name,
            });
          }
        }
      } else if (
        x === team.nwbX + TEAM_OPTIONS_X &&
        y === team.nwbY + TEAM_OPTIONS_Y &&
        z === team.nwbZ + TEAM_OPTIONS_Z
      ) {
        team.showOptions(event.player);
      }
    }
  }

  getPlayerFromName(name: string) {
    if (!name || name.length < 2) {
      Log.debug("Unexpected player without a name passed: " + name);
      return;
    }

    let cp = this.challengePlayers[name];

    return cp;
  }

  ensurePlayerFromData(name: string, data: IPlayerData) {
    if (!name || name.length < 2) {
      Log.debug("Unexpected player without a name passed: " + name);
      return;
    }

    let cp = this.challengePlayers[name];

    if (!cp) {
      cp = new ChallengePlayer(this, name, undefined);

      cp.loadFromData(data);

      if (cp.teamId >= 0 && cp.teamId < this.teams.length) {
        this.teams[cp.teamId].ensurePlayerIsOnTeam(cp);
      }

      this.challengePlayers[name] = cp;
    }

    return cp;
  }

  ensurePlayer(player: Player) {
    let name = player.name;

    if (!name || name.length < 2) {
      Log.debug("Unexpected player without a name passed: " + name);
      return;
    }

    let cp = this.challengePlayers[name];

    if (!cp) {
      cp = new ChallengePlayer(this, name, player);
      cp.load();

      if (cp.teamId >= 0 && cp.teamId < this.teams.length) {
        this.teams[cp.teamId].ensurePlayerIsOnTeam(cp);
      }

      this.challengePlayers[name] = cp;
    } else {
      let wasPlayerDefined = true;

      if (cp.player === undefined) {
        wasPlayerDefined = false;
      }

      cp.player = player;

      if (!wasPlayerDefined) {
        cp.load();

        if (cp.teamId >= 0 && cp.teamId < this.teams.length) {
          this.teams[cp.teamId].ensurePlayerIsOnTeam(cp);
        }
      }
    }

    return cp;
  }
}
