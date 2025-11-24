import { StatusBar } from "expo-status-bar";
import { Image, StyleSheet, Text, View } from "react-native";
import Constants from "expo-constants";

const NASA_API_KEY = Constants.expoConfig.extra.nasaApiKey;

console.log("NASA API Key:", NASA_API_KEY);

export default function App() {
  return <View style={styles.container}>
    
  </View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },
});
