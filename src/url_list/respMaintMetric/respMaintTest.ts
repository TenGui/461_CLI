import { RateLimiter } from "../../utils/apiRateLimit";
import { getRespMaintScore } from "./respMaintRunner";

const limiter = new RateLimiter();
async function main() {
    // Example Urls: 
    // https://github.com/godotengine/godot
    // https://github.com/facebookresearch/nougat
    // https://github.com/MonoGame/MonoGame
    const respMaint = await getRespMaintScore(["MonoGame", "MonoGame"]);
    console.log(respMaint);
}

main();