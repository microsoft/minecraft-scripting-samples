import * as mc from "@minecraft/server";
import * as mcsa from "@minecraft/server-admin";
import * as mcnet from "@minecraft/server-net";

/**
 * Uses secrets and variables from dedicated server configuration files to further parameterize web requests.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server-admin/ServerSecrets
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/minecraft/server-admin/ServerVariables
 */
// @ts-ignore
export async function getPlayerProfile(log: (message: string, status?: number) => void, targetLocation: mc.Location) {
  const serverUrl = mcsa.variables.get("serverEndpoint");

  const req = new mcnet.HttpRequest(serverUrl + "getPlayerProfile");

  req.body = JSON.stringify({
    playerId: "johndoe",
  });

  req.method = mcnet.HttpRequestMethod.POST;
  req.headers = [
    new mcnet.HttpHeader("Content-Type", "application/json"),
    new mcnet.HttpHeader("auth", mcsa.secrets.get("authtoken")),
  ];

  await mcnet.http.request(req);
}
