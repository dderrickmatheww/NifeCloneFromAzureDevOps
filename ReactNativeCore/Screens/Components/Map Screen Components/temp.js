import React  from "react";
import {
  TouchableHighlight,
    StyleSheet,
    Text,
    View,
    Image,
} from "react-native";
import {
  Headline
} from 'react-native-paper';
import Favorite from '../../Universal Components/Favorite';
import { Ionicons } from '@expo/vector-icons';
import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { Rating } from 'react-native-ratings';
import BottomSheet from 'reanimated-bottom-sheet'
import CheckInOutButtons from '../../Universal Components/CheckInOutBtn';
import * as firebase from 'firebase';
import theme from "../../../Styles/theme";

state = {
    isVisible: false,
    isLoggedin: firebase.auth().currentUser ? true : false,
    userData: firebase.auth().currentUser ? firebase.auth().currentUser : null,
  };

  renderContent = () => (
    this.state.isVisible ? 
      <View style={localStyles.textCont}>
        <View style={localStyles.descCont}>
          <Rating 
            ratingBackgroundColor={theme.DARK}
            startingValue={this.props.rating}
            showRating={false}
            readonly={true}
            imageSize={30}
            type="custom"
            style={localStyles.rating}
          />
          <Text style={localStyles.ratingText}> in {this.props.reviewCount} reviews.</Text> 
        </View>
        <View  style={localStyles.descCont}>
          <Text style={localStyles.modalText}>Price: {this.props.price}</Text>
        </View>
        <View style={localStyles.descCont}>
          <Text style={localStyles.modalText}>Number: {this.props.phone} </Text>
        </View>
        <View style={localStyles.descCont}>
          <Text style={localStyles.modalText}>Closed: {this.props.closed == true ? "Yes" : "No"}</Text>
        </View>
        <View style={localStyles.descCont}>
          <Text style={localStyles.modalText}>{this.props.address} </Text>
        </View>
        {/* <View style={localStyles.descCont}>
          <TouchableOpacity></TouchableOpacity>
        </View> */}
        {
          this.state.isLoggedin ?
            <CheckInOutButtons 
              email={this.state.userData.email}
              source={this.props.source}
              barName={this.props.barName}
              phone={this.props.phone}
              closed={this.props.closed}
              address={this.props.address}
              buisnessUID={this.props.buisnessUID}
              latitude={this.props.latitude}
              longitude={this.props.longitude}
            />
          : 
          null
        }
      </View>
    : 
    null
  )

  renderHeader = () => (
    this.state.isVisible ? 
      <View style={localStyles.navHeader}>
          <Image
              style={localStyles.LogoData}
              source={{uri: this.props.barImage }}
          />
          <View style={localStyles.barName}>
              <Headline style={{color: theme.LIGHT_PINK, fontSize: 12, lineHeight: 0 }}></Headline>
          </View>
          <View style={localStyles.DrawerOverlay}>
              <Favorite favoriteTrigg={(buisnessUID, boolean) => {this.props.favoriteABar(buisnessUID, boolean)}} buisnessUID={this.props.buisnessUID} />
          </View>
          <TouchableHighlight  style={localStyles.closeButton}
              onPress={this.props.onPress}
          >
            <Ionicons name="ios-close" size={32} color="#E2E4E3"/>
          </TouchableHighlight>
      </View>
    :
    null
  )

  render() {     
      return(       
        <View style={localStyles.centeredView}>  
          <View style={localStyles.modalView}>
              <BottomSheet 
                snapPoints = {[450, 300, 0]}
                renderContent = {this.renderContent}
                renderHeader = {this.renderHeader}
                enabledBottomInitialAnimation={true}
                enabledBottomClamp={true}
              />
              </View>
        </View>
      )
  }
}

const localStyles = StyleSheet.create({
closeButton:{
  width: '25%',
  top: '-7.5%',
  justifyContent: 'center', 
  alignItems: 'center' ,
},
centeredView: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  width: '100%',
  height: 'auto',
  backgroundColor: theme.DARK,
},
barName: {
  width:"35%", 
  textAlign:"center", 
  alignSelf:"center"
},
DrawerOverlay: {
  alignSelf:"flex-start",
  backgroundColor: theme.DARK,
  borderRadius: 10,
  width: '15%',
  textAlign:"center",
  alignItems:"center",
  margin: '2%',
},
LogoData: {
  width: '25%',
  height: 70,
  borderColor: "#fff",
  borderWidth: 1,
  borderRadius: 5,
  marginRight: 10,
  marginLeft: 0
},
navHeader: {
  flexDirection:"row",
  borderBottomColor: theme.LIGHT_PINK,
  borderBottomWidth: 1,
  paddingBottom: 10,
  marginBottom: 10,
  width:"100%",
  textAlign:"center",
  alignItems:"center",
  overflow: 'hidden'
},
modalView: {
  width:"95%",
  padding: 10,
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 20,
  borderWidth: 1,
  borderColor: theme.LIGHT_PINK,
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
textCont:{
  backgroundColor: "#5D5E60",
  borderRadius: 20,
  alignItems: 'center',
  justifyContent: 'center',
  textAlign:"center",
  width: '100%'
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
ratingText:{
  color: "#20232a",
  padding: 5,
  fontWeight:"bold",
  textAlign:"center"
},
rating:{
  marginTop:"2%",
  marginBottom:"1%",
  backgroundColor:"#BEB2C8"
}

});