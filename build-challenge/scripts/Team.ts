import { world, Player, BlockTypes, BlockPermutation } from "@minecraft/server";
import Challenge, { ChallengeFlavor, ChallengePhase, ChallengeScoring } from "./Challenge.js";
import ChallengePlayer from "./ChallengePlayer.js";
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
} from "./Constants.js";
import Log from "./Log.js";
import Utilities from "./Utilities.js";
import { ModalFormData, MessageFormData } from "@minecraft/server-ui";

export interface ITeamData {
  n: string;
  s: number;
  t: number;
}

export default class Team {
  index: number = -1;
  padX: number;
  padZ: number;

  #playerTocks: number; // one player tock = one player was active for 20 secs

  #name: string | undefined = undefined;

  #score: number = 0;

  nwbX: number = 0;
  nwbY: number = 0;
  nwbZ: number = 0;

  padNwbX: number = 0;
  padNwbY: number = 0;
  padNwbZ: number = 0;

  teamUsageQuartile: number = 0;
  votes: number = 0;
  rankByVote: number = -1;

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
        this.challenge.refreshTeamScores();

        this.challenge.save();
      }
    }
  }

  get effectiveScore() {
    if (this.challenge.scoringMode === ChallengeScoring.votesOnly) {
      return this.votes;
    }

    let effectiveScore = this.blockTallyScore;

    if (effectiveScore < 0) {
      return 0;
    }

    if (this.challenge.teams.length >= 4) {
      if (this.teamUsageQuartile == 1) {
        effectiveScore += this.blockTallyScore / 4;
      } else if (this.teamUsageQuartile == 2) {
        effectiveScore += this.blockTallyScore / 2;
      } else if (this.teamUsageQuartile == 3) {
        effectiveScore += this.blockTallyScore;
      }
    }

    if (
      (this.challenge.phase === ChallengePhase.vote || this.challenge.phase === ChallengePhase.post) &&
      this.challenge.teams.length >= 3
    ) {
      if (this.rankByVote == 0) {
        effectiveScore += this.blockTallyScore * 2; // 3x bonus for first vote winner.
      } else if (this.rankByVote == 1) {
        effectiveScore += this.blockTallyScore;
      } else if (this.rankByVote == 2) {
        effectiveScore += this.blockTallyScore / 2;
      }
    }

    return Math.floor(effectiveScore);
  }

  get playerTocks() {
    return this.#playerTocks;
  }

  set playerTocks(newTock: number) {
    if (this.#playerTocks !== newTock) {
      this.#playerTocks = newTock;
    }
  }

  get blockTallyScore() {
    return this.#score;
  }

  set blockTallyScore(newScore: number) {
    if (this.#score !== newScore) {
      this.#score = newScore;
    }
  }

  constructor(challenge: Challenge, index: number, x: number, z: number) {
    this.challenge = challenge;
    this.padX = x;
    this.padZ = z;

    this.#playerTocks = 0;

    this.updateLocation();

    this.index = index;
  }

  removePlayer(playerToRemove: ChallengePlayer) {
    let newPlayerArr = [];

    for (let i = 0; i < this.players.length; i++) {
      if (
        this.players[i] !== playerToRemove &&
        this.challenge.canonicalizePlayerName(this.players[i].name) !==
          this.challenge.canonicalizePlayerName(playerToRemove.name)
      ) {
        newPlayerArr.push(this.players[i]);
      }
    }

    this.players = newPlayerArr;
  }

  applyScore() {
    if (!this.challenge.shouldShowScores()) {
      return;
    }

    let teamName = this.name;

    if (this.challenge.teams.length >= 4) {
      if (this.teamUsageQuartile == 0) {
        teamName = "█ " + teamName;
      } else if (this.teamUsageQuartile == 1) {
        teamName = "▓ " + teamName;
      } else if (this.teamUsageQuartile == 2) {
        teamName = "▒ " + teamName;
      } else if (this.teamUsageQuartile == 3) {
        teamName = "░ " + teamName;
      }
    }

    if (
      (this.challenge.phase === ChallengePhase.vote || this.challenge.phase === ChallengePhase.post) &&
      this.challenge.teams.length >= 3
    ) {
      if (this.rankByVote == 0) {
        teamName = "§g" + teamName + " √√√ (" + this.votes + ")";
      } else if (this.rankByVote == 1) {
        teamName = "§s" + teamName + " √√ (" + this.votes + ")";
      } else if (this.rankByVote == 2) {
        teamName = "§6" + teamName + " √ (" + this.votes + ")";
      } else if (this.votes > 0) {
        teamName += " (" + this.votes + ")";
      }
    }

    teamName += "  ";

    world.scoreboard.getObjective("main")?.setScore(teamName, this.effectiveScore);
  }

  getEffectiveTeamPlayerCount() {
    let count = 0;

    for (let i = 0; i < this.players.length; i++) {
      if (!this.players[i].allowTeamChangeAlways) {
        count++;
      }
    }

    return count;
  }

  ensurePlayerIsOnTeam(challPlayer: ChallengePlayer) {
    for (let i = 0; i < this.players.length; i++) {
      if (
        this.players[i] === challPlayer ||
        this.challenge.canonicalizePlayerName(this.players[i].name) ===
          this.challenge.canonicalizePlayerName(challPlayer.name)
      ) {
        return;
      }
    }

    this.players.push(challPlayer);

    if (challPlayer.player) {
      if (challPlayer.player.isValid()) {
        try {
          challPlayer.player.setSpawnPoint({
            x: this.nwbX + SPAWN_TEAM_X,
            y: this.nwbY + SPAWN_TEAM_Y,
            z: this.nwbZ + SPAWN_TEAM_Z,
            dimension: world.getDimension("overworld"),
          });
        } catch (e) {}
      }
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
    const airBlock = BlockPermutation.resolve("minecraft:air");
    const signBlock = BlockPermutation.resolve("minecraft:wooden_slab", { wood_type: "birch" });

    if (!airBlock || !signBlock) {
      return;
    }

    Utilities.fillBlock(
      airBlock,
      this.nwbX + 5,
      this.nwbY + 1,
      this.nwbZ + 5,
      this.nwbX + (PAD_SIZE_X + PAD_SURROUND_X) - 5,
      this.nwbY + 1,
      this.nwbZ + 10
    );

    Utilities.writeTextFlatX(this.name, { x: this.nwbX + 5, y: this.nwbY + 1, z: this.nwbZ + 5 }, signBlock, airBlock);
  }

  init() {
    // console.warn("Setting score for " + this.name + " to " + this.#score);
    world.scoreboard.getObjective("main")?.setScore(this.name, this.#score);
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
      if (
        challPlayer.teamId === this.index &&
        this.challenge.phase !== ChallengePhase.post &&
        this.challenge.phase !== ChallengePhase.vote
      ) {
        let mdf = new ModalFormData();

        let name = this.name;

        if (!name) {
          name = "Unknown team";
        }

        mdf.title(name);
        mdf.textField("Name", "team name", this.name);

        let result = await mdf.show(player);

        if (result.formValues && result.formValues[0] !== undefined && typeof result.formValues[0] === "string") {
          if (!this.isValidName(result.formValues[0])) {
            player.sendMessage("New team name can only be letters or numbers, and less than 11 characters.");
          } else {
            this.name = result.formValues[0];
          }
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
        mdf.body("Nobody is on " + this.name + " yet.");
      } else {
        let teamMembers = "";

        for (let i = 0; i < this.players.length; i++) {
          if (teamMembers.length > 0) {
            teamMembers += ", ";
          }

          teamMembers += this.players[i].name;
        }

        let bodyStr = "Team members: " + teamMembers + "\r\nScore (before bonuses): " + this.blockTallyScore + "\r\n";

        if (this.challenge.phase === ChallengePhase.vote || this.challenge.phase === ChallengePhase.post) {
          if (this.rankByVote === 0) {
            bodyStr += "1st place (" + this.votes + ")\r\n";
          } else if (this.rankByVote === 0) {
            bodyStr += "2st place (" + this.votes + ")\r\n";
          } else if (this.rankByVote === 0) {
            bodyStr += "3rd place (" + this.votes + ")\r\n";
          } else {
            bodyStr += this.votes + " votes\r\n";
          }
        }

        if (this.teamUsageQuartile == 0) {
          bodyStr += "Most active group (no bonus)\r\n";
        } else if (this.teamUsageQuartile == 0) {
          bodyStr += "2nd active group (25% bonus)\r\n";
        } else if (this.teamUsageQuartile == 1) {
          bodyStr += "3rd active group (50% bonus)\r\n";
        } else if (this.teamUsageQuartile == 2) {
          bodyStr += "Least active group (double bonus)\r\n";
        }

        mdf.body(bodyStr);
      }

      mdf.button1("OK");
      mdf.button2("Cancel");

      let result = await mdf.show(player);
    }
  }

  ensurePad() {
    const foundationSurroundBlock = BlockPermutation.resolve("minecraft:grass");
    const foundationBlock = BlockPermutation.resolve("minecraft:sandstone");
    const foundationLowerBlock = BlockPermutation.resolve("minecraft:bedrock");
    const roadBlock = BlockPermutation.resolve("minecraft:red_sandstone");

    if (!foundationSurroundBlock || !foundationBlock || !roadBlock || !foundationLowerBlock) {
      return;
    }

    // east bar
    Utilities.fillBlock(
      foundationSurroundBlock,
      this.nwbX + PAD_SIZE_X + PAD_SURROUND_X / 2 - 1,
      this.nwbY - 3,
      this.nwbZ,
      this.nwbX + PAD_SIZE_X + (PAD_SURROUND_X - 1),
      this.nwbY,
      this.nwbZ + PAD_SIZE_Z + PAD_SURROUND_Z - 1
    );

    // west bar
    Utilities.fillBlock(
      foundationSurroundBlock,
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
      foundationSurroundBlock,
      this.nwbX + PAD_SURROUND_X / 2,
      this.nwbY - 3,
      this.nwbZ,
      this.nwbX + PAD_SIZE_X + PAD_SURROUND_X / 2,
      this.nwbY,
      this.nwbZ + PAD_SURROUND_Z / 2
    );

    // south bar
    Utilities.fillBlock(
      foundationSurroundBlock,
      this.nwbX + PAD_SURROUND_X / 2,
      this.nwbY - 3,
      this.nwbZ + PAD_SIZE_Z + PAD_SURROUND_Z / 2 - 1,
      this.nwbX + PAD_SIZE_X + PAD_SURROUND_X / 2,
      this.nwbY,
      this.nwbZ + PAD_SIZE_Z + (PAD_SURROUND_Z - 1)
    );

    Utilities.fillBlock(
      foundationBlock,
      this.nwbX + PAD_SURROUND_X / 2 - 2,
      this.nwbY,
      this.nwbZ + PAD_SURROUND_Z / 2 - 2,
      this.nwbX + PAD_SIZE_X + PAD_SURROUND_X / 2 - 2,
      this.nwbY,
      this.nwbZ + PAD_SIZE_Z + PAD_SURROUND_Z / 2 - 2
    );

    Utilities.fillBlock(
      foundationLowerBlock,
      this.nwbX + PAD_SURROUND_X / 2 - 2,
      this.nwbY - 4,
      this.nwbZ + PAD_SURROUND_Z / 2 - 2,
      this.nwbX + PAD_SIZE_X + PAD_SURROUND_X / 2 - 2,
      this.nwbY - 1,
      this.nwbZ + PAD_SIZE_Z + PAD_SURROUND_Z / 2 - 2
    );

    // east road
    Utilities.fillBlock(
      roadBlock,
      this.nwbX + PAD_SIZE_X + PAD_SURROUND_X - 5,
      this.nwbY,
      this.nwbZ,
      this.nwbX + PAD_SIZE_X + (PAD_SURROUND_X - 1),
      this.nwbY,
      this.nwbZ + PAD_SIZE_Z + PAD_SURROUND_Z - 1
    );

    // west road running n/s = out of bounds but filler road
    Utilities.fillBlock(
      roadBlock,
      this.nwbX - 4,
      this.nwbY,
      this.nwbZ - 4,
      this.nwbX,
      this.nwbY,
      this.nwbZ + PAD_SIZE_Z + PAD_SURROUND_Z - 1
    );

    // south road
    Utilities.fillBlock(
      roadBlock,
      this.nwbX,
      this.nwbY,
      this.nwbZ + PAD_SIZE_Z + PAD_SURROUND_Z - 5,
      this.nwbX + PAD_SIZE_X + PAD_SURROUND_X - 5,
      this.nwbY,
      this.nwbZ + PAD_SIZE_Z + PAD_SURROUND_Z - 1
    );

    // north road = out of bounds but filler road
    Utilities.fillBlock(
      roadBlock,
      this.nwbX,
      this.nwbY,
      this.nwbZ - 4,
      this.nwbX + PAD_SIZE_X + PAD_SURROUND_X - 5,
      this.nwbY,
      this.nwbZ - 1
    );

    Utilities.fillBlock(
      roadBlock,
      this.nwbX,
      this.nwbY - 10,
      this.nwbZ,
      this.nwbX + PAD_SIZE_X,
      this.nwbY - 1,
      this.nwbZ + PAD_SIZE_Z
    );

    let ow = world.getDimension("overworld");
    let block = ow.getBlock({ x: this.nwbX + JOIN_TEAM_X, y: this.nwbY + JOIN_TEAM_Y, z: this.nwbZ + JOIN_TEAM_Z });

    let consoleType = "options";

    if (this.challenge.phase === ChallengePhase.vote && this.challenge.flavor === ChallengeFlavor.regular) {
      consoleType = "vote";
    } else if (this.challenge.phase === ChallengePhase.vote && this.challenge.flavor === ChallengeFlavor.goodVibes) {
      consoleType = "vote2";
    }

    ow.runCommand(
      `/structure load challenge:${consoleType} ${this.nwbX + OPTIONS_AREA_TEAM_X} ${this.nwbY + OPTIONS_AREA_TEAM_Y} ${
        this.nwbZ + OPTIONS_AREA_TEAM_Z
      } 0_degrees `
    );

    this.addTeamName();
  }

  clearPad(index: number) {
    let airBlock = BlockPermutation.resolve("minecraft:air");

    if (airBlock) {
      Utilities.fillBlock(
        airBlock,
        this.nwbX - 4,
        this.nwbY + 1 + index * 4,
        this.nwbZ - 4,
        this.nwbX + PAD_SIZE_X + PAD_SURROUND_X,
        this.nwbY + 7 + index * 4,
        this.nwbZ + PAD_SIZE_Z + PAD_SURROUND_Z
      );
    }
  }

  getSaveData() {
    let td = {
      n: this.name,
      s: this.blockTallyScore,
      t: this.#playerTocks,
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

    if (data.t) {
      this.#playerTocks = data.t;
    }
  }
}
