import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from "expo-constants";
import { useEffect, useState, useCallback } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Asteroid = () => {
  const NASA_KEY = Constants.expoConfig?.extra?.nasaApiKey || "DEMO_KEY"; // Fallback if config is missing

  const [loading, setLoading] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Initial state is empty array, not dummy data
  const [objData, setObjData] = useState([]);

  // Helper to format date as YYYY-MM-DD (Local Time, not UTC)
  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDisplayDate = () => {
    return selectedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    });
  };

  // 1. Check if item is saved in AsyncStorage
  const isAsteroidSaved = async (id) => {
    try {
      const item = await AsyncStorage.getItem("nro" + id);
      return item !== null;
    } catch (e) {
      return false;
    }
  };

  // 2. Fetch, Map, and Check Favorites in one flow
  const fetchData = async (dateObj) => {
    setLoading(true);
    const dateStr = formatDateForAPI(dateObj);

    try {
      const res = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${dateStr}&end_date=${dateStr}&api_key=${NASA_KEY}`);
      const data = await res.json();

      const rawList = data.near_earth_objects?.[dateStr] || [];

      // Process all items in parallel
      const processedData = await Promise.all(rawList.map(async (obj) => {
        const savedStatus = await isAsteroidSaved(obj.id);

        return {
          id: obj.id,
          asteroidName: obj.name,
          sizeMin: Math.round(obj.estimated_diameter?.meters?.estimated_diameter_min),
          sizeMax: Math.round(obj.estimated_diameter?.meters?.estimated_diameter_max),
          threat: obj.is_potentially_hazardous_asteroid,
          speed: parseFloat(obj.close_approach_data[0]?.relative_velocity?.kilometers_per_second).toFixed(2),
          distance: parseFloat(obj.close_approach_data[0]?.miss_distance?.kilometers).toFixed(0),
          saved: savedStatus
        };
      }));

      setObjData(processedData);

    } catch (error) {
      console.log("Unable to fetch data: ", error);
      Alert.alert("Error", "Failed to fetch asteroid data.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (item) => {
    setObjData(prev => prev.map(el =>
      el.id === item.id ? { ...el, saved: !el.saved } : el
    ));

    const key = "nro" + item.id;
    try {
      if (!item.saved) {
        await AsyncStorage.setItem(key, JSON.stringify({ ...item, saved: true }));
      } else {

        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error("Storage Error", error);
    }
  };

  useEffect(() => {
    fetchData(selectedDate);
  }, [selectedDate]);

  return (
    <SafeAreaView edges={["left", "right"]} style={styles.container}>
      <Text style={styles.mainTxt}>Near Earth Objects</Text>

      {/* DATE PICKER */}
      <Pressable style={styles.dateStyle} onPress={() => setCalendarVisible(true)}>
        <Text style={styles.dateText}> 🗓️ {getDisplayDate()} ▼</Text>
      </Pressable>

      <DateTimePickerModal
        isVisible={calendarVisible}
        mode='date'
        maximumDate={new Date()}
        themeVariant='dark'
        date={selectedDate}
        onConfirm={(date) => {
          setSelectedDate(date);
          setCalendarVisible(false);
        }}
        onCancel={() => setCalendarVisible(false)}
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1E90FF" />
          <Text style={{ color: '#888', marginTop: 10 }}>Scanning Space...</Text>
        </View>
      ) : (
        <FlatList
          data={objData}
          // IMPORTANT: Use ID, not index
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 12, paddingBottom: 40 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No asteroids found near earth today.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>

              {/* Top Row */}
              <View style={styles.topRow}>
                {/* Limit name width to prevent overlap */}
                <Text style={styles.asteroidName} numberOfLines={1}>
                  {item.asteroidName.replace(/[()]/g, '')}
                </Text>
                <View style={[styles.badge, item.threat ? styles.hazardBadge : styles.safeBadge]}>
                  <Text style={styles.badgeText}>
                    {item.threat ? "Hazardous" : "Safe"}
                  </Text>
                </View>
              </View>

              {/* Data Rows */}
              <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Diameter</Text>
                  <Text style={styles.value}>{item.sizeMin}m - {item.sizeMax}m</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Speed</Text>
                  <Text style={styles.value}>{item.speed} km/s</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Distance</Text>
                  <Text style={styles.value}>{Number(item.distance).toLocaleString()} km</Text>
                </View>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.favButton}
                  onPress={() => toggleFavorite(item)}
                >
                  <Ionicons
                    name={item.saved ? 'heart' : 'heart-outline'}
                    size={24}
                    color={item.saved ? "#DF0000" : "#D7D7D7"}
                  />
                  <Text style={{ color: '#aaa', marginLeft: 8 }}>
                    {item.saved ? "Saved" : "Save"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default Asteroid;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000000",
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dateStyle: {
    margin: 12,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#333",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#1E90FF",
    fontWeight: "bold"
  },
  mainTxt: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: 'bold',
    color: "#fff",
    paddingHorizontal: 16,
  },
  emptyText: {
    color: '#555',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16
  },
  cardContainer: {
    backgroundColor: "#1A1A1D",
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderColor: "#333",
    borderWidth: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  asteroidName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: 'uppercase'
  },
  hazardBadge: { backgroundColor: "#C02929" },
  safeBadge: { backgroundColor: "#138A36" },

  infoContainer: {
    backgroundColor: '#111',
    padding: 12,
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: { color: "#777", fontSize: 14 },
  value: { color: "#ddd", fontSize: 14, fontWeight: "600" },

  actionRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: 'center'
  },
  favButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4
  }
});