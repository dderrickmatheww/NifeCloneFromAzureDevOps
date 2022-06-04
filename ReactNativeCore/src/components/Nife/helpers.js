import * as Font from "expo-font";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "../../utils/firebase";
import {updateUser} from "../../utils/api/users";
import {updateBusiness} from "../../utils/api/businesses";
import {getUserLocation} from "../../utils/location";

export const loadFonts = async () => {
    await Font.loadAsync({
        "Comfortaa": require('../../media/Fonts/Comfortaa/static/Comfortaa-Regular.ttf'),
        "ComfortaaLight": require('../../media/Fonts/Comfortaa/static/Comfortaa-Light.ttf'),
        "ComfortaaBold": require('../../media/Fonts/Comfortaa/static/Comfortaa-Bold.ttf')
    });
}

export const initiateAuthObserver = async (refresh, updateState, callback) => {
    onAuthStateChanged(auth, async user => {
        console.log('onAuthStateChanged')
        if (user) {
            const { email, uid } = user;
            const { latitude, longitude } = await getUserLocation();
            const lowerEmail = email.toLowerCase();
            let businessData = [];
            const userData = await updateUser({ email: lowerEmail, latitude, longitude, uuid: uid });
            if (userData.businessUID) {
                businessData = await updateBusiness({ 
                    lastModified: new Date(),
                    lastLogin: new Date(),
                    uuid: userData.businessUID
                });
            }
            refresh({ userData, businessData });
            updateState({ authLoaded: true, userData });
        } 
        else {
            console.log('user not found');
            updateState({ authLoaded: true, userData: null });
            refresh({ userData: [] });
        }
    });
}