import React, {useState} from 'react';
import { View, Text, Dimensions } from 'react-native';
import { styles } from '../Styles/style';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import { render } from 'react-dom';


var counter = 0;
var { width, height } = Dimensions.get('window');
var ASPECT_RATIO = width / height;
var LATITUDE_DELTA = 0.0922;
var LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

var PLACES_KEY = "AIzaSyCxryBFGxYu8Fphfhat7S1iLHByQ4sntkE"

class MapTab extends React.Component  {
  

  constructor(props) {
    
    super(props);
    this.state = {
      region: null,
      markers: null,
      isLoaded: false
    };
  }

  // async componentDidMount(lat, long) {
  //   const response = await this.gatherLocalMarkers(null, lat, long);
  //   const data = await response.json();
  //   this.setState({markers:data, isLoaded:true});
  // }

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
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#263c3f"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#6b9a76"
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

  clientLocationFunction = (e) => {

    
    // console.log(e);
    let { width, height } = Dimensions.get('window');
    let ASPECT_RATIO = width / height;
    let LATITUDE = e.nativeEvent.coordinate.latitude;
    let LONGITUDE = e.nativeEvent.coordinate.longitude;
    let LATITUDE_DELTA = 0.0922;
    let LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

    this.setState({region: {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    }})
    counter++;
    if(this.state.markers == null){
      this.gatherLocalMarkers(e, LATITUDE, LONGITUDE);
    }
    
    
  }

  pressMarker = (e) => {
    console.log(e.nativeEvent);
    console.log('Marker pressed');
  }

   gatherLocalMarkers = (e, lat, long) => {
    
    
    
    fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?key='+ PLACES_KEY+ "&"+ buildParameters(lat, long, 8000))
      .then((response) => {
        return response.json();
        
      })
      .then((data) => {
        var tmpArry = [];
        data = data.results;
        // console.log(data);
        data.forEach(function(place){
          // console.log(place);
          tmpArry.push({
            "latlng":"" + place.geometry.location.lat +","+place.geometry.location.lng,
            "title": place.name
          });
        });
        return tmpArry;
      }).then((places) => {
        if(this.state.markers == null){
          this.setState({markers: places})
        }
        console.log(places)
        return this.state.markers;
      });

      function buildParameters(lat, long, radius){
        var paramString ="";
        //location, lat long
        paramString += "location=" + lat+ "," + long + "&";
        //radius in meters
        paramString +="radius="+radius+"&";
        //type
        paramString +="type=bar"

        return paramString;
      }
      
  }
  
  render() {
    
    return (
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsMyLocationButton={true}
        showsUserLocation={true}
        showsPointsOfInterest={true}
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
    );
  }
}

export default MapTab;