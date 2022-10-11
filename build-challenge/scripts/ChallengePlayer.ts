import { Player } from "@minecraft/server";
import Challenge from "./Challenge";

export enum ChallengePlayerRole {
  unknown = 0,
  player = 1,
  admin = 2,
  judge = 3,
  spectator = 4,
}

export default class ChallengePlayer {
  #name: string;
  #player: Player;
  #teamId: number = -1;
  #challenge: Challenge;
  #voteA: number = -1;
  #voteB: number = -1;
  #role: ChallengePlayerRole = ChallengePlayerRole.unknown;

  get voteA() {
    return this.#voteA;
  }

  set voteA(newVote: number) {
    this.#voteA = newVote;
  }

  get voteB() {
    return this.#voteB;
  }

  set voteB(newVote: number) {
    this.#voteB = newVote;
  }

  get name() {
    return this.#name;
  }

  constructor(challenge: Challenge, name: string, player: Player) {
    this.#challenge = challenge;
    this.#player = player;
    this.#name = name;
  }

  get player() {
    return this.#player;
  }

  set player(player: Player) {
    this.#player = player;
  }

  get teamId() {
    return this.#teamId;
  }

  set teamId(newTeam: number) {
    this.#teamId = newTeam;
    this.save();
  }

  save() {
    this.#player.setDynamicProperty("challenge:teamId", this.#teamId);
    this.#player.setDynamicProperty("challenge:voteA", this.#voteA);
    this.#player.setDynamicProperty("challenge:voteB", this.#voteB);
    this.#player.setDynamicProperty("challenge:role", this.#role);
  }

  load() {
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
