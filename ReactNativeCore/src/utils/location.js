import * as Location from "expo-location";
import { alert } from "./util";
import { getDistance, isPointWithinRadius } from "geolib";


export const MILES_PER_METER = 0.00062137119223733

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
        const data = await Location.getCurrentPositionAsync({enableHighAccuracy: true})
        const {coords} = data;
        return coords
    }
}

export const getUserRegion = async (location) => {
    return await Location.reverseGeocodeAsync(location)
}

export const distanceBetween = async (lat, long, userLocation) => {
    return getDistance(
        {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude
        },
        {
            latitude: lat,
            longitude: long
        },
        1
    ) * MILES_PER_METER
}

export const withinRadius = ({ busLat, busLong, userLat, userLong }) => {
    return isPointWithinRadius(
        {
            latitude: busLat,
            longitude: busLong
        }, 
        {
            latitude: userLat,
            longitude: userLong
        }, 
        32187
    ); 
}
