import { Feather, Ionicons, FontAwesome5 } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Dimensions, FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from 'expo-sharing';



const { height: screen_height } = Dimensions.get("window");

const Mars_rover = () => {
  const [apiData, setapiData] = useState([])
  const [activeIndex, setActiveIndex] = useState(0);
  const [pageNo, setpageNo] = useState(0);
  const [loading, setLoading] = useState(false);
  const [marsData, setmarsData] = useState([]);
  const [fav, setfav] = useState(false);


  // const [marsData, setMarsData] = useState([
  //   {
  //     id: "1",
  //     title: "Perseverance Rover",
  //     camera: "Right Mastcam-Z",
  //     sol: "1698",
  //     date: "Nov 29, 2025",
  //     image: require("../assets/mars_man.jpg"),
  //     caption:
  //       "NASA's Mars Perseverance rover acquired this image using its onboard Right Navigation Camera (Navcam).",
  //   },
  //   {
  //     id: "2",
  //     title: "Curiosity Rover",
  //     camera: "Front Hazcam",
  //     sol: "3250",
  //     date: "Oct 15, 2025",
  //     image: require("../assets/noPic2.png"),
  //     caption:
  //       "Curiosity captured this view with its front hazard avoidance camera while navigating rocky terrain.",
  //   },
  //   {
  //     id: "3",
  //     title: "Spirit Rover",
  //     camera: "Panoramic Camera",
  //     sol: "200",
  //     date: "May 12, 2005",
  //     image: require("../assets/noPic3.png"),
  //     caption:
  //       "Spirit rover used its panoramic camera to capture a wide-angle view of the Martian surface.",
  //   },
  //   {
  //     id: "4",
  //     title: "Opportunity Rover",
  //     camera: "Microscopic Imager",
  //     sol: "1500",
  //     date: "Aug 20, 2008",
  //     image: require("../assets/noPic3.png"),
  //     caption:
  //       "Opportunity examined soil samples with its microscopic imager to study Martian geology.",
  //   },
  // ]);

  async function saveData(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
      console.log("Data is saved");
    } catch (error) {
      console.error("Can't add to fav: ", error);
    }
  }
  async function removeData(key) {
    try {
      await AsyncStorage.removeItem(key);
      console.log("Data is removed");
    } catch (error) {

      console.error("Can't remove from fav: ", error);
    }
  }


  async function load(key) {
    try {
      const data = await AsyncStorage.getItem(key);
      // console.log(data)
      return data;
    } catch (error) {
      console.log("Error while loading data: ", error);
    }
  }


  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  });
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 80 });

  async function fetchData() {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`https://mars.nasa.gov/rss/api/?feed=raw_images&category=mars2020&feedtype=json&page=${pageNo}&num=10`);
      const data = await res.json();
      setapiData(prev => [...prev, ...data.images]);
      // console.log(data.images[0].image_files.medium);


      setpageNo(prev => prev + 1);
      setLoading(false);



    } catch (error) {
      console.log("Unable to fetch data: ", error);
    }
  }


  function mappedData() {
    try {
      let mapData = apiData.map(obj => ({
        imageID: "rover" + obj?.imageid,
        sol: obj?.sol,
        image: { uri: obj?.image_files?.medium },
        camera: obj?.camera?.instrument,
        caption: obj?.caption,
        date: (obj?.date_taken_utc).split("T")[0]
      }))
      setmarsData(mapData);

    } catch (error) {
      console.log("Unable to map data: ", error);
    }
  }

  function getDate(index) {
    // if (!marsData.length === 0) {
    const oldDate = new Date(marsData[index]?.date);
    // console.log(marsData[0].date)
    const newDate = oldDate.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    })
    // console.log(newDate)
    return newDate;
  }

  async function checkFav(imgID) {
    if (await load(imgID) === null) {
      setfav(false)
    } else {
      setfav(true)
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (apiData.length > 0) mappedData();
  }, [apiData]);



  async function saveImage(uri) {
    try {
      const fileUri = FileSystem.cacheDirectory + "img.jpg";

      const downloaded = await FileSystem.downloadAsync(uri, fileUri);

      const asset = await MediaLibrary.createAssetAsync(downloaded.uri);
      await MediaLibrary.createAlbumAsync("Download", asset, false);

      alert("Image has been saved!");
    } catch (e) {
      console.log(e);
    }
  }

  async function shareImage(url) {
    try {
      const fileUri = FileSystem.cacheDirectory + "shared_image.jpg";

      // 1️⃣ Download image
      const { uri } = await FileSystem.downloadAsync(url, fileUri);

      // 2️⃣ Share it
      await Sharing.shareAsync(uri);

    } catch (error) {
      console.log("Share error:", error);
    }
  }

  return (
    // <View style={{ height: screen_height }}>
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      {(
        marsData.length === 0 ? (<>
          <View style={{ justifyContent: "center", flex: 1, gap: 8 }} >
            <ActivityIndicator size="large" color="white" />
            <Text style={styles.metaTxt}>Loading universe...</Text></View>
        </>
        ) :

          <ImageBackground
            source={marsData[activeIndex].image}
            blurRadius={25}
            fadeDuration={1000}
            style={styles.imgBackground}>
            <View style={[{
              backgroundColor: 'rgba(0,0,0,0.4)'
            }, StyleSheet.absoluteFillObject]} >
              <FlatList
                data={marsData}
                renderItem={({ item, index }) => (
                  // console.log("inSide",item.imageID),
                  // checkFav(item.imageID),
                  <View style={[styles.cardContainer, { height: screen_height }]}>
                    <Text style={styles.mainTxt}>Perseverance on Mars</Text>

                    <View style={styles.picMetaDataContainer}>
                      <Text style={styles.metaTxt}>{item.camera} • </Text>
                      <Text style={styles.metaTxt}>Sol {item.sol} • </Text>
                      <Text style={styles.metaTxt}>{getDate(index)}</Text>
                    </View>

                    <View style={styles.imgContainer}>
                      <Image style={styles.imgStyle}
                        source={item.image}
                        fadeDuration={1000}
                      />
                      <Text style={styles.caption}>{item.caption}</Text>
                    </View>

                    {/* //! BTN */}
                    <View style={styles.btnContainer}>
                      {/* //! FETCHHHH */}
                      <TouchableOpacity onPress={() => {
                        setfav(!fav);
                        !fav ?
                          saveData(item.imageID, (item.imageID).split("rover")[1]) : removeData(item.imageID);
                      }}>
                        <View style={styles.btnIconContainer}>
                          <Ionicons name='heart' size={20} color={

                            !fav ? "#D7D7D7FF" : "#DF0000FF"} />
                          <Text style={styles.btnTxt}>Favorite</Text></View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => {
                        // console.log(item.image.uri)
                        saveImage(item.image.uri)
                      }}>
                        <View style={styles.btnIconContainer}>
                          <Feather name='download' size={20} color={"#D7D7D7FF"} />
                          <Text style={styles.btnTxt}>Download</Text></View></TouchableOpacity>
                      <TouchableOpacity onPress={() => { shareImage(item.image.uri) }}>
                        <View style={styles.btnIconContainer}>
                          <FontAwesome5 name='share' size={19} color={"#D7D7D7FF"} />
                          <Text style={styles.btnTxt}>Share</Text></View>
                      </TouchableOpacity>
                    </View>
                  </View>

                )}
                pagingEnabled
                snapToInterval={screen_height}
                decelerationRate="normal"
                onViewableItemsChanged={onViewRef.current}
                viewabilityConfig={viewConfig.current}
                keyExtractor={(item, index) => index.toString()}
                onScroll={() => { checkFav(marsData[activeIndex].imageID) }}
                ListFooterComponent={loading && <ActivityIndicator size="large" color="white" />}
                onEndReached={fetchData}
                onEndReachedThreshold={0.5}
                contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 12, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}

              />
            </View></ImageBackground >
      )
      }</SafeAreaView >

  )
}

export default Mars_rover

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000000",
    flex: 1,
    paddingLeft: 0,
    paddingRight: 0,
  },
  mainTxt: {
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
    fontSize: 24,
    marginTop: "14%",
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
    textAlign: "center",
    color: "#E8E6E6FF"
  },
  cardContainer: {
    paddingBottom: 20,
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
    color: "#E8E6E6FF",
    textAlign: "justify",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: "6%",
  },
  btnContainer: {
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
})