import "dotenv/config";

export default {
    expo: {
        name: "Cosmic Explorer",
        slug: "Cosmic Explorer",
        owner: "tezla",
        icon: "./assets/nasa.png",
        plugins: ["expo-audio",
            "expo-font",
            "expo-asset"
        ],

        extra: {
            nasaApiKey: process.env.NASA_API_KEY,
            eas: {
                projectId: "7d0359bd-0e21-4a96-9640-fcffc88727fd",
            },
        },

        splash: {
            image: "./assets/nasa.png",
            resizeMode: "contain",
            backgroundColor: "#000000",

        },

        android: {
            package: "com.kuntal.cosmicexplorer",
            versionCode: 1,
        },
    },
};
