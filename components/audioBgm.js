import { Audio } from "expo-av";

let sound = null;

export async function audioBgm() {
    try {
        
        if (sound) {
            await sound.stopAsync();
            await sound.unloadAsync();
        }

        sound = new Audio.Sound();

        await sound.loadAsync(require("../assets/audio/bgm1.mp3"), {
            shouldPlay: true,
            volume: 0.15,
            isLooping: true,
        });

        await sound.playAsync();
    } catch (err) {
        console.log("Error playing audio:", err);
    }
}

export async function pauseBgm() {
    try {
        if (sound) {
            await sound.pauseAsync();
        }
    } catch (err) {
        console.log("Error pausing audio:", err);
    }
}

export async function unloadBgm() {
    try {
        if (sound) {
            await sound.unloadAsync();
            sound = null;
        }
    } catch (err) {
        console.log("Error unloading audio:", err);
    }
}
