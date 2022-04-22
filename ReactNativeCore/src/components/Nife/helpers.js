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

export const initiateAuthObserver = async (refresh, handleAuthChange) => {
    onAuthStateChanged(auth, async user => {
        console.log('onAuthStateChanged')
        if(user){
            handleAuthChange({authLoaded: true})
            //TODO SAVE LOCATION AND EMAIL
            const {email} = user;
            const {latitude, longitude} = await getUserLocation();
            let data = await updateUser({email, latitude, longitude});
            refresh(data, [])
        } else {
            refresh(null, []);
            handleAuthChange({authLoaded: true})
        }
    });
}