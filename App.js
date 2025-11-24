import { StatusBar } from "expo-status-bar";
import { Image, StyleSheet, Text, View } from "react-native";
import Constants from "expo-constants";
import TabNavigator from "./navigation/TabNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";

const NASA_API_KEY = Constants.expoConfig.extra.nasaApiKey;

console.log("NASA API Key:", NASA_API_KEY);

export default function App() {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  )
}



