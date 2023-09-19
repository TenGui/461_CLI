import { RateLimiter } from "../../utils/apiRateLimit";
import { getCorrectness } from "./correctnessRunner";

const limiter = new RateLimiter();
async function main() {
    const correctness = await getCorrectness("https://github.com/godotengine/godot");
    console.log(correctness);
}

main();
