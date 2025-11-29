import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Pressable,
  Animated,
  TouchableOpacity,
  FlatList,
  Button
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Constants from "expo-constants";
import { useEffect, useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';





const Asteroid = () => {
  const NASA_KEY = Constants.expoConfig.extra.nasaApiKey;

  const [apiData, setApiData] = useState([]);
  const [calender, setcalender] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [monthDate, setmonthDate] = useState();
  const [customDate, setcustomDate] = useState(false)

  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0]



  const [objData, setobjData] = useState([
    {
      asteroidName: "...",
      sizeMin: "...",
      sizeMax: "...",
      threat: "...",
      speed: "...",
      distance: "...",
    }
  ]);

  async function fetchData(date) {
    try {
      const res = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${NASA_KEY}`);
      const data = await res.json();

      // console.log(data.near_earth_objects[date])
      setApiData(data.near_earth_objects[date]);
      apiMappedData();

    } catch (error) {
      console.log("Unable to fetch data: ", error)
    }
  }

  function apiMappedData() {
    // if (!apiData) return;
    try {
      let object_data1 = apiData.map(obj => ({
        asteroidName: obj?.name,
        sizeMin: obj?.estimated_diameter?.meters?.estimated_diameter_min,
        sizeMax: obj?.estimated_diameter?.meters?.estimated_diameter_max,
        threat: obj?.is_potentially_hazardous_asteroid,
        speed: obj?.close_approach_data[0]?.relative_velocity?.kilometers_per_second,
        distance: obj?.close_approach_data[0]?.miss_distance?.kilometers
      }))

      setobjData(object_data1);
    }
    catch (e) {
      console.error("Unable to mapped the data: ", e);
    }
  }

  function dateTxt() {
    if (customDate) {
      const formatted = monthDate.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"
      });
      return formatted;
    }
    else {
      const formatted = today.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"
      });
      return formatted;
    }
  }

  useEffect(() => {
    selectedDate ? fetchData(selectedDate) :
      fetchData(formattedDate);
  }, [])


  useEffect(() => {
    if (apiData) {
      apiMappedData();
    }
  }, [apiData]);

  return (
    <SafeAreaView edges={["left", "right",]} style={styles.container}>
      {/* //! TITLE */}
      <Text style={[styles.mainTxt, { fontSize: 18 }]}>Near Earth Objects</Text>

      {/* //! DATE */}
      <Pressable style={styles.dateStyle} onPress={() => {
        setcalender(true)
      }}>
        <Text style={[{ fontSize: 16, color: "#FFFFFF" }]}> 🗓️ {dateTxt()} ▼</Text>

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
            setcustomDate(true);
          }}
        />
      </Pressable>

      <FlatList
        data={objData}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>

            {/* Top Row */}
            <View style={styles.topRow}>
              <Text style={styles.asteroidName}>{item.asteroidName}</Text>
              <View style={[styles.badge, item.threat ? styles.hazardBadge : styles.safeBadge]}>
                <Text style={styles.badgeText}>
                  {item.threat ? "Hazardous" : "Safe"}
                </Text>
              </View>
            </View>

            {/* Middle Row */}
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>
                Size: {item.sizeMin}m – {item.sizeMax}m
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoText}>Speed: {item.speed} km/s</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoText}>Distance: {item.distance} km</Text>
            </View>
          </View>

        )}

        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 12, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} />


    </SafeAreaView>
  )
}

export default Asteroid

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000000",
    flex: 1,
    paddingHorizontal: 0
  },
  dateStyle: {
    margin: 8,
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
    color: "#dadada",
    paddingHorizontal: 12,
  },
  cardContainer: {
    backgroundColor: "#1A1A1D",
    borderRadius: 14,
    padding: 16,
    marginVertical: 10,
    borderColor: "#2F2F32",
    borderWidth: 1,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  asteroidName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#EDEDED",
  },

  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },

  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  hazardBadge: {
    backgroundColor: "#C02929", // red
  },

  safeBadge: {
    backgroundColor: "#138A36", // green
  },

  infoRow: {
    marginTop: 6,
  },

  infoText: {
    color: "#C5C5C5",
    fontSize: 14,
  },

})