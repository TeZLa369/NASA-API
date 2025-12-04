import { StatusBar } from "expo-status-bar";
import TabNavigator from "./navigation/TabNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { useEffect } from "react";
import { audioBgm, unloadBgm } from "./components/audioBgm";
import { Audio } from "expo-av";
import * as MediaLibrary from "expo-media-library";





export default function App() {

  async function requestPermission() {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Permission denied!");
    }
  }
  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      staysActiveInBackground: false,
    });

    audioBgm();

    return () => {
      unloadBgm();
    };

  }, []);

  return (
    <NavigationContainer >
      <StatusBar style="light" />
      <TabNavigator />
    </NavigationContainer>
  )
}



