import BlackBear from "./entities/BlackBear";
import Butterfly from "./entities/Butterfly";
import Avenge from "./scriptComponents/Avenge";

import { initEntityFramework, registerEntityType } from "./framework/EntityFramework";
import { initScriptComponentFramework, registerScriptComponentForTypes } from "./framework/ScriptComponentFramework";
import { Environment } from "./environment/Environment";

initEntityFramework();
initScriptComponentFramework();

registerEntityType("mcl:butterfly", Butterfly);
registerEntityType("mcl:black_bear", BlackBear);

registerScriptComponentForTypes("mcl:avenge", Avenge, ["mcl:biceson"]);

Environment.create({ x: 0, y: -60, z: -4 });
