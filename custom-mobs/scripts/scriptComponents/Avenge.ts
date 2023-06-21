import ScriptComponent from "../framework/ScriptComponent";
import { registerScriptComponentForTypes } from "../framework/ScriptComponentFramework";

export default class Avenge extends ScriptComponent {
  didDie() {
    console.warn("Boys! Avenge me!" + this.entity?.id);
    let peers = this.nearbyPeers();

    // avenge component makes nearby peers angry
    for (const nearbyPeer of peers) {
      nearbyPeer.triggerEvent("minecraft:on_anger");
    }
  }
}
