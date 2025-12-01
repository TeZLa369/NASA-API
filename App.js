import { StatusBar } from "expo-status-bar";
import TabNavigator from "./navigation/TabNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { useEffect } from "react";
import {audioBgm, unloadBgm } from "./components/audioBgm";
import { Audio } from "expo-av";


export default function App() {

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
    <NavigationContainer>
      <StatusBar style="light" />
      <TabNavigator />
    </NavigationContainer>
  )
}



