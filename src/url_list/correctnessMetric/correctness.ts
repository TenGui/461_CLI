import { getCorrectness } from "./correctnessRunner";
import { parseFromGitLink } from "../../utils/utils";

async function main() {
    // Example Urls: 
    // https://github.com/godotengine/godot
    // https://github.com/facebookresearch/nougat
    // https://github.com/MonoGame/MonoGame
    // https://github.com/coqui-ai/TTS
    // https://github.com/meshery/meshery
    // https://github.com/williamyang1991/Rerender_A_Video
    // https://github.com/spatie/laravel-event-sourcing
    //
    // For The Stat To Work The Repo Needs To Have Valid Release Assets

    const url = parseFromGitLink("https://github.com/jonschlinkert/is-even");
    const correctness = await getCorrectness(url);
    console.log(correctness);
}

main();
