import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AsteroidsFav = () => {
    const [loading, setLoading] = useState(false);
    const [savedData, setSavedData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchSavedData = async () => {
        setLoading(true);
        try {
            const keys = await AsyncStorage.getAllKeys();
            const asteroidKeys = keys.filter(key => key.startsWith("nro"));

            if (asteroidKeys.length === 0) {
                setSavedData([]);
                setLoading(false);
                return;
            }
            const result = await AsyncStorage.multiGet(asteroidKeys);
            const parsedData = result.map(([key, value]) => {
                if (value) return JSON.parse(value);
            }).filter(item => item !== undefined);

            setSavedData(parsedData);

        } catch (e) {
            console.error("Error loading saved items", e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchSavedData();
    }, []);


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchSavedData();
    }, []);

    const removeFavorite = async (id) => {
        try {

            await AsyncStorage.removeItem("nro" + id);

            setSavedData(prev => prev.filter(item => item.id !== id));

        } catch (error) {
            console.error("Error removing item", error);
        }
    };

    return (
        <SafeAreaView edges={["left", "right"]} style={styles.container}>

            <Text style={styles.mainTxt}>Saved Asteroids</Text>
            <Text style={styles.subTxt}>Your Watchlist</Text>
            {loading && !refreshing ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#1E90FF" />
                </View>
            ) : (
                <FlatList
                    data={savedData}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 12, paddingBottom: 40 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="#1E90FF" // Color of spinner on iOS
                            colors={["#1E90FF"]} // Color of spinner on Android
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Ionicons name="planet-outline" size={60} color="#333" />
                            <Text style={styles.emptyText}>No saved asteroids.</Text>
                            <Text style={{ color: '#555', marginTop: 5 }}>Go back and add some!</Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <View style={styles.cardContainer}>

                            {/* Top Row */}
                            <View style={styles.topRow}>
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

                            {/* Action Row - Remove Button */}
                            <View style={styles.actionRow}>
                                <TouchableOpacity
                                    style={styles.favButton}
                                    onPress={() => removeFavorite(item.id)}
                                >
                                    <Ionicons
                                        name="trash-outline"
                                        size={22}
                                        color="#D7D7D7"
                                    />
                                    <Text style={{ color: '#D7D7D7', marginLeft: 8 }}>
                                        Remove
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

export default AsteroidsFav;

// Same Styles as previous component for consistency
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#000000",
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50
    },
    mainTxt: {
        marginTop: 10,
        fontSize: 22,
        fontWeight: 'bold',
        color: "#fff",
        paddingHorizontal: 16,
        textAlign: "center"
    },
    subTxt: {
        textAlign: "center",
        fontSize: 14,
        color: "#888",
        paddingHorizontal: 16,
        marginBottom: 10
    },
    emptyText: {
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold'
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
        padding: 6,
        backgroundColor: '#2A1A1A', // Slight reddish tint background for remove button
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#3A2020'
    }
});