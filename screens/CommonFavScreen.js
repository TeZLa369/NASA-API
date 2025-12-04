import { Feather, Ionicons, FontAwesome5 } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from 'expo-sharing';
import Constants from "expo-constants";

const NASA_KEY = Constants.expoConfig.extra.nasaApiKey;
const { height: screen_height } = Dimensions.get("window");

const CommonFavScreen = ({ route }) => {

  const { pageName } = route.params;

  const [apiData, setapiData] = useState([]);
  const [marsData, setmarsData] = useState([]);
  const [APODapiData, setAPODApiData] = useState([]);
  const [favKeys, setfavKeys] = useState([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [pageNo, setpageNo] = useState(0);
  const [fav, setfav] = useState(false);


  const [loading, setLoading] = useState(true);


  async function saveData(key, value) {
    await AsyncStorage.setItem(key, value);
    await getAllKeys(); 
  }

  async function removeData(key) {
    await AsyncStorage.removeItem(key);
    await getAllKeys(); 
  }

  async function load(key) {
    return await AsyncStorage.getItem(key);
  }

  async function getAllKeys() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      setfavKeys(keys);
      return keys;
    } catch (e) {
      return [];
    }
  }

  async function fetchRover() {
    setLoading(true);
    await getAllKeys();

    try {
      const res = await fetch(
        `https://mars.nasa.gov/rss/api/?feed=raw_images&category=mars2020&feedtype=json&page=${pageNo}&num=10`
      );
      const data = await res.json();
      setapiData(prev => [...prev, ...data.images]);
      setpageNo(prev => prev + 1);
    } catch (err) {
      console.log("Fetch rover error:", err);
    }
    setLoading(false);
  }

  function mapRoverFavorites() {
    try {
      const filtered = apiData.filter(x =>
        favKeys.includes("rover" + x.imageid)
      );

      const mapped = filtered.map(obj => ({
        imageID: "rover" + obj.imageid,
        sol: obj.sol,
        image: { uri: obj.image_files?.medium },
        camera: obj.camera?.instrument,
        caption: obj.caption,
        date: obj.date_taken_utc.split("T")[0],
      }));

      setmarsData(mapped);
    } catch (err) {
      console.log("Rover map error:", err);
    }
  }


  async function loadAPODFavs() {
    setLoading(true);
    try {
      const currentKeys = await getAllKeys();

      const dateKeys = currentKeys.filter(k => k.length === 10);
      let results = [];

      const promises = dateKeys.map(async (d) => {
        try {
          const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}&date=${d}`);
          return await res.json();
        } catch (e) { return null; }
      });

      const fetchedData = await Promise.all(promises);
      setAPODApiData(fetchedData.filter(i => i !== null));

    } catch (err) {
      console.log("APOD fav load error:", err);
    }
    setLoading(false);
  }

 

  useEffect(() => {
    if (pageName === "ROVER") fetchRover();
    if (pageName === "APOD") loadAPODFavs();
  }, []);

  useEffect(() => {
    if (apiData.length > 0 && pageName === "ROVER") mapRoverFavorites();
  }, [apiData, favKeys]);

  async function checkFav(id) {
    if (!id) return;
    const saved = await load(id);
    setfav(saved !== null);
  }

  useEffect(() => {
    if (pageName === "ROVER" && marsData.length > 0) {
      checkFav(marsData[activeIndex]?.imageID);
    }
    if (pageName === "APOD" && APODapiData.length > 0) {
      checkFav(APODapiData[activeIndex]?.date);
    }
  }, [activeIndex, marsData, APODapiData]);



  async function saveImage(uri) {
    try {
      const fileUri = FileSystem.cacheDirectory + "img.jpg";
      const downloaded = await FileSystem.downloadAsync(uri, fileUri);
      const asset = await MediaLibrary.createAssetAsync(downloaded.uri);
      await MediaLibrary.createAlbumAsync("Download", asset, false);
      alert("Image saved!");
    } catch (e) {
      console.log(e);
    }
  }

  async function shareImage(uri) {
    try {
      const fileUri = FileSystem.cacheDirectory + "shared_image.jpg";
      const { uri: localUri } = await FileSystem.downloadAsync(uri, fileUri);
      await Sharing.shareAsync(localUri);
    } catch (error) {
      console.log("Share error:", error);
    }
  }

  

  const renderRover = ({ item }) => (
    <View style={[styles.cardContainer, { height: screen_height }]}>
      <Text style={styles.mainTxt}>Perseverance on Mars</Text>

      <View style={styles.picMetaDataContainer}>
        <Text style={styles.metaTxt}>{item.camera} • </Text>
        <Text style={styles.metaTxt}>Sol {item.sol} • </Text>
        <Text style={styles.metaTxt}>{item.date}</Text>
      </View>

      <View style={styles.imgContainer}>
        <Image style={styles.imgStyle} source={item.image} />
        <View style={{ maxHeight: 180 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.caption}>{item.caption}</Text>
          </ScrollView>
        </View>
      </View>

      <View style={styles.btnContainer}>
        <TouchableOpacity onPress={() => {
          setfav(!fav);
          !fav ? saveData(item.imageID, item.imageID) : removeData(item.imageID);
        }}>
          <View style={styles.btnIconContainer}>
            <Ionicons name='heart' size={20} color={fav ? "#DF0000" : "#D7D7D7"} />
            <Text style={styles.btnTxt}>Favorite</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => saveImage(item.image.uri)}>
          <View style={styles.btnIconContainer}>
            <Feather name='download' size={20} color={"#D7D7D7"} />
            <Text style={styles.btnTxt}>Download</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => shareImage(item.image.uri)}>
          <View style={styles.btnIconContainer}>
            <FontAwesome5 name='share' size={19} color={"#D7D7D7"} />
            <Text style={styles.btnTxt}>Share</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAPOD = ({ item }) => (
    <View style={[styles.cardContainer, { height: screen_height }]}>

      <Text style={styles.mainTxt}>APOD Favorites</Text>

      <View style={styles.picMetaDataContainer}>
        <Text style={styles.metaTxt}>{item.date}</Text>
      </View>

      <View style={styles.imgContainer}>
        <Image style={styles.imgStyle} source={{ uri: item.url }} />

        <View style={{ maxHeight: 180 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.caption}>{item.explanation}</Text>
          </ScrollView>
        </View>
      </View>

      <View style={styles.btnContainer}>

        <TouchableOpacity onPress={() => {
          removeData(item.date);
          loadAPODFavs();
        }}>
          <View style={styles.btnIconContainer}>
            <Ionicons name='heart' size={20} color={"#DF0000"} />
            <Text style={styles.btnTxt}>Remove</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => saveImage(item.url)}>
          <View style={styles.btnIconContainer}>
            <Feather name='download' size={20} color={"#D7D7D7"} />
            <Text style={styles.btnTxt}>Download</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => shareImage(item.url)}>
          <View style={styles.btnIconContainer}>
            <FontAwesome5 name='share' size={19} color={"#D7D7D7"} />
            <Text style={styles.btnTxt}>Share</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );


  const activeData = pageName === "ROVER" ? marsData : APODapiData;


  const bgImg = activeData[activeIndex]
    ? (pageName === "ROVER" ? activeData[activeIndex].image : { uri: activeData[activeIndex].url })
    : require("../assets/black.png"); 


  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerView}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.metaTxt}>Loading Favorites...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (!loading && activeData.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerView}>
          <Ionicons name="heart-dislike-outline" size={50} color="white" />
          <Text style={[styles.mainTxt, { marginTop: 20 }]}>No Favorites Found</Text>
          <Text style={styles.metaTxt}>Go back and add some!</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <ImageBackground
        source={bgImg}
        blurRadius={25}
        style={styles.imgBackground}
      >
        <View style={[{ backgroundColor: "rgba(0,0,0,0.4)" }, StyleSheet.absoluteFillObject]}>

          <FlatList
            data={activeData}
            renderItem={pageName === "ROVER" ? renderRover : renderAPOD}
            pagingEnabled
            snapToInterval={screen_height}
            onViewableItemsChanged={({ viewableItems }) => {
              if (viewableItems.length > 0) {
                setActiveIndex(viewableItems[0].index);
              }
            }}
            viewabilityConfig={{ viewAreaCoveragePercentThreshold: 80 }}
            keyExtractor={(item, index) => index.toString()}
          />

        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default CommonFavScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    flex: 1
  },
  centerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10
  },
  mainTxt: {
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
    marginTop: "14%",
    fontWeight: "600"
  },
  imgBackground: {
    flex: 1,
  },
  picMetaDataContainer: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "center"
  },
  metaTxt: {
    fontSize: 14,
    color: "#E8E6E6"
  },
  cardContainer: {
    paddingBottom: 20,
    marginRight: 14,
    marginLeft: 14,
  },
  imgContainer: {
    marginTop: 20,
    gap: 12,
  },
  imgStyle: {
    width: "100%",
    height: 300,
    borderRadius: 20,
  },
  caption: {
    color: "#E8E6E6",
    fontSize: 15,
    textAlign: "justify",
    lineHeight: 22,
    marginBottom: "6%",
  },
  btnContainer: {
    marginTop: 12,
    alignContent: "center",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  btnIconContainer: {
    flexDirection: "row",
    backgroundColor: "#0000003B",
    padding: 8,
    gap: 8,
    borderRadius: 12
  },
  btnTxt: {
    color: "#D7D7D7FF"
  },
});