import { useEffect, useState } from "react";
import { Image } from "react-native";

export default function TabIcon({ focused, gif, png }) {
    // Initialize with the correct state based on current focus
    const [source, setSource] = useState(focused ? gif : png);

    useEffect(() => {
        let timer;

        if (focused) {
            // 1. Play GIF immediately when focused
            setSource(gif);

            // 2. Set timer to switch to PNG after 5 seconds
            timer = setTimeout(() => {
                setSource(png);
            }, 5000);
        } else {
            // 3. If not focused, ensure it is static PNG
            setSource(png);
        }

        // Cleanup: Clear timer if user tabs away quickly or component unmounts
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [focused, gif, png]);

    return (
        <Image
            source={source}
            style={{ width: 40, height: 40, marginBottom: 12 }}
            resizeMode="contain"
        />
    );
}