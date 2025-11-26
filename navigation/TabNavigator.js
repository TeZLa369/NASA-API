import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import Asteroid from '../screens/Asteroid';
import Mars_rover from '../screens/Mars_rover';
import Favs from '../screens/Favs';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator

            initialRouteName="APOD"
            screenOptions={({ route }) => ({

                tabBarIcon: ({ focused, size }) => {
                    let iconSource;
                    if (route.name === "APOD") {
                        iconSource = require("../assets/nasa.png");
                    } else if (route.name === "Asteroid") {
                        iconSource = require("../assets/asteroid.png");
                    } else if (route.name === "Rover") {
                        iconSource = require("../assets/rover.png");
                    } else if (route.name === "Favorites") {
                        iconSource = require("../assets/heart.png");
                    }

                    return (
                        <Image
                            source={iconSource}
                            style={{ width: 50, height: 50, marginBottom: 16 }}
                            resizeMode="contain"
                        />
                    );
                },
                tabBarShowLabel: true,
                headerShown: true,

                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#000000"},
                tabBarStyle: {
                    backgroundColor: "black",
                    borderTopColor: "#222",
                    paddingTop: "7%",
                    height: 100,
                    alignContent: "center",
                    alignItems: "center"
                },
                tabBarActiveTintColor: "white",
                tabBarInactiveTintColor: "gray",
            })}
        >
            <Tab.Screen options={{
                headerTitle: () => (<Image source={require("../assets/nasa.png")} height={100} width={100} style={{ height: 50, width: 60, }} />)
            }} name="APOD" component={HomeScreen} />
            <Tab.Screen name="Asteroid" component={Asteroid} />
            <Tab.Screen name="Rover" component={Mars_rover} />
            <Tab.Screen name="Favorites" component={Favs} />
        </Tab.Navigator>
    );
};

export default TabNavigator;
