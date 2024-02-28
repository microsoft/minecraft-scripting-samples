import * as mc from "@minecraft/server";

/**
 * Creates and updates a scoreboard objective, plus a player score.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/Scoreboard
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/Scoreboard#addobjective
 */
export function updateScoreboard(log: (message: string, status?: number) => void, targetLocation: mc.Vector3) {
  const scoreboardObjectiveId = "scoreboard_demo_objective";
  const scoreboardObjectiveDisplayName = "Demo Objective";

  let players = mc.world.getPlayers();

  // Ensure a new objective.
  let objective = mc.world.scoreboard.getObjective(scoreboardObjectiveId);

  if (!objective) {
    objective = mc.world.scoreboard.addObjective(scoreboardObjectiveId, scoreboardObjectiveDisplayName);
  }

  // get the scoreboard identity for player 0
  let player0Identity = players[0].scoreboardIdentity;

  if (player0Identity === undefined) {
    log("Could not get a scoreboard identity for player 0.");
    return -1;
  }

  // initialize player score to 100;
  objective.setScore(player0Identity, 100);

  mc.world.scoreboard.setObjectiveAtDisplaySlot(mc.DisplaySlotId.Sidebar, {
    objective: objective,
    sortOrder: mc.ObjectiveSortOrder.Descending,
  });

  const playerScore = objective.getScore(player0Identity) ?? 0;

  // score should now be 110.
  objective.setScore(player0Identity, playerScore + 10);
}
