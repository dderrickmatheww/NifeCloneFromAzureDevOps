import React from 'react';
import { View,  Dimensions,  StyleSheet, Image, Text, ActivityIndicator } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';

import BarModal from './Components/Map Screen Components/BarModal';
import DrawerButton from '../Screens/Universal Components/DrawerButton';
import Util from '../scripts/Util';
import theme from '../Styles/theme';
import { styles } from '../Styles/style';
import VisitedByCallout from './Components/Map Screen Components/VisitedByCallout';

var { width, height } = Dimensions.get('window');
var ASPECT_RATIO = width / height;
var LATITUDE_DELTA = 0.0922;
var LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
var LATITUDE;
var LONGITUDE;

class MapScreen extends React.Component  {
 
  state = {
    region: null,
    markers: [],
    userLocation: {},
    isLoaded: false,
    isModalVisible: false,
    modalProps:{
      source:{uri:"#"},
      barName:"#",
      rating:"#",
      reviewCount:"#",
      price: "#",
      phone: "#",
      closed: "#",
      address: "#",
      id: "#",
      friendData: '#'
    },
    friendData:null,
    userData:null,
    buisnessUID: null
  };
  
  mapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": theme.DARK
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": theme.LIGHT_PINK
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": theme.LIGHT_PINK
        }
      ]
    },
    {
      "featureType": "poi",
      "stylers": [
        {
          "color": "#d59563",
          "visibility":"off"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#263c3f",
          "visibility":"off"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#6b9a76",
          "visibility":"off"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": theme.LIGHT
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": theme.LIGHT
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": theme.LIGHT_PINK
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": theme.DARK_PINK
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": theme.LIGHT
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#f3d19c"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#2f3948"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": theme.BLUE
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": theme.TURQUOISE
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#515c6d"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#17263c"
        }
      ]
    }
  ];

  clientLocationFunction = () => { 
    Util.location.GetUserLocation(async (loc) => {
      let userLocation = loc.coords;
      let { width, height } = Dimensions.get('window');
      ASPECT_RATIO = width / height;
      LATITUDE = userLocation.latitude;
      LONGITUDE = userLocation.longitude;
      LATITUDE_DELTA = 0.0922;
      LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
      await this.gatherLocalMarkers(LATITUDE, LONGITUDE, this.state.friendData, userLocation);
      this.setState({ 
        isLoaded: true,
        region: {
          latitude: LATITUDE,
          longitude: LONGITUDE,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }
      });
    });
  }

  gatherLocalMarkers = (lat, long, friendData, userLocation) => {  
    let baseURL = 'https://api.yelp.com/v3/businesses/search?';
    let params = Util.dataCalls.Yelp.buildParameters(lat, long, 8000);
    Util.dataCalls.Yelp.placeData(baseURL, params, friendData, (data) => {
      this.setState({
        markers: data,
        userLocation: userLocation
      });
    });
  }

  //gets the data from the modal, matches with markers saved in state
  //puts matching data on modal. 
  HandleMarkerPress = (e, key) => {
    let { width, height } = Dimensions.get('window');
    let ASPECT_RATIO = width / height;
     LATITUDE = this.state.userLocation.latitude;
     LONGITUDE = this.state.userLocation.longitude;
    let LATITUDE_DELTA = 0.0922;
    let LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
    var places = this.state.markers;
    this.setWantedPlaceData(places, key);
  }

  setWantedPlaceData = (places, key) => {
    var tempFriendArr = [];
    var wantedPlace;
    var friendState = this.state.friendData;
    places.forEach(function(place){
      if(place.id == key){
        wantedPlace = place;
        let friends = JSON.parse(friendState);
        if(friends.length > 0){
          friends.forEach((friend) => {
              if((friend.lastVisited) && (friend.lastVisited.buinessUID == places.id)){
                  tempFriendArr.push(friend);
              }
          });
        }
      }
    });
    this.setState({
      modalProps:{
        source:{uri: "" + wantedPlace.image_url},
        barName:wantedPlace.name, 
        rating:wantedPlace.rating,
        reviewCount:wantedPlace.review_count,
        price: wantedPlace.price,
        phone: wantedPlace.display_phone,
        closed: wantedPlace.is_closed,
        address: ""+ wantedPlace.location.display_address[0] + ", " + wantedPlace.location.display_address[1],
        id: wantedPlace.id,
        friendsData: tempFriendArr,
        longitude: wantedPlace.coordinates.longitude,
        latitude: wantedPlace.coordinates.latitude
      },
      isModalVisible: true
    });
  }
  
  toggleModal = (boolean) => {
    this.setState({isModalVisible: boolean});
  }

  getAsyncStorageData = () => {
    Util.asyncStorage.GetAsyncStorageVar('Friends', (friends) => {
      this.setState({friendData: friends});
    });
    Util.asyncStorage.GetAsyncStorageVar('User', (userData) => {
      this.setState({userData: userData});
    });
    this.clientLocationFunction();
  }

  componentDidMount() {
    this.getAsyncStorageData();
  }
  
  generateFriendBubbles = (friend) => {
    return(
      <Image style={localStyles.friendPic} source={{uri:friend.item.photoSource}}/>
    )
  }
  
  render() {
    return (
      this.state.isLoaded ?

        this.state.markers != null 
        && 
        this.state.markers != undefined ? 

          this.state.isModalVisible ? (
          //if Modal is visible
          <View  style={localStyles.container}> 
            <MapView
              style={localStyles.map}
              provider={PROVIDER_GOOGLE}
              showsMyLocationButton={true}
              showsUserLocation={true}
              showsPointsOfInterest={false}
              userLocationUpdateInterval={1000}
              region={this.state.region}
              onUserLocationChange={(e) => {null}}
              showsScale={true}
              customMapStyle={this.mapStyle}
              minZoomLevel={15}
              maxZoomLevel={20}
              moveOnMarkerPress={false}
            >     
          </MapView>
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
              > 
            </BarModal>
            <DrawerButton drawerButtonColor="#eca6c4" onPress={this.props.onDrawerPress} /> 
        </View> 
        ) 
          :
        //if modal is not visible, show markers
        (
          <View style={localStyles.container}>  
            <MapView
                style={localStyles.map}
                provider={PROVIDER_GOOGLE}
                showsMyLocationButton={true}
                showsUserLocation={true}
                showsPointsOfInterest={false}
                userLocationUpdateInterval={1000}
                region={this.state.region}
                onUserLocationChange={(e) => {null}}
                showsScale={true}
                customMapStyle={this.mapStyle}
                minZoomLevel={15}
                maxZoomLevel={20}
                moveOnMarkerPress={false}
              >
              {this.state.markers.map(marker => (
                
                  <Marker
                    coordinate={{latitude:marker.coordinates.latitude, longitude:marker.coordinates.longitude}}
                    key={marker.id}
                    onCalloutPress={(e) => console.log(e)}
                    pinColor="#FF33CC"
                    calloutOffset={{x: 0.5, y: 0.25}}
                    calloutAnchor={{x: 0.5, y: 0.25}}
                  > 
                    <Callout 
                      tooltip={true}
                      onPress={(e) => {this.HandleMarkerPress(e, marker.id)}}
                      style={{justifyContent: 'center', alignContent: 'center'}}
                    >
                      <VisitedByCallout marker={marker}/>
                    </Callout>
                  </ Marker>
                ))}
            </MapView>       
            <DrawerButton drawerButtonColor="#eca6c4" onPress={this.props.onDrawerPress} /> 
          </View>
        ) 
        :
        null
    :
      <View style={localStyles.activityIndicator}>
            <ActivityIndicator 
                size={'large'}
                color={theme.LIGHT_PINK}
            />
            <DrawerButton drawerButtonColor="#eca6c4" onPress={this.props.onDrawerPress}/>
      </View>
  ) 
  }
}

const localStyles = StyleSheet.create({
  markerVisited:{
    marginTop: 12,
    position:"relative"
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  friendPic:{
    position:"relative",
    width: 40,
    height: 40,
    borderRadius: 50,
    bottom: 12,
    marginRight:126
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center' ,
    backgroundColor: '#20232a'
  },
  callOutMarker: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 3,
    padding: 30,
    margin: 25,
    justifyContent: 'center',
    alignContent: 'center',
    maxWidth: '60%',
    borderRadius: 20,
    borderColor: theme.LIGHT_PINK,
    borderWidth: 1
  },
  overlay: {
    position: 'absolute',
    top:"5%",
    left: "5%",
    opacity: 0.75,
    backgroundColor: theme.DARK,
  },

  map: {
    ...StyleSheet.absoluteFillObject,
  },

  drawerButton:{
    backgroundColor: theme.DARK,
    position:"absolute",
    alignSelf:"flex-start",
    top:"-30%"
  },
  
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width:"90%",
    height:"90%",
    marginBottom:"15%",
    marginTop:"0%",
    marginHorizontal: "2.5%",
    backgroundColor: "#20232a",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex:1,
  },
  closeButton:{
    left: "0%",
    top: "0%",
  },

  imgCont: {
    flex: 1,
    backgroundColor: '#5D5E60',
    alignItems: 'center',
    justifyContent: 'center',
    
    borderColor:"#5D5E60",
    borderWidth: 10,
    borderRadius: 20,
    width:'100%',
  },
  modalImage:{
    width: '100%',
    height: '100%',
    borderColor:"#BEB2C8",
    borderWidth: 10,
    borderRadius: 20,
  },

  textCont:{
    bottom:"-10%",
    width:"100%",
    backgroundColor: "#5D5E60",
    borderRadius:20,
  },
  descCont: {
    borderRadius: 20,
    borderColor: "black",
    borderWidth: 1,
    backgroundColor:"#BEB2C8",
    margin:"1%",
  },
  modalText:{
    color: "#20232a",
    padding: 5,
    marginLeft:"1%",
    fontWeight:"bold",
  },

  titleCont: {
    backgroundColor:"#5D5E60",
    width: '100%',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    top: "-7.5%"
  },
  modalTitle:{
    color: "#20232a",
    padding: 5,
    fontSize:24,
    borderRadius: 20,
    textAlign:"center",
    fontWeight:'bold',
    backgroundColor:"#BEB2C8",
    marginVertical:"2%",
    width:"90%",

  },
  ratingText:{
    color: "#20232a",
    padding: 5,
    fontWeight:"bold",
    textAlign:"center"
  },
  rating:{
    marginTop:"2%",
    marginBottom:"1%",
  }

});
export default MapScreen;