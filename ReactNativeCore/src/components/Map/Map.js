import * as React from 'react'
import {View, Dimensions, TouchableOpacity} from 'react-native'
import theme from "../../styles/theme";
import {localStyles} from "./style";
import {mapStyle} from "../../styles/style";
import MapView, {PROVIDER_GOOGLE} from "react-native-maps";
import {Loading} from "../Loading";
import {connect} from "react-redux";
import {getBusinessesNearby} from "../../utils/api/yelp";
import {MapMarker} from "./MapMarker";
import {getUserLocation} from "../../utils/location";
import {RecenterButton} from "./RecenterButton";
import DrawerButton from "../Drawer/DrawerButton";
const { width, height } = Dimensions.get('window');

const latitudeDelta = 0.0922;
const longitudeDelta =  0.0922 * (width / height);

class Map extends React.Component  {
    state ={
        region: {
            longitude:this.props.userData.longitude,
            latitude:this.props.userData.latitude,
            latitudeDelta,
            longitudeDelta
        },
        markers: [],
        loading: true,
    }

    gatherMarkers = async () => {
        let places = await getBusinessesNearby(this.state.region)
        this.setState({
            markers: places, loading: false
        })
    }

    handleMarkerPress = (e, key, places) => {
        console.log('HandleMarkerPress')
        console.log(key, places);
    }

    recenter = async () => {
        const {latitude, longitude} = await getUserLocation();
        this.setState({
            region: {
                longitude,
                latitude,
                latitudeDelta,
                longitudeDelta
            }
        })
    }

    async componentDidMount() {
        await this.gatherMarkers()
    }

    render() {
        return (
            this.state.region && this.props.userData && !this.state.loading ? <View style={localStyles.container}>
                <View style={localStyles.mapContainer}>
                    <MapView
                        style={localStyles.map}
                        provider={PROVIDER_GOOGLE}
                        showsMyLocationButton={false}
                        showsCompass={false}
                        showsUserLocation={true}
                        showsPointsOfInterest={false}
                        userLocationUpdateInterval={1000}
                        region={this.state.region}
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
                        {this.state.markers.map(marker => (
                            <MapMarker key={marker.id} marker={marker} onPress={(e) => {
                                this.handleMarkerPress(e, marker.id)
                            }}/>
                        ))}
                    </MapView>
                    <RecenterButton onPress={this.recenter}/>
                    <DrawerButton
                        userPhoto={this.props.userData.photoSource}
                        drawerButtonColor={theme.generalLayout.secondaryColor}
                        onPress={this.props.navigation.openDrawer}
                    />
                </View>
            </View> : <Loading />
        )
    }
}
function mapStateToProps(state){
    return {
        ...state
    }
}

function mapDispatchToProps(dispatch){
    return {
        refresh: (userData, feedData) => dispatch({ type:'REFRESH', data: userData, feed: feedData }),
        yelpDataRefresh: (data) => dispatch({ type:'YELPDATA', data: data }),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
