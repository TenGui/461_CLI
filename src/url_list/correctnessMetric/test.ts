import { RateLimiter } from "../../utils/apiRateLimit";
import { getCorrectness } from "./correctnessRunner";

const limiter = new RateLimiter();
const correctness = await getCorrectness("https://github.com/godotengine/godot", limiter);
console.log(correctness);