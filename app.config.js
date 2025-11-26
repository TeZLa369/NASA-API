import "dotenv/config";

export default {
    expo: {
        name: "NASA-API",
        slug: "nasa-api",
        owner: "tezla",
        icon:"./assets/nasa.png",

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
            package: "com.kuntal.nasaapi",
            versionCode: 1,
        },
    },
};
