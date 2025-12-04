import { createStackNavigator } from "@react-navigation/stack";
import Favs from "../screens/Favs";
import CommonFavScreen from "../screens/CommonFavScreen";
import AsteroidFav from "../screens/AsteroidFav";

const Stack = createStackNavigator();

export default function ScreenNav() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="Favs" component={Favs} />
            <Stack.Screen name="CommonFavScreen" component={CommonFavScreen} />
            <Stack.Screen name="AsteroidFav" component={AsteroidFav} />
        </Stack.Navigator>
    );
}
