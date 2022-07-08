import 'dotenv/config';

const { 
    //Firebase Secrets
    FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_DATABASE_URL,
    FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID,
    FIREBASE_PHOTO_URL_TOKEN,
    FIREBASE_MEASUREMENT_ID,
    //Google
    //OAuth
    //iOS
    IOS_CLIENT_ID,
    IOS_STANDALONE_CLIENT_ID,
    IOS_RESERVED_CLIENT_ID,
    //Andriod
    ANDROID_CLIENT_ID,
    ANDRIOD_STANDALONE_CLIENT_ID,
    ANDRIOD_OAUTH_API_KEY,
    ANDRIOD_CERT_HASH,
    //Maps
    //iOS
    IOS_MAPS_API_KEY,
    //Andriod
    //Cloud Functions
    CLOUD_FUNCTIONS_BASE_URL_PROD,
    CLOUD_FUNCTIONS_BASE_URL,
    ANDRIOD_MAPS_API_KEY,
    //YELP
    YELP_API_KEY,
    //Expo 
    EAS_BUILD_PROFILE,
    //iOS
    EXPO_APPLE_APP_SPECIFIC_PASSWORD,
    EXPO_APPLE_PASSWORD
 } = process.env;

 const envVars = {
    firebase: {
        FIREBASE_API_KEY,
        FIREBASE_AUTH_DOMAIN,
        FIREBASE_DATABASE_URL,
        FIREBASE_PROJECT_ID,
        FIREBASE_STORAGE_BUCKET,
        FIREBASE_MESSAGING_SENDER_ID,
        FIREBASE_APP_ID,
        FIREBASE_PHOTO_URL_TOKEN,
        FIREBASE_MEASUREMENT_ID,
    },
    yelp: {
        YELP_API_KEY
    },
    expo: {
        EXPO_APPLE_APP_SPECIFIC_PASSWORD,
        EXPO_APPLE_PASSWORD
    },
    google: {
        oauth: {
            ios: {
                IOS_CLIENT_ID,
                IOS_STANDALONE_CLIENT_ID,
                IOS_RESERVED_CLIENT_ID
            },
            andriod: {
                ANDROID_CLIENT_ID,
                ANDRIOD_STANDALONE_CLIENT_ID,
                ANDRIOD_OAUTH_API_KEY,
                ANDRIOD_CERT_HASH
            }
        },
        maps: {
            ios: {
                IOS_MAPS_API_KEY
            },
            andriod: {
                ANDRIOD_MAPS_API_KEY
            }
        },
        CLOUD_FUNCTIONS_BASE_URL: CLOUD_FUNCTIONS_BASE_URL
    }
}

export default ({ config }) => {
    // API keys from .env for iOS
    const iosConfig = {
        ...config.ios,
        config: {
            googleMapsApiKey: IOS_MAPS_API_KEY,
            googleSignIn: {
                reservedClientId: IOS_RESERVED_CLIENT_ID
            }
        }
    };
    // Setting ios configurations
    config['ios'] = iosConfig;
    // API keys from .env for Andriod
    const andriodConfig = {
        ...config.android,
        config: {
            googleMaps: {
                apiKey: ANDRIOD_MAPS_API_KEY
            },
            googleSignIn: {
                apiKey: ANDRIOD_OAUTH_API_KEY,
                certificateHash: ANDRIOD_CERT_HASH
            }
        }
    };
    // Setting andriod configurations
    config['android'] = andriodConfig;
    // Return the combined configurations
    return {
        description: `Nife is a mobile application that help people explor the night life in a new city.`,
        ...config,
        extra: {
            ...envVars
        }
    }
};