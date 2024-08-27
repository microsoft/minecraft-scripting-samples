import { DimensionLocation, DisplaySlotId, ObjectiveSortOrder, world } from "@minecraft/server";

/**
 * Creates and updates a scoreboard objective, plus a player score.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {DimensionLocation} targetLocation Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/Scoreboard
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server/Scoreboard#addobjective
 */
export function updateScoreboard(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const scoreboardObjectiveId = "scoreboard_demo_objective";
  const scoreboardObjectiveDisplayName = "Demo Objective";

  const players = world.getPlayers();

  // Ensure a new objective.
  let objective = world.scoreboard.getObjective(scoreboardObjectiveId);

  if (!objective) {
    objective = world.scoreboard.addObjective(scoreboardObjectiveId, scoreboardObjectiveDisplayName);
  }

  // get the scoreboard identity for player 0
  const player0Identity = players[0].scoreboardIdentity;

  if (player0Identity === undefined) {
    log("Could not get a scoreboard identity for player 0.");
    return -1;
  }

  // initialize player score to 100;
  objective.setScore(player0Identity, 100);

  world.scoreboard.setObjectiveAtDisplaySlot(DisplaySlotId.Sidebar, {
    objective: objective,
    sortOrder: ObjectiveSortOrder.Descending,
  });

  const playerScore = objective.getScore(player0Identity) ?? 0;

  // score should now be 110.
  objective.setScore(player0Identity, playerScore + 10);
}
