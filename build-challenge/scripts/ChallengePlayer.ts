import { Player } from "@minecraft/server";
import Challenge from "./Challenge";

export enum ChallengePlayerRole {
  unknown = 0,
  player = 1,
  admin = 2,
  judge = 3,
  spectator = 4,
}

export interface IPlayerData {
  r: ChallengePlayerRole;
  v: number;
  x: number;
  t: number;
}

export default class ChallengePlayer {
  #name: string;
  #player?: Player;
  #teamId: number = -1;
  #challenge: Challenge;
  #voteA: number = -1;
  #voteB: number = -1;
  #role: ChallengePlayerRole = ChallengePlayerRole.unknown;

  get voteA() {
    return this.#voteA;
  }

  set voteA(newVote: number) {
    if (this.#voteA === newVote) {
      return;
    }

    this.#voteA = newVote;

    this.save();
  }

  get voteB() {
    return this.#voteB;
  }

  set voteB(newVote: number) {
    if (this.#voteB === newVote) {
      return;
    }

    this.#voteB = newVote;

    this.save();
  }

  get name() {
    return this.#name;
  }

  constructor(challenge: Challenge, name: string, player?: Player) {
    this.#challenge = challenge;
    this.#player = player;
    this.#name = name;
  }

  get player() {
    return this.#player;
  }

  set player(player: Player | undefined) {
    this.#player = player;
  }

  get teamId() {
    return this.#teamId;
  }

  set teamId(newTeam: number) {
    this.#teamId = newTeam;
    this.save();
  }

  getSaveData() {
    let pd = {
      r: this.#role,
      t: this.#teamId,
      v: this.#voteA,
      x: this.#voteB,
    };

    return pd;
  }

  loadFromData(data: IPlayerData) {
    if (data.v) {
      this.#voteA = data.v;
    }
    if (data.x) {
      this.#voteB = data.x;
    }
    if (data.t) {
      this.#teamId = data.t;
    }
    if (data.r) {
      this.#role = data.r;
    }
  }

  save() {
    if (!this.#player) {
      return;
    }

    this.#player.setDynamicProperty("challenge:teamId", this.#teamId);
    this.#player.setDynamicProperty("challenge:voteA", this.#voteA);
    this.#player.setDynamicProperty("challenge:voteB", this.#voteB);
    this.#player.setDynamicProperty("challenge:role", this.#role);
  }

  load() {
    if (!this.#player) {
      return;
    }

    this.#teamId = this.#player.getDynamicProperty("challenge:teamId") as number;

    if (this.#teamId === undefined) {
      this.#teamId = -1;
    }

    let val = this.#player.getDynamicProperty("challenge:voteA") as number;
    if (val === undefined) {
      this.#voteA = -1;
    } else {
      this.#voteA = val;
    }

    val = this.#player.getDynamicProperty("challenge:voteB") as number;
    if (val === undefined) {
      this.#voteB = -1;
    } else {
      this.#voteB = val;
    }

    val = this.#player.getDynamicProperty("challenge:role") as number;
    if (val === undefined) {
      this.#role = ChallengePlayerRole.unknown;
    } else {
      this.#role = val;
    }
  }
}
