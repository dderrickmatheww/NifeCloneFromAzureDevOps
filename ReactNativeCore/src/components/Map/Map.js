import * as React from 'react'
import {View, Text, Dimensions} from 'react-native'
import theme from "../../styles/theme";
import {localStyles} from "./style";
import {mapStyle} from "../../styles/style";
import MapView, {PROVIDER_GOOGLE} from "react-native-maps";
import {useEffect, useState} from "react";
import {getUserLocation} from "../../utils/location";
import {Loading} from "../Loading";
import {useSelector} from "react-redux";
const { width, height } = Dimensions.get('window');

const latitudeDelta = 0.0922;
const longitudeDelta =  0.0922 * (width / height);

export function Map() {
    const user = useSelector((state) => state.userData)
    const [region, setRegion] = useState(null);
    useEffect( () => {
        const {latitude, longitude} = getUserLocation();
        setRegion({
            longitude,
            latitude,
            latitudeDelta,
            longitudeDelta
        })
    },[])

    return (
       region && user ? <View style={localStyles.container}>
            <View style={{
                flex: 1,
                backgroundColor: theme.generalLayout.backgroundColor,
                borderColor: theme.icons.color,
                borderTopWidth: 1
            }}>
                <MapView
                    style={localStyles.map}
                    provider={PROVIDER_GOOGLE}
                    showsMyLocationButton={false}
                    showsCompass={false}
                    showsUserLocation={true}
                    showsPointsOfInterest={false}
                    userLocationUpdateInterval={1000}
                    region={region}
                    // onUserLocationChange={(e) => this.OnMapChange(e)}
                    showsScale={true}
                    customMapStyle={mapStyle}
                    minZoomLevel={1}
                    maxZoomLevel={20}
                    moveOnMarkerPress={false}
                    loadingEnabled={true}
                    loadingIndicatorColor={theme.loadingIcon.color}
                    loadingBackgroundColor={theme.generalLayout.backgroundColor}
                >
                </MapView>
            </View>
        </View> : <Loading />
    )
}