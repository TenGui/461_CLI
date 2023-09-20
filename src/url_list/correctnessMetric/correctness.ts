import { getCorrectness } from "./correctnessRunner";

async function main() {
    // Example Urls: 
    // https://github.com/godotengine/godot
    // https://github.com/facebookresearch/nougat
    // https://github.com/MonoGame/MonoGame
    // https://github.com/coqui-ai/TTS
    // https://github.com/meshery/meshery
    // For The Stat To Work The Repo Needs To Have Valid Release Assets

    const correctness = await getCorrectness("https://github.com/williamyang1991/Rerender_A_Video");
    console.log(correctness);
}

main();
