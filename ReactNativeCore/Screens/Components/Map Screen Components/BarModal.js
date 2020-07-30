import React  from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator
} from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import { AirbnbRating } from 'react-native-ratings';
import CheckInOutButtons from '../../Universal Components/CheckInOutBtn';
import * as firebase from 'firebase';
import theme from "../../../Styles/theme";
import Util from "../../../scripts/Util";

class BarModal extends React.Component  {

  state = {
    userData: firebase.auth().currentUser ? firebase.auth().currentUser : null,
    isVisible: this.props.isVisible ? true : false,
    distance: null,
    checkedIn: ""
  }

  toggleModal = (boolean) => {
    this.props.toggleModal(boolean);
  }

  componentDidMount() {
    Util.location.DistanceBetween(this.props.latitude, this.props.longitude, this.props.userLocation, (distance) => {
      distance = distance.toFixed(1);
      this.setState({
        distanceBetween: distance
      })
    });
    Util.location.checkUserCheckInCount(this.props.buisnessUID, this.props.userLocation, (dataObj) => {
      this.setState({
        checkedIn: dataObj.length
      })
    })
  }

  renderInner = () => (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>{this.props.barName}</Text>
      <Text style={styles.panelText}>
        {this.state.distanceBetween} miles away
      </Text>
      <Text style={styles.panelText}>
        {this.props.address}
      </Text>
      <Image
        style={styles.photo}
        source={{uri: this.props.source.uri}}
      />
      <AirbnbRating 
        starContainerStyle={styles.ratingSystem}
        defaultRating={this.props.rating}
        showRating={false}
        isDisabled={true}
        reviewSize={20}
        selectedColor={theme.LIGHT_PINK}
      />
      <Text style={styles.ratingText}> in {this.props.reviewCount} reviews.</Text>
      { 
      !this.state.checkedIn == "" || this.state.checkedIn == 0 ?
          this.state.checkedIn >= 1 ?
            <Text style={styles.ratingText}>
              There is {this.state.checkedIn} person here!
            </Text>
          : 
            <Text style={styles.ratingText}>
              There are {this.state.checkedIn} people here!
            </Text>
        :
        <View style={styles.activityIndicator}>
          <ActivityIndicator 
              size={'large'}
              color={theme.LIGHT_PINK}
          />
        </View>
      }
      <View style={styles.panelButton}>
        <CheckInOutButtons 
          email={this.state.userData.email}
          barName={this.props.barName}
          buisnessUID={this.props.buisnessUID}
          latitude={this.props.latitude}
          longitude={this.props.longitude}
          address={this.props.address}
          phone={this.props.phone}
          source={this.props.source}
          closed={this.props.closed}
        />
      </View>
    </View>
  )

  renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  )

  bs = React.createRef()

  render() {
    return (
      this.state.isVisible ? 
        <View style={styles.container}>
          <BottomSheet
            ref={this.bs}
            snapPoints={['75%', '50%', '0%']}
            renderContent={this.renderInner}
            renderHeader={this.renderHeader}
            enabledBottomInitialAnimation={true}
            onCloseEnd={()=>{this.toggleModal(false)}}
          />
          <TouchableWithoutFeedback onPress={() => {
            this.bs.current.snapTo(0);
          }}>
            <Image style={styles.map} source={{uri: this.props.source.uri}} />
          </TouchableWithoutFeedback>
        </View>
      :
      null
    )
  }
}

const IMAGE_SIZE = 200

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.DARK,
    textAlign:"center",
    alignItems:"center",
  },
  box: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
  panelContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    
  },
  activityIndicator: {
    marginTop: 10,
    justifyContent: 'center', 
    alignItems: 'center' ,
    backgroundColor: '#20232a'
  },
  rating:{
    marginTop:"2%",
    marginBottom:"1%",
    backgroundColor: theme.DARK
  },
  ratingText: {
    color: 'grey',
    padding: 5,
    fontWeight:"bold",
    textAlign:"center"
  },
  panel: {
    padding: 20,
    backgroundColor: theme.DARK,
    height: '100%',
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderRightColor: theme.LIGHT_PINK,
    borderLeftColor: theme.LIGHT_PINK,
  },
  header: {
    backgroundColor: theme.DARK,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderRightColor: theme.LIGHT_PINK,
    borderLeftColor: theme.LIGHT_PINK,
    borderTopColor: theme.LIGHT_PINK
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    marginBottom: 10,
    backgroundColor: theme.LIGHT_PINK
  },
  panelTitle: {
    fontSize: 20,
    height: 35,
    color: theme.LIGHT_PINK,
    textAlign:"center"
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10
  },
  panelText: {
    fontSize: 12,
    color: 'gray',
    textAlign:"center",
    alignItems:"center",
  },
  panelButton: {
    padding: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  photo: {
    width: '100%',
    height: 225,
    marginTop: 30,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: theme.LIGHT_PINK,
    borderRadius: 20
  },
  map: {
    height: '100%',
    width: '100%',
  },
  ratingSystem: {
    borderColor: theme.LIGHT_PINK,
    backgroundColor: theme.DARK,
  },

})
    
  
  export default BarModal;