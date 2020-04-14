import React, {useState} from 'react';
import { View, Text, Dimensions, Image, Modal } from 'react-native';
import { styles } from '../Styles/style';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import { render } from 'react-dom';
import BarModal from './Components/BarModal';

var counter = 0;
var { width, height } = Dimensions.get('window');
var ASPECT_RATIO = width / height;
var LATITUDE_DELTA = 0.0922;
var LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
var LATITUDE;
var LONGITUDE;

var PLACES_KEY = "oxasBCCJwzHDUwcBp7bdHyMqZ8nMEqptWcK9pIkDDagJqQ-5lCZ6r5A19FsSpYmj-BdlVdbiEj-4kadaC9bWOY-c1CjyigMVnY-cGgcHzFUoLh937z3dH-bneoGTXnYx"

class MapTab extends React.Component  {
  

  constructor(props) {
    
    super(props);
    this.state = {
      region: null,
      markers: [],
      isLoaded: false,
      markerSelected: false,
      modalProps:{
        isVisible:false,
        source:{uri:"#"},
        barName:"#",
        rating:"#",
        reviewCount:"#",
        price: "#",
        phone: "#",
        closed: "#",
        address: "#",
      }
    };
  }

  clientLocationFunction = (e) => { 
    // console.log(e);
    let { width, height } = Dimensions.get('window');
    let ASPECT_RATIO = width / height;
     LATITUDE = e.nativeEvent.coordinate.latitude;
     LONGITUDE = e.nativeEvent.coordinate.longitude;
    let LATITUDE_DELTA = 0.0922;
    let LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

    this.setState({region: {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    }})
    counter++;
    if(LONGITUDE != undefined){
      console.log("Lat:" + LATITUDE);
      console.log("Long:" + LONGITUDE);
      this.gatherLocalMarkers(LATITUDE, LONGITUDE);
      this.setState({isLoaded:true});
    }   
  }

   gatherLocalMarkers = ( lat, long) => {  
    fetch('https://api.yelp.com/v3/businesses/search?'+ buildParameters(lat, long, 8000), 
        {headers: new Headers({'Authorization':"Bearer "+ PLACES_KEY})
      })
      .then((response) => {
        return response.json();
        
      })
      .then((data) => {
        data = data['businesses'];
        return data;
      })
      .then((places) => {
        this.setState({markers: places})
        // console.log(places)
      });

      function buildParameters(lat, long, radius){
        var paramString ="";
        //location, lat long
        paramString += "latitude=" + lat+ "&longitude=" + long + "&";
        //radius in meters
        paramString +="radius="+radius+"&";
        //type
        paramString +="categories=bars"

        return paramString;
      } 
  }

  HandleMarkerPress = (e, key) => {
    // console.log(e.nativeEvent);
    var places;
    places = this.state.markers;
    // console.log(places);
    var wantedPlace;
    places.forEach(function(place){
      if(place.id == key){
        wantedPlace = place;
      }
    });
    console.log(wantedPlace);
    this.setState({modalProps:{
      isVisible: true,
      source:{uri: "" + wantedPlace.image_url},
      barName:wantedPlace.name, 
      rating:wantedPlace.rating,
      reviewCount:wantedPlace.review_count,
      price: wantedPlace.price,
      phone: wantedPlace.display_phone,
      closed: wantedPlace.is_closed,
      address: ""+ wantedPlace.location.display_address[0] + ", " + wantedPlace.location.display_address[1] ,
    }});
    console.log(this.state.modalProps);
  }

  
  render() {
    return (
      this.state.markers != null && this.state.markers != undefined ?
      <View style={styles.container}> 
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showsMyLocationButton={true}
          showsUserLocation={true}
          showsPointsOfInterest={false}
          userLocationUpdateInterval={1000}
          region={this.state.region}
          onUserLocationChange={(e) => {counter == 0 ? this.clientLocationFunction(e, counter) : null}}
          showsScale={true}
          customMapStyle={this.mapStyle}
          minZoomLevel={15}
          maxZoomLevel={20}
          moveOnMarkerPress={false}
        >
        {this.state.markers.map(marker => (
            <Marker
              coordinate={{latitude:marker.coordinates.latitude, longitude:marker.coordinates.longitude}}
              title={marker.name}
              description={"Rated " + marker.rating + "/5 stars in " + marker.review_count + " reviews."}
              key={marker.id}
              onCalloutPress={(e) => this.HandleMarkerPress(e, marker.id)}
            >
            </Marker>
          ))}
      </MapView> 
      <View style={styles.modalView}>
        <BarModal 
            isVisible={this.state.modalProps.isVisible}
            source={this.state.modalProps.source}
            barName={this.state.modalProps.barName}
            rating={this.state.modalProps.rating}
            reviewCount={this.state.modalProps.reviewCount}
            price={this.state.modalProps.price}
            phone={this.state.modalProps.phone}
            closed={this.state.modalProps.closed}
            address={this.state.modalProps.address} 
          /> 
      </View>
      
    </View> :

     <View style={styles.container}>
       <MapView
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      showsMyLocationButton={true} 
      showsUserLocation={true}
      showsPointsOfInterest={false}
      userLocationUpdateInterval={1000}
      region={this.state.region}
      onUserLocationChange={(e) => {counter == 0 ? this.clientLocationFunction(e, counter) : null}}
      showsScale={true}
      customMapStyle={this.mapStyle}
      minZoomLevel={15}
      maxZoomLevel={20}
      moveOnMarkerPress={false}
    >
       
      </MapView> 
        <View style={styles.modalView}>
          <BarModal 
              isVisible={this.state.modalProps.isVisible}
              source={this.state.modalProps.source}
              barName={this.state.modalProps.barName}
              rating={this.state.modalProps.rating}
              reviewCount={this.state.modalProps.reviewCount}
              price={this.state.modalProps.price}
              phone={this.state.modalProps.phone}
              closed={this.state.modalProps.closed}
              address={this.state.modalProps.address} 
            /> 
        </View>
      </View>
    )
  }

  mapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#746855"
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
          "color": "#d59563"
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
          "color": "#38414e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#212a37"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9ca5b3"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#746855"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#1f2835"
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
          "color": "#17263c"
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
  ]
}

export default MapTab;