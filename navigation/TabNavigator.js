import { Easing, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Asteroid from '../screens/Asteroid';
import Mars_rover from '../screens/Mars_rover';
import Favs from '../screens/Favs';
import HomeScreen from '../screens/HomeScreen';
import { useState } from 'react';
import TabIcon from "../components/TabIcon";


const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const [gifOFF, setgifOFF] = useState(true);

    let [iconSource, seticonSource] = useState("");

    return (
        <Tab.Navigator

            initialRouteName="APOD"
            screenOptions={({ route }) => ({

                tabBarIcon: ({ focused, size }) => {
                    if (route.name === "APOD") {
                        return (
                            <TabIcon
                                focused={focused}
                                gif={require("../assets/APOD_GIF.gif")}
                                png={require("../assets/APOD.png")}
                            />
                        );
                    }
                    if (route.name === "Asteroid") {
                        return (
                            <TabIcon
                                focused={focused}
                                gif={require("../assets/asteroid_gif.gif")}
                                png={require("../assets/asteroid.png")}
                            />
                        );
                    }
                    if (route.name === "Rover") {
                        return (
                            <TabIcon
                                focused={focused}
                                gif={require("../assets/rover_gif.gif")}
                                png={require("../assets/rover.png")}
                            />
                        );
                    }
                    if (route.name === "Favorites") {
                        return (
                            <TabIcon
                                focused={focused}
                                gif={require("../assets/heart_gif.gif")}
                                png={require("../assets/heart.png")}
                            />
                        );
                    }
                },
                tabBarShowLabel: true,
                headerShown: true,
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#000000" },
                tabBarStyle: {
                    backgroundColor: "#000000",
                    borderTopColor: "#222",
                    paddingTop: "5%",
                    height: 90,
                    alignContent: "center",
                    alignItems: "center",
                },
                animation: "fade",
                transitionSpec: {
                    animation: "timing", config: {
                        duration: 500,
                        easing: Easing.ease,
                    }
                },
                tabBarActiveTintColor: "white",
                tabBarInactiveTintColor: "gray",

            })}
        >
            <Tab.Screen options={{
                headerShown: false
            }} name="APOD" component={HomeScreen} />
            {/* <Tab.Screen options={{
                headerTitle: () => (<Image source={require("../assets/nasa.png")} height={100} width={100} style={{ height: 50, width: 60, }} />)
            }} name="APOD" component={HomeScreen} /> */}
            <Tab.Screen options={{ headerTitle: () => (<Image source={require("../assets/nasa.png")} height={100} width={100} style={{ height: 50, width: 60, }} />) }} name="Asteroid" component={Asteroid} />
            <Tab.Screen options={{ headerShown: false }} name="Rover" component={Mars_rover} />
            {/* <Tab.Screen options={{
                headerTitle: () => (<Image source={require("../assets/nasa.png")} height={100} width={100} style={{ height: 50, width: 60, }} />)
            }} name="Rover" component={Mars_rover} /> */}
            <Tab.Screen options={{
                headerTitle: () => (<Image source={require("../assets/nasa.png")} height={100} width={100} style={{ height: 50, width: 60, }} />)
            }} name="Favorites" component={Favs} />
        </Tab.Navigator >
    );
};

export default TabNavigator;
