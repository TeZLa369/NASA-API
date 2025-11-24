import 'dotenv/config';

export default {
    expo: {
        name: "NASA-API",
        slug: "NASA-API",
        extra: {
            nasaApiKey: process.env.NASA_API_KEY,
        },
    },
};
