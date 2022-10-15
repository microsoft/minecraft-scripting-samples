import { world, BlockLocation, MinecraftBlockTypes, Player } from "@minecraft/server";
import Challenge, { ChallengePhase } from "./Challenge";
import ChallengePlayer from "./ChallengePlayer";
import {
  PAD_SURROUND_X as PAD_SURROUND_X,
  PAD_SURROUND_Z as PAD_SURROUND_Z,
  PAD_SIZE_X,
  PAD_SIZE_Z,
  JOIN_TEAM_X,
  JOIN_TEAM_Y,
  JOIN_TEAM_Z,
  OPTIONS_AREA_TEAM_X,
  OPTIONS_AREA_TEAM_Y,
  OPTIONS_AREA_TEAM_Z,
  SPAWN_TEAM_X,
  SPAWN_TEAM_Y,
  SPAWN_TEAM_Z,
} from "./Constants";
import Log from "./Log";
import Utilities from "./Utilities";
import { ModalFormData, MessageFormData } from "@minecraft/server-ui";

export interface ITeamData {
  n: string;
  s: number;
}

export default class Team {
  index: number = -1;
  padX: number;
  padZ: number;

  #name: string | undefined = undefined;

  #score: number = 0;

  nwbX: number = 0;
  nwbY: number = 0;
  nwbZ: number = 0;

  padNwbX: number = 0;
  padNwbY: number = 0;
  padNwbZ: number = 0;

  players: ChallengePlayer[] = [];

  challenge: Challenge;

  get active() {
    return this.players.length > 0;
  }

  get name() {
    if (!this.#name) {
      return "Team " + new String(this.index + 1);
    }

    return this.#name;
  }

  set name(newName: string) {
    if (newName !== this.#name) {
      if (this.isValidName(newName)) {
        this.#name = newName;

        this.addTeamName();
        this.challenge.cleanTeamScores();

        this.challenge.save();
      }
    }
  }

  get score() {
    return this.#score;
  }

  set score(newScore: number) {
    if (this.#score !== newScore) {
      this.#score = newScore;
    }
  }

  constructor(challenge: Challenge, index: number, x: number, z: number) {
    this.challenge = challenge;
    this.padX = x;
    this.padZ = z;

    this.updateLocation();

    this.index = index;
  }

  ensurePlayerIsOnTeam(challPlayer: ChallengePlayer) {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i] === challPlayer || this.players[i].name === challPlayer.name) {
        return;
      }
    }

    let wasActive = this.active;

    // is now active.
    if (!wasActive) {
    }

    this.players.push(challPlayer);

    if (challPlayer.player) {
      challPlayer.player.runCommandAsync(
        `spawnpoint @s ${this.nwbX + SPAWN_TEAM_X} ${this.nwbY + SPAWN_TEAM_Y} ${this.nwbZ + SPAWN_TEAM_Z}`
      );
    }
  }

  updateLocation() {
    this.nwbX = this.challenge.nwbLocation.x + this.padX * (PAD_SIZE_X + PAD_SURROUND_X);
    this.nwbY = this.challenge.nwbLocation.y;
    this.nwbZ = this.challenge.nwbLocation.z + this.padZ * (PAD_SIZE_Z + PAD_SURROUND_Z);

    this.padNwbX = this.nwbX + PAD_SURROUND_X / 2 - 2;
    this.padNwbY = this.nwbY;
    this.padNwbZ = this.nwbZ + PAD_SURROUND_Z / 2 - 2;
  }

  addTeamName() {
    Utilities.fillBlock(
      MinecraftBlockTypes.air,
      this.nwbX + 5,
      this.nwbY + 1,
      this.nwbZ + 5,
      this.nwbX + (PAD_SIZE_X + PAD_SURROUND_X) - 5,
      this.nwbY + 1,
      this.nwbZ + 10
    );
    Utilities.writeTextFlatX(
      this.name,
      { x: this.nwbX + 5, y: this.nwbY + 1, z: this.nwbZ + 5 },
      MinecraftBlockTypes.cutCopperSlab,
      MinecraftBlockTypes.air
    );
  }

  init() {
    let ow = world.getDimension("overworld");

    ow.runCommandAsync(`scoreboard players add "${this.name}" ${this.#score}`);
  }

  isValidName(newName: string) {
    if (newName.length < 2 || newName.length > 10) {
      return false;
    }
    for (let c of newName) {
      if ((c < "a" || c > "z") && (c < "A" || c > "Z") && (c < "0" || c > "9") && c !== " ") {
        return false;
      }
    }
    return true;
  }

  initPad() {
    this.ensurePad();
  }

  async showOptions(player: Player) {
    let challPlayer = this.challenge.ensurePlayer(player);

    if (challPlayer) {
      if (challPlayer.teamId === this.index) {
        let mdf = new ModalFormData();

        let name = this.name;

        if (!name) {
          name = "Unknown team";
        }
        mdf.title(name);
        mdf.textField("Name", "team name", this.name);

        let result = await mdf.show(player);

        if (result.formValues && result.formValues[0] !== undefined) {
          this.name = result.formValues[0];
        }
      }

      this.showName(player);
    }
  }

  async showName(player: Player) {
    let challPlayer = this.challenge.ensurePlayer(player);

    if (challPlayer) {
      let mdf = new MessageFormData();

      let name = this.name;

      if (!name) {
        name = "Unknown team";
      }
      mdf.title(name);

      if (this.players.length === 0) {
        mdf.body("Nobody is on this team yet.");
      } else {
        let teamMembers = "";

        for (let i = 0; i < this.players.length; i++) {
          if (teamMembers.length > 0) {
            teamMembers += ", ";
          }

          teamMembers += this.players[0].name;
        }
        mdf.body("Team members: " + teamMembers);
      }

      mdf.button1("OK");
      mdf.button2("Cancel");

      let result = await mdf.show(player);
    }
  }

  ensurePad() {
    // east bar
    Utilities.fillBlock(
      MinecraftBlockTypes.grass,
      this.nwbX + PAD_SIZE_X + PAD_SURROUND_X / 2 - 1,
      this.nwbY - 3,
      this.nwbZ,
      this.nwbX + PAD_SIZE_X + (PAD_SURROUND_X - 1),
      this.nwbY,
      this.nwbZ + PAD_SIZE_Z + PAD_SURROUND_Z - 1
    );

    // west bar
    Utilities.fillBlock(
      MinecraftBlockTypes.grass,
      this.nwbX,
      this.nwbY - 3,
      this.nwbZ,
      this.nwbX + PAD_SURROUND_X / 2,
      this.nwbY,
      this.nwbZ + PAD_SIZE_Z + PAD_SURROUND_Z - 1
    );

    // north and south are inset since the corners are covered by e/w bars
    // north bar?
    Utilities.fillBlock(
      MinecraftBlockTypes.grass,
      this.nwbX + PAD_SURROUND_X / 2,
      this.nwbY - 3,
      this.nwbZ,
      this.nwbX + PAD_SIZE_X + PAD_SURROUND_X / 2,
      this.nwbY,
      this.nwbZ + PAD_SURROUND_Z / 2
    );

    // south bar
    Utilities.fillBlock(
      MinecraftBlockTypes.grass,
      this.nwbX + PAD_SURROUND_X / 2,
      this.nwbY - 3,
      this.nwbZ + PAD_SIZE_Z + PAD_SURROUND_Z / 2 - 1,
      this.nwbX + PAD_SIZE_X + PAD_SURROUND_X / 2,
      this.nwbY,
      this.nwbZ + PAD_SIZE_Z + (PAD_SURROUND_Z - 1)
    );

    Utilities.fillBlock(
      MinecraftBlockTypes.blackstone,
      this.nwbX + PAD_SURROUND_X / 2 - 2,
      this.nwbY,
      this.nwbZ + PAD_SURROUND_Z / 2 - 2,
      this.nwbX + PAD_SIZE_X + PAD_SURROUND_X / 2 - 2,
      this.nwbY,
      this.nwbZ + PAD_SIZE_Z + PAD_SURROUND_Z / 2 - 2
    );

    // east road
    Utilities.fillBlock(
      MinecraftBlockTypes.stone,
      this.nwbX + PAD_SIZE_X + PAD_SURROUND_X - 5,
      this.nwbY,
      this.nwbZ,
      this.nwbX + PAD_SIZE_X + (PAD_SURROUND_X - 1),
      this.nwbY,
      this.nwbZ + PAD_SIZE_Z + PAD_SURROUND_Z - 1
    );

    // west road running n/s = out of bounds but filler road
    Utilities.fillBlock(
      MinecraftBlockTypes.stone,
      this.nwbX - 4,
      this.nwbY,
      this.nwbZ - 4,
      this.nwbX,
      this.nwbY,
      this.nwbZ + PAD_SIZE_Z + PAD_SURROUND_Z - 1
    );

    // south road
    Utilities.fillBlock(
      MinecraftBlockTypes.stone,
      this.nwbX,
      this.nwbY,
      this.nwbZ + PAD_SIZE_Z + PAD_SURROUND_Z - 5,
      this.nwbX + PAD_SIZE_X + PAD_SURROUND_X - 5,
      this.nwbY,
      this.nwbZ + PAD_SIZE_Z + PAD_SURROUND_Z - 1
    );

    // north road = out of bounds but filler road
    Utilities.fillBlock(
      MinecraftBlockTypes.stone,
      this.nwbX,
      this.nwbY,
      this.nwbZ - 4,
      this.nwbX + PAD_SIZE_X + PAD_SURROUND_X - 5,
      this.nwbY,
      this.nwbZ - 1
    );

    Utilities.fillBlock(
      MinecraftBlockTypes.stone,
      this.nwbX,
      this.nwbY - 10,
      this.nwbZ,
      this.nwbX + PAD_SIZE_X,
      this.nwbY - 1,
      this.nwbZ + PAD_SIZE_Z
    );

    let ow = world.getDimension("overworld");
    let block = ow.getBlock(
      new BlockLocation(this.nwbX + JOIN_TEAM_X, this.nwbY + JOIN_TEAM_Y, this.nwbZ + JOIN_TEAM_Z)
    );

    let consoleType = "options";

    /*
    
    if (this.challenge.phase === ChallengePhase.vote) {
      consoleType = "vote";
    }
*/
    ow.runCommandAsync(
      `structure load challenge:${consoleType} ${this.nwbX + OPTIONS_AREA_TEAM_X} ${this.nwbY + OPTIONS_AREA_TEAM_Y} ${
        this.nwbZ + OPTIONS_AREA_TEAM_Z
      } 0_degrees `
    );

    this.addTeamName();

    //block.setType(MinecraftBlockTypes.lever);
  }

  clearPad() {
    Utilities.fillBlock(
      MinecraftBlockTypes.air,
      this.nwbX - 4,
      this.nwbY + 1,
      this.nwbZ - 4,
      this.nwbX + PAD_SIZE_X + PAD_SURROUND_X,
      this.nwbY + 50,
      this.nwbZ + PAD_SIZE_Z + PAD_SURROUND_Z
    );
  }

  getSaveData() {
    let td = {
      n: this.name,
      s: this.score,
    };

    return td;
  }

  loadFromString(dataStr: string) {
    if (!dataStr) {
      return;
    }

    try {
      let data = JSON.parse(dataStr);

      this.loadFromData(data);
    } catch (e) {
      Log.debug("Could not parse incoming data: " + dataStr);
    }
  }

  loadFromData(data: ITeamData) {
    if (data.n) {
      this.#name = data.n;
    }

    if (data.s) {
      this.#score = data.s;
    }
  }
}
