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
import {getUserLocation, MILES_PER_METER} from "../../utils/location";
import {RecenterButton} from "./RecenterButton";
import DrawerButton from "../Drawer/DrawerButton";
import BarModal from "./BarModal/BarModal";
import BusinessSearchBar from "../BusinessSearchBar/BusinessSearchBar";
import {getFriendCheckIns, searchBusinesses} from "../../utils/api/businesses";

const {width, height} = Dimensions.get('window');

const latitudeDelta = 0.0922;
const longitudeDelta = 0.0922 * (width / height);

class Map extends React.Component {
    state = {
        region: {
            longitude: this.props.userData.longitude,
            latitude: this.props.userData.latitude,
            latitudeDelta,
            longitudeDelta
        },
        markers: [],
        loading: true,
        isModalVisible: false,
        modalProps: {
            source: {uri: "#"},
            barName: "#",
            rating: "#",
            reviewCount: "#",
            price: "#",
            phone: "#",
            closed: "#",
            address: "#",
            id: "#",
            friendData: '#',
            distance: 0,
            business: null,
        },
        searchParam: "",
        dropDownData: null,
        friendCheckIns: null,
        friendsLastVisited: null
    }

    handleGetFriendCheckIns = async () => {
        const friends = this.props.userData.user_friends.map(friend => friend.friendId);
        if (friends) {
            const {checkIns, lastVisited} = await getFriendCheckIns(friends);
            this.setState({
                friendCheckIns: checkIns,
                friendsLastVisited: lastVisited
            })
        }
        else {
            this.setState({
                friendCheckIns: null,
                friendsLastVisited: null
            })
        }
    }

    gatherMarkers = async () => {
        let places = await getBusinessesNearby(this.state.region);
        this.props.refresh({  })
        this.setState({
            markers: places, loading: false
        })
    }

    getBarCheckIns = (id) => {
        return this.state.friendCheckIns.filter(checkIn => checkIn.business === id)
    }

    getBarLastVisited = (id) => {
        return this.state.friendsLastVisited.filter(checkIn => checkIn.business === id)
    }

    toggleModal = (boolean) => {
        this.setState({isModalVisible: boolean})
    }

    openBarModal = (e, placeId) => {
        const wantedPlace = this.state.markers.find(place => place.id === placeId)
        this.setState({
            region: {
                latitude: wantedPlace.coordinates.latitude,
                longitude: wantedPlace.coordinates.longitude,
                latitudeDelta,
                longitudeDelta,
            },
            modalProps: {
                business: wantedPlace,
                source: {uri: wantedPlace.photoSource ? wantedPlace.photoSource : wantedPlace.image_url},
                barName: wantedPlace.name,
                rating: wantedPlace.rating,
                reviewCount: wantedPlace.review_count,
                price: wantedPlace.price,
                phone: wantedPlace.display_phone,
                closed: wantedPlace.is_closed,
                address: `${wantedPlace.location.display_address[0]}, ${wantedPlace.location.display_address[1]}`,
                id: wantedPlace.id,
                friendsData: [],
                longitude: wantedPlace.coordinates.longitude,
                latitude: wantedPlace.coordinates.latitude,
                distance: (wantedPlace.distance * MILES_PER_METER).toFixed(1)
            },
            isModalVisible: true
        });
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
        await this.handleGetFriendCheckIns()
    }

    render() {
        return (
            this.state.region && this.props.userData && !this.state.loading && this.state.markers ?
                <View style={localStyles.container}>
                    <View style={localStyles.mapContainer}>
                        <View style={localStyles.autoCompContainer}>
                            <BusinessSearchBar
                                name={'ios-mail'}
                                color={theme.generalLayout.textColor}
                                styles={localStyles.font}
                                value={this.state.searchParam}
                                handleBarSelect={this.openBarModal}
                                latitude={this.state.region.latitude}
                                longitude={this.state.region.longitude}
                            />
                        </View>
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
                                <MapMarker
                                    key={marker.id} 
                                    friendCheckIns={this.state.friendCheckIns ? this.getBarCheckIns(marker.id) : null}
                                    friendLastVisited={this.state.friendCheckIns ? this.getBarLastVisited(marker.id) : null}
                                    marker={marker}
                                    userData={this.props.userData}
                                    onPress={(e) => {
                                        this.openBarModal(e, marker.id)
                                    }}
                                />
                            ))}
                        </MapView>
                        <RecenterButton onPress={this.recenter}/>
                        {this.state.isModalVisible ?
                            <BarModal
                                isVisible={this.state.isModalVisible}
                                source={this.state.modalProps.source}
                                userLocation={this.state.region}
                                barName={this.state.modalProps.barName}
                                rating={this.state.modalProps.rating}
                                reviewCount={this.state.modalProps.reviewCount}
                                price={this.state.modalProps.price}
                                phone={this.state.modalProps.phone}
                                closed={this.state.modalProps.closed}
                                address={this.state.modalProps.address}
                                toggleModal={(boolean) => this.toggleModal(boolean)}
                                buisnessUID={this.state.modalProps.id}
                                latitude={this.state.modalProps.latitude}
                                longitude={this.state.modalProps.longitude}
                                distance={this.state.modalProps.distance}
                                user={this.props.userData}
                                refresh={this.props.refresh}
                                navigation={this.props.navigation}
                                friendData={this.props.friends}
                                business={this.state.modalProps.business}
                            /> : null
                        }
                        <DrawerButton
                            userPhoto={this.props.userData.photoSource}
                            drawerButtonColor={theme.generalLayout.secondaryColor}
                            onPress={this.props.navigation.openDrawer}
                        />
                    </View>
                </View> : <Loading/>
        )
    }
}

function mapStateToProps(state) {
    return {
        ...state
    }
}

function mapDispatchToProps(dispatch) {
    return {
        refresh: ({ userData, feedData }) => dispatch({ 
            type:'REFRESH', 
            data: {
                userData,
                feedData 
            }
        })
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Map);
