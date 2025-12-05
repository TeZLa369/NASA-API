import { Dimensions, Easing, Image, ImageBackground, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Asteroid from '../screens/Asteroid';
import Mars_rover from '../screens/Mars_rover';
import Favs from '../screens/Favs';
import HomeScreen from '../screens/HomeScreen';
import { useState } from 'react';
import TabIcon from "../components/TabIcon";
import ScreenNav from './ScreenNav';



const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const [gifOFF, setgifOFF] = useState(true);

    let [iconSource, seticonSource] = useState("");

    return (
        <Tab.Navigator

            initialRouteName="APOD"
            screenOptions={({ route }) => ({

                tabBarIcon: ({ focused, size }) => {
                    let iconSource;

                    if (route.name === "APOD") {
                        iconSource = require("../assets/APOD.png");
                    } else if (route.name === "Asteroid") {
                        iconSource = require("../assets/asteroid.png");
                    } else if (route.name === "Rover") {
                        iconSource = require("../assets/rover.png");
                    } else if (route.name === "Favorites") {
                        iconSource = require("../assets/heart.png");
                    }
                    return (<Image
                        source={iconSource}
                        style={{
                            width: 45,
                            height: 45,
                            resizeMode: "contain",
                            marginBottom: 12
                        }}
                    />);
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
            <Tab.Screen name="Favorites" component={ScreenNav} options={{ headerShown: false }} />


        </Tab.Navigator >
    );
};

export default TabNavigator;
