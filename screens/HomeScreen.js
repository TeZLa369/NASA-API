import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Pressable,
  Animated,
  TouchableOpacity
} from 'react-native';

import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { LinearGradient } from 'expo-linear-gradient';
import FullSkeleton from '../components/FullSkeleton';
import Ionicons from '@react-native-vector-icons/ionicons';


const HomeScreen = () => {
  const [calender, setcalender] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [monthDate, setmonthDate] = useState();
  const [readMorePressed, setReadMorePressed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [fav, setfav] = useState(false);
  const [apiData, setApiData] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(6)).current;

  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0]


  function startFade() {
    setImageLoaded(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();

    Animated.timing(translateAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start();
  }

  async function fetchData(date) {

    try {
      const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=FslTHKX6MyjOnvyW0hlGl5r3AEb1eY9qBv8hXu7P&date=${date}`);
      const data = await res.json();

      setApiData(data);

    } catch (error) {
      console.log("Unable to fetch data: ", error)
    }
  }

  useEffect(() => {
    selectedDate ? fetchData(selectedDate) :
      fetchData(formattedDate);
  }, [])

  let expTxt;
  { apiData ? expTxt = apiData.explanation : expTxt = "Loading..." }

  function apiDate() {
    if (!apiData || !apiData.date) return "Loading date...";
    const date = new Date(apiData?.date);

    const newDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    })
    return newDate;

  }

  function dateTxt() {
    const formatted = monthDate?.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    });
    return formatted;
  }

  // ! FAV Data
  const favData = {
    date: dateTxt() ? dateTxt() : apiDate(),
    title: apiData?.title,
    url: apiData?.url,
    explanation: expTxt,
  }

  async function saveData(key, value) {
    // await AsyncStorage.setItem("21", "value");
    try {
    } catch (error) {
      console.error("Can't add to fav: ", error);
    }
  }


  return (
    <SafeAreaView edges={["left", "right",]} style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 12, paddingBottom: 40 }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <StatusBar barStyle='light-content' />
        {/* //! TITLE */}
        <Text style={[styles.mainTxt, { fontSize: 18 }]}>Astronomy Picture of the Day</Text>

        {/* //! DATE */}
        <Pressable style={styles.dateStyle} onPress={() => {
          setcalender(true)
        }}>
          <Text style={[{ fontSize: 16, color: "#FFFFFF" }]}> 🗓️ {dateTxt() ? dateTxt() : apiDate()} ▼</Text>

          <DateTimePickerModal
            isVisible={calender}
            mode='date'
            minimumDate={new Date(1995, 5, 16)}
            maximumDate={new Date()}
            themeVariant='dark'
            date={monthDate}
            onCancel={() => { setcalender(false); }}
            onConfirm={(date) => {
              const formattedDate = date.toISOString().split("T")[0];
              setSelectedDate(formattedDate);
              setmonthDate(date)
              fetchData(formattedDate);
              setcalender(false);
            }}
          />
        </Pressable>


        <View style={styles.imageContainer}>
          {!imageLoaded && <FullSkeleton width="100%" imageHeight={250} />}

          <Animated.View
            style={{
              ...StyleSheet.absoluteFillObject,
              opacity: fadeAnim,
              transform: [{ translateY: translateAnim }],
            }}
          >
            {/* //! IMAGE */}
            <Image
              source={{ uri: apiData ? apiData.url : "" }}
              style={{ width: '100%', height: '100%', borderRadius: 12 }}
              onLoadEnd={() => startFade()}
            />

            {/* //! HEART */}
            <View style={styles.favoriteBtn}>
              <TouchableOpacity onPress={() => {
                setfav(!fav);

              }}>
                {fav ?
                  (<Ionicons name='heart' size={24} color={"#DF0000FF"} />) :
                  (<Ionicons name='heart' color={"#D0D0D0FF"} size={24} />)
                }

              </TouchableOpacity>
            </View>


            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.85)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.gradient}
            />

            <Animated.Text
              style={[
                styles.subtitle,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: translateAnim }],
                }
              ]}
            >
              {apiData ? apiData.title : "Loading Title..."}
            </Animated.Text>
          </Animated.View>
        </View>


        {/* //! EXPLANATION */}
        <View style={{
          marginTop: 14
        }}>
          {readMorePressed ? (<><Text style={styles.explanation} >{expTxt}</Text>
            <Pressable onPress={() => { setReadMorePressed(false) }}>
              <Text style={[styles.explanation, { color: "#1E90FF", marginTop: 4, fontWeight: 500 }]}>See less</Text>
            </Pressable>
          </>
          ) : (
            <>{
              expTxt.length > 220 ? (
                <><Text style={styles.explanation}>
                  {expTxt.substring(0, 220)}...
                </Text><Pressable onPress={() => { setReadMorePressed(true) }}>
                    <Text style={{ color: "#1E90FF", marginTop: 4, fontWeight: 500 }}>Read more</Text>
                  </Pressable>
                </>
              ) : (<Text style={styles.explanation}>{expTxt}</Text>)
            }</>)}
        </View>
        <Text style={styles.credits}>© NASA APOD</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000000",
    flex: 1,
    paddingHorizontal: 0
  },
  dateStyle: {
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: "#111111",
    borderWidth: 0.2,
    borderColor: "#1E90FF",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  mainTxt: {
    textAlign: "left",
    marginTop: 6,
    fontSize: 20,
    color: "#dadada"
  },
  imageContainer: {
    overflow: "hidden",
    position: "relative",
    width: "100%",
    height: 250,
    borderRadius: 12,
    shadowColor: "#ffff",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "45%",

  },
  imageStyle: {
    borderRadius: 12,
    resizeMode: "cover"
  },

  favoriteBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 8,
    borderRadius: 24
  },

  subtitle: {
    position: "absolute",
    bottom: 12,
    left: 12,
    fontSize: 18,
    color: "white",
    fontWeight: "600",
    textShadowColor: 'rgba(0,0,0,0.8)'
  },
  explanation: {
    marginTop: 12,
    color: "#A4A4A4",
    lineHeight: 22,
    textAlign: "justify",
  },
  credits: {
    color: "#555",
    fontSize: 12,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10
  }

})