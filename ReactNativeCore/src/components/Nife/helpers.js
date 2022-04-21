import * as Font from "expo-font";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "../../utils/firebase";
import {updateUser} from "../../utils/api/users";

export const loadFonts = async () => {
    await Font.loadAsync({
        "Comfortaa": require('../../media/Fonts/Comfortaa/static/Comfortaa-Regular.ttf'),
        "ComfortaaLight": require('../../media/Fonts/Comfortaa/static/Comfortaa-Light.ttf'),
        "ComfortaaBold": require('../../media/Fonts/Comfortaa/static/Comfortaa-Bold.ttf')
    });
}

export const initiateAuthObserver = async (refresh, setState) => {
    onAuthStateChanged(auth, async user => {
        setState({authLoaded: false})
        if(user){
            console.log('initiateAuthObserver: ', {user});
            refresh(user, []);
            setState({authLoaded: true})
            //TODO SAVE LOCATION AND EMAIL
            const {email} = user;
            await updateUser({email});
        } else {
            refresh(null, []);
        }
    });
}