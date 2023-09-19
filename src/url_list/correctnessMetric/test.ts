import { RateLimiter } from "../../utils/apiRateLimit";
import { getCorrectness } from "./correctnessRunner";

const limiter = new RateLimiter();
async function main() {
    // Example Urls: 
    // https://github.com/godotengine/godot
    // https://github.com/facebookresearch/nougat
    // https://github.com/MonoGame/MonoGame
    const correctness = await getCorrectness("https://github.com/MonoGame/MonoGame");
    console.log(correctness);
}

main();
