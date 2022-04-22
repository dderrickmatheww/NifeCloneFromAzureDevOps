import * as Location from "expo-location";
import {alert} from "./util";

const getLocationPermission = async () => {
    const status = await Location.requestForegroundPermissionsAsync()
    if (status.status === 'granted') {
        return true
    }
    else {
        alert('Nife Message',
            'Nife is used primarily based on location. We use your location to show you event going on around' +
            ' your current location! For more information please see our privacy statement, thank you for downloading!',
            null);
    }
}

export const getUserLocation = async () => {
    let hasPermission = await getLocationPermission()
    if(hasPermission){
        const {coords} = await Location.getCurrentPositionAsync({enableHighAccuracy: true})
        return coords
    }
}