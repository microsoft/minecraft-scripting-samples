import * as mc from "mojang-minecraft";
import * as mcsa from "mojang-minecraft-server-admin";
import * as mcnet from "mojang-net";

/**
 * Uses secrets and variables from dedicated server configuration files to further parameterize web requests.
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://docs.microsoft.com/minecraft/creator/scriptapi/mojang-minecraft-server-admin/ServerSecrets
 * @see https://docs.microsoft.com/minecraft/creator/scriptapi/mojang-minecraft-server-admin/ServerVariables
 */
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

  const response: any = await mcnet.http.request(req);
}
