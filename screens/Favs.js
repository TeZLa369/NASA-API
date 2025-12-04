import { useEffect, useState } from 'react';
import { Dimensions, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
const { height, width } = Dimensions.get("window")
import Constants from "expo-constants";
const NASA_KEY = Constants.expoConfig.extra.nasaApiKey;


const Favs = ({ navigation }) => {
  const [apiData, setApiData] = useState();
  async function fetchData() {
    try {
      const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`);
      const data = await res.json();

      setApiData(data);

    } catch (error) {
      console.log("Unable to fetch data: ", error)
    }
  }

  useEffect(() => {
    
    fetchData()
  }, [])

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.container}>
      <View style={styles.headerContainer}>
        <ImageBackground
          source={{ uri: apiData?.url }
          } resizeMode='cover'
          style={styles.headerBgImg} >

          <View style={[styles.headerSubContainer, StyleSheet.absoluteFillObject]}>
            <Image
              source={require("../assets/nasa.png")}
              style={styles.headerImg}
            />
            <Text style={styles.headertxt}>Favorites</Text>
            <ScrollView style={styles.scrlView} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
              <TouchableOpacity onPress={() => { navigation.navigate("CommonFavScreen", { pageName: "APOD" }) }}>
                <View style={styles.card}>
                  <Text style={styles.cardTxt}>APOD</Text>
                  <Image style={styles.cardImg} source={require("../assets/favAPOD.jpg")} />
                </View></TouchableOpacity>
              <TouchableOpacity onPress={() => {
                navigation.navigate("CommonFavScreen", { pageName: "ROVER" })
              }}> <View style={styles.card}>
                  <Text style={styles.cardTxt}>Rover</Text>
                  <Image style={styles.cardImg} source={require("../assets/rover2.webp")} />
                </View></TouchableOpacity>
              <TouchableOpacity onPress={() => {
                navigation.navigate("AsteroidFav")
              }}> <View style={styles.card}>
                  <Text style={styles.cardTxt}>Asteroid</Text>
                  <Image style={styles.cardImg} source={require("../assets/asteroidfav.jpg")} />
                </View></TouchableOpacity>
            </ScrollView></View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  )
}

export default Favs

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000000",
    flex: 1
  },
  headerContainer: {
    flex: 1
  },
  headerSubContainer: {
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",

  },
  headerBgImg: {
    flex: 1,
    width: width,
  },
  headerImg: {
    marginTop: 40,
    width: 100,
    height: 80,
    resizeMode: "cover",
  },
  headertxt: {
    color: "white",
    fontSize: 24,
    fontWeight: 600
  },
  scrlView: {
    marginTop: 20
  },
  card: {
    width: 0.9 * width,
    height: 0.20 * height,
    backgroundColor: "#1F1F24DD",
    marginBottom: 12,
    borderRadius: 14,
    flexDirection: "row",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16
  },
  cardTxt: {
    marginLeft: 14,
    color: "#ffffff",
    fontWeight: 600,
    fontSize: 20
  },
  cardImg: {
    width: 150,
    height: 130,
    borderRadius: 14
  }
})