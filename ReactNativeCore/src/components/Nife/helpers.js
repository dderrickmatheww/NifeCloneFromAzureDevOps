import * as Font from "expo-font";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "../../utils/firebase";
import {updateUser} from "../../utils/api/users";;
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
        updateState({authLoaded: false, userData: null})
        if (user) {
            const { email, uid } = user;
            //TODO SAVE LOCATION AND EMAIL
            const {latitude, longitude} = await getUserLocation();
            const lowerEmail = email.toLowerCase()
            const userData = await updateUser({ email: lowerEmail, latitude, longitude, uuid: uid });
            refresh({ userData });
            updateState({ authLoaded: true, userData });
        } 
        else {
            updateState({ authLoaded: true, userData: null });
            refresh({ userData: null });
        }
    });
}