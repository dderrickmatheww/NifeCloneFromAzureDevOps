import React from 'react';
import { View,  Dimensions,  StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import InputWithIcon from '../Universal/InputWithIcon';
import BarModal from './BarModal';
import DrawerButton from '../Universal/DrawerButton';
import Util from '../../scripts/Util';
import theme from '../../../Styles/theme';
import VisitedByCallout from './VisitedByCallout';
import { connect } from "react-redux";
import { MaterialCommunityIcons } from '@expo/vector-icons';
// const TouchableOpacity = Util.basicUtil.TouchableOpacity();



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
    buisnessUID: null,
    searchParam: "",
    dropDownData: [],
    isSearch: false,
    nifeBusinesses:[],
    yelpBusIds:[],
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
          "color": theme.GOLD
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
          "color": theme.GOLD
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
          "color": theme.GOLD,
          "visibility":"off"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": theme.LIGHT_PINK
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": theme.GOLD
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
          "color": "#242f3e"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": theme.GOLD
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
          "color": theme.GOLD
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": theme.LIGHT_PINK
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": theme.GOLD
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    }
  ];

  OnChangeMapRegion = (autoCompUpdate) => {
    Util.location.GetUserLocation(async (loc, region) => {
      let userLocation = loc.coords;
      let { width, height } = Dimensions.get('window');
      let boolean = this.state.searchParam != "";
      ASPECT_RATIO = width / height;
      LATITUDE = userLocation.latitude;
      LONGITUDE = userLocation.longitude;
      LATITUDE_DELTA = 0.0922;
      LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
      let baseURL = 'https://api.yelp.com/v3/businesses/search?';
      let params;
      if(boolean) {
        params = Util.dataCalls.Yelp.buildParameters(LATITUDE, LONGITUDE, 40000, boolean, this.state.searchParam, region);
      }
      else {
        params = Util.dataCalls.Yelp.buildParameters(LATITUDE, LONGITUDE, 40000, boolean, "", region);
      }
      await this.gatherLocalMarkers(this.state.friendData, userLocation, baseURL, params, boolean, autoCompUpdate);
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

  recenter = ( ) => {
    Util.location.GetUserLocation(async (loc, region) => {
      let userLocation = loc.coords;
      let { width, height } = Dimensions.get('window')
      ASPECT_RATIO = width / height;
      LATITUDE = userLocation.latitude;
      LONGITUDE = userLocation.longitude;
      LATITUDE_DELTA = 0.0922;
      LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
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

  gatherLocalMarkers = (friendData, userLocation, baseURL, params, boolean, autoCompUpdate) => {  
    Util.dataCalls.Yelp.placeData(baseURL, params, friendData, (data) => {
      if(boolean) {
        this.setState({
          userLocation: userLocation,
          dropDownData: data
        });
        if(autoCompUpdate) {
          autoCompUpdate(this.state.dropDownData);
        }
      }
      else {

        Util.business.getNifeBusinessesNearby(this.props.user, (nifeData) => {
          this.setState({nifeBusinesses: nifeData.map(bus => bus.id)});

          //Orginal data call to get markers based on user location
          this.setState({yelpBusIds: data.map(bus => bus.id)});

          nifeData.forEach(bus =>{
            if(!this.state.yelpBusIds.includes(bus.id)){
              data.push(bus);
            }
          });

          this.setState({
            markers: data,
            userLocation: userLocation
          });
        });

      }
    });
  }

  //gets the data from the modal, matches with markers saved in state
  //puts matching data on modal. 
  HandleMarkerPress = (e, key, places) => {
    if(places) {
      var places = places;
    }
    else {
      var places = this.state.markers;
    }
    this.setWantedPlaceData(places, key);
  }

  OnMapChange = (e) => {
    console.log(e);
  }

  OnSearch = async (text, autoCompUpdate) => {
    await this.setState({
      searchParam: text
    });
    this.OnChangeMapRegion(autoCompUpdate);
  }

  OnSearchInputChange = (text, type) => {
    this.setState({
      searchParam: text
    });
  }

  setWantedPlaceData = (places, key) => {
    var tempFriendArr = [];
    var wantedPlace;
    var friendState = this.state.friendData;
    places.forEach(function(place){
      if(place.id == key){
        wantedPlace = place;
        let friends = friendState;
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
      region: {
        latitude: wantedPlace.coordinates.latitude,
        longitude: wantedPlace.coordinates.longitude,
      },
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

  setInitialState = () => {
    this.setState({
      userData: this.props.user,
      friendData: this.props.friends
    });
    this.OnChangeMapRegion();
  }

  componentDidMount() {
    this.setInitialState();
  }
  
  generateFriendBubbles = (friend) => {
    return(
      <Image style={localStyles.friendPic} source={{uri:friend.item.photoSource}}/>
    )
  }
  
  render() {
    return (
      this.state.isLoaded 
      &&
      this.state.markers != null 
      && 
      this.state.markers != undefined ? 
      (
        <View style={localStyles.container}>

          <View style={localStyles.autoCompContainer}>
            <InputWithIcon 
              name={'ios-mail'} 
              color={theme.icons.color} 
              styles={localStyles.font}
              size={12} 
              placeHolderText={'Search...'} 
              returnKey={'search'} 
              secureText={false} 
              onChangeText={(text, type) => this.OnSearchInputChange(text, type)} 
              type={'name'} 
              keyboardType={'default'} 
              value={this.state.searchParam} 
              onSubmit={(text, autoCompUpdate) => this.OnSearch(text, autoCompUpdate)} 
              autocomplete={true} 
              PopUpBarModel={(e, buisnessUID, places) => { this.HandleMarkerPress(e, buisnessUID, places) }} 
              autocompleteData={this.state.dropDownData}
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
              customMapStyle={this.mapStyle}
              minZoomLevel={14}
              maxZoomLevel={20}
              moveOnMarkerPress={false}
              loadingBackgroundColor={theme.generalLayout.backgroundColor}
            >

            
            {this.state.markers.map(marker => (
              
                <Marker
                  coordinate={{latitude:marker.coordinates.latitude, longitude:marker.coordinates.longitude}}
                  key={marker.id}
                  pinColor={this.state.nifeBusinesses.includes(marker.id) ? theme.icons.color : theme.generalLayout.secondaryColor}
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

          <TouchableOpacity onPress={this.recenter} style={localStyles.ovrly}>
            <MaterialCommunityIcons
                name='navigation'
                color={theme.GOLD}
                size={35}
            />
          </TouchableOpacity>

          { this.state.isModalVisible ?
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
              user={this.state.userData}
              refresh={this.props.refresh}
              navigation={this.props.navigation}
              friendData={this.props.friends}
            > 
            </BarModal> : null
          }       
          <DrawerButton userPhoto={this.state.userData ? this.state.userData.photoSource : null} drawerButtonColor={theme.generalLayout.secondaryColor} onPress={this.props.onDrawerPress} />


        </View>
      ) 
      :
        
      <View style={localStyles.activityIndicator}>
            <ActivityIndicator 
                size={'large'}
                color={theme.loadingIcon.color}
            />
            <DrawerButton userPhoto={this.state.userData ? this.state.userData.photoSource : null} drawerButtonColor={theme.generalLayout.secondaryColor} onPress={this.props.onDrawerPress}/>
      </View>
  ) 
  }
}

const localStyles = StyleSheet.create({
  ovrly: {
    position: 'absolute',
    top:"5%",
    left: "89%",
    opacity: 0.9,
    backgroundColor: theme.generalLayout.backgroundColor,
    paddingVertical:0,
    borderColor: theme.generalLayout.secondaryColor,
    zIndex:150,
    elevation:150,
  },
  markerVisited:{
    marginTop: 12,
    position:"relative"
  },
  autoCompContainer: {
    maxHeight: '30%',
    marginTop: '10%',
    marginLeft: '5%',
    zIndex: 3, // works on ios
    elevation: 3, // works on android
  },
  font: {
    textShadowColor: 'black',
    textShadowOffset: {
        width: 20, 
        height: 20
    },
    textShadowRadius: 20,
    color: theme.icons.color,
    fontFamily: theme.generalLayout.font
  },
  container: {
    flex: 1,
    backgroundColor: theme.generalLayout.backgroundColor
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
    backgroundColor: theme.generalLayout.backgroundColor
  },
  callOutMarker: {
    flex: 1,
    backgroundColor: 'white',
    padding: 30,
    margin: 25,
    justifyContent: 'center',
    alignContent: 'center',
    maxWidth: '60%',
    borderRadius: 20,
    borderColor: theme.generalLayout.secondaryColor,
    borderWidth: 1
  },
  overlay: {
    position: 'absolute',
    top:"5%",
    left: "5%",
    opacity: 0.75,
    backgroundColor: theme.generalLayout.backgroundColor,
  },

  map: {
    ...StyleSheet.absoluteFillObject
  },

  drawerButton:{
    backgroundColor: theme.generalLayout.backgroundColor,
    position:"absolute",
    alignSelf:"flex-start",
    top:"-30%",
    zIndex:100,
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
    backgroundColor: theme.generalLayout.backgroundColor,
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
    backgroundColor: theme.generalLayout.backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
    
    borderColor: theme.generalLayout.secondaryColor,
    borderWidth: 10,
    borderRadius: 20,
    width:'100%',
  },
  modalImage:{
    width: '100%',
    height: '100%',
    borderColor: theme.generalLayout.secondaryColor,
    borderWidth: 10,
    borderRadius: 20,
  },

  textCont:{
    bottom:"-10%",
    width:"100%",
    backgroundColor: theme.generalLayout.backgroundColor,
    borderRadius:20,
  },
  descCont: {
    borderRadius: 20,
    borderColor: theme.generalLayout.secondaryColor,
    borderWidth: 1,
    backgroundColor: theme.generalLayout.backgroundColor,
    margin:"1%",
  },
  modalText:{
    color: theme.generalLayout.textColor,
    padding: 5,
    marginLeft:"1%",
    fontWeight:"bold",
    fontFamily: theme.generalLayout.font
  },

  titleCont: {
    backgroundColor: theme.generalLayout.backgroundColor,
    width: '100%',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    top: "-7.5%"
  },
  modalTitle:{
    color: theme.generalLayout.textColor,
    padding: 5,
    fontSize:24,
    borderRadius: 20,
    textAlign:"center",
    fontWeight:'bold',
    backgroundColor: theme.generalLayout.backgroundColor,
    marginVertical:"2%",
    width:"90%",
    fontFamily: theme.generalLayout.font

  },
  ratingText:{
    color: theme.generalLayout.textColor,
    padding: 5,
    fontWeight:"bold",
    textAlign:"center",
    fontFamily: theme.generalLayout.font
  },
  rating:{
    marginTop:"2%",
    marginBottom:"1%",
  }

});

function mapStateToProps(state){
  return{
    user: state.userData,
    friendRequests: state.friendRequests,
    friends: state.friendData,
    businessData: state.businessData,
  }
}

function mapDispatchToProps(dispatch){
  return {
    refresh: (userData) => dispatch({type:'REFRESH', data:userData})
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);