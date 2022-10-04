import * as mc from "@minecraft/server";
import * as mcnet from "@minecraft/server-net";

/**
 * Updates score on a local server
 * @param {(message: string, status?: number) => void} log: Logger function. If status is positive, test is a success. If status is negative, test is a failure.
 * @param {mc.Location} location Location to center this sample code around.
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/@minecraft/server-net/HttpRequest
 * @see https://learn.microsoft.com/minecraft/creator/scriptapi/@minecraft/server-net/HttpHeader
 */
// @ts-ignore
export async function updateScore(log: (message: string, status?: number) => void, targetLocation: mc.Location) {
  const req = new mcnet.HttpRequest("http://localhost:3000/updateScore");

  req.body = JSON.stringify({
    score: 22,
  });

  req.method = mcnet.HttpRequestMethod.POST;
  req.headers = [
    new mcnet.HttpHeader("Content-Type", "application/json"),
    new mcnet.HttpHeader("auth", "my-auth-token"),
  ];

  await mcnet.http.request(req);
}
