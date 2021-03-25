import React, { Component } from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import Util from '../../../scripts/Util';
import { styles } from '../../../Styles/style';
import DrawerButton from '../../Universal Components/DrawerButton';
import theme from '../../../Styles/theme';
import * as firebase from 'firebase';
import { Ionicons } from '@expo/vector-icons';
import {
  TextInput
} from 'react-native-paper';



export default class EditBusinessProfile extends Component {
  
  state = {
    userData:  null,
    dateOfBirth: null,
    maxDateValue: null,
    gender: 'other',
    sexualOrientation: 'other',
    bio:null,
    favoriteDrinks: [],
    showDatePicker: false,
    doneLoading: false,
    specials:[],
    events:[],
    specialsText: '',
    eventsText:"",
    open:"12:00AM",
    close:"12:00PM"
  }

  setMaxDate = () => {
    var maxDateValue = new Date();
    maxDateValue = maxDateValue.setFullYear( maxDateValue.getFullYear() - 18 );
    return new Date(maxDateValue);
  }

  //Set user data
  setUserData = async () => {
    
      var user = this.props.user;
      this.setState({userData: user});
      let specials = this.props.business.specials;
      let events =  this.props.business.events;
      let specialsValue = ""
      let eventsValue = ""
      specials.forEach((special, i) =>{
        i != specials.length -1 ? specialsValue += special.special + "," : specialsValue += special.special
      })
      events.forEach((event, i) =>{
        i != events.length -1 ? eventsValue += event.event + "&" : eventsValue += event.event
      })

     this.setState({
       close:this.props.business.hours.close,
       open:this.props.business.hours.open,
       doneLoading:true,
       specials: this.props.business.specials,
       events:  this.props.business.events,
       specialsText: specialsValue,
       eventsText: eventsValue
      });

  }

   //gets user and friend data

  componentDidMount(){
    this.setMaxDate();
    this.setUserData();    
  }

  onOpenChange = (time) => {
    var fieldText = time;
  
    this.setState({open:fieldText});
  }

  onCloseChange = (time) => {
    var fieldText = time;
  
    this.setState({close:fieldText});
  }


  onSpecialsChange = (specials) => {
    var fieldText = specials;
    fieldText = fieldText.toString();
    var drinkArr = [];
    let specialsValue =""
    if(fieldText){
      let specials = fieldText.split(',')
      specials.forEach((special, i)=>{
        let obj = {
          special: special,
          uploaded:new Date()
        }
        drinkArr.push(obj)
        i != specials.length -1 ? specialsValue += special + "," : specialsValue += special
        
      })
    }
    this.setState({specials:drinkArr, specialsText:specialsValue});
  }

  onEventsChange = (drinks) => {
    var fieldText = drinks;
    fieldText = fieldText.toString();
    var drinkArr = [];
    let eventsValue =""
    if(fieldText){
      let events = fieldText.split('&')
      events.forEach((event,i)=>{
        let obj = {
          event: event,
          uploaded:new Date()
        }
        drinkArr.push(obj)
        i != events.length -1 ? eventsValue += event + "&" : eventsValue += event
      })
    }
    this.setState({events:drinkArr, eventsText:eventsValue});
  }

  onSave = () => {
    var profileInfo = {
      events:this.state.events,
      specials:this.state.specials,
      hours:{
        open:this.state.open,
        close:this.state.close
      }
    }

    Util.business.UpdateUser(firebase.auth().currentUser.email, profileInfo, (data) => {});

    var user = this.props.business;

    var updatedUser = extend(user, profileInfo);
    this.props.refresh(null, null, null, updatedUser);

    this.props.navigation.navigate("Profile", {screen:"ProfileScreen"})

    function extend(dest, src) {
      for(var key in src) {
          if(key=='dateOfBirth'){
            dest[key] = {seconds:new Date(src[key]).getTime()/1000};
          }
          else if(typeof(src[key]) == "string" ){
            dest[key] = src[key].replace(String.fromCharCode(92), '').replace('"',"");
          }
          else {
            dest[key] = src[key];
          }   
      }
      return dest;
    }
      
  }

  onCancel = () => {
    this.props.navigation.navigate("Profile", {screen:"ProfileScreen"});
  }

   render () {
      return ( 
        ////////////////////////////////////////
          this.state.doneLoading ?
            <View style={styles.loggedInContainer}>
              <View style={localStyles.HeaderCont}>
                  <View style={{flexDirection:"row"}}>
                    <Text style={localStyles.Header}>{this.state.userData.displayName}</Text>
                  </View>
              </View>

              <ScrollView contentContainerStyle={{justifyContent:"flex-start",  width:"90%"}} style={localStyles.mainCont}> 
              {/* Input Area */}

                  <View style={localStyles.fieldCont}> 
                    <Text style={{ fontSize: 18, color: theme.generalLayout.textColor, fontFamily: theme.generalLayout.font, marginBottom:5}}>
                      Open (ex: 12:00PM): 
                    </Text>
                    <TextInput  theme={{colors:{ text: theme.generalLayout.textColor }}}  numberOfLines={2}
                    mode={"flat"}
                    label=""
                    placeholder={"12:00PM"}
                    onChangeText={text => this.onOpenChange(text)}
                    value={this.state.open}
                    style={{backgroundColor:theme.generalLayout.backgroundColor, color:theme.generalLayout.textColor, width:"90%", alignSelf:"center", textAlign:"left", paddingHorizontal:10, paddingVertical:5, borderRadius: 5, borderColor:theme.generalLayout.secondaryColor, borderWidth:1}}>
                    
                    </TextInput>
                  </View>

                  <View style={localStyles.fieldCont}> 
                    <Text style={{ fontSize: 18, color: theme.generalLayout.textColor, fontFamily: theme.generalLayout.font, marginBottom:5}}>
                    Open (ex: 2:00AM): 
                    </Text>
                    <TextInput  theme={{colors:{text: theme.generalLayout.textColor}}}  numberOfLines={2}
                    mode={"flat"}
                    label=""
                    placeholder={"12:00AM"}
                    onChangeText={text => this.onCloseChange(text)}
                    value={this.state.close}
                    style={{backgroundColor:theme.generalLayout.backgroundColor, color:theme.generalLayout.textColor, width:"90%", alignSelf:"center", textAlign:"left", paddingHorizontal:10, paddingVertical:5, borderRadius: 5, borderColor:theme.generalLayout.secondaryColor, fontFamily: theme.generalLayout.font, borderWidth:1}}>
                    
                    </TextInput>
                  </View>

                  <View style={localStyles.fieldCont}> 
                    <Text style={{ fontSize: 18, color: theme.generalLayout.textColor, fontFamily: theme.generalLayout.font, marginBottom:5}}>
                      Specials (comma seperated): 
                    </Text>
                    <TextInput  theme={{colors:{ text: theme.generalLayout.textColor }}}  numberOfLines={2}
                    mode={"flat"}
                    label=""
                    placeholder={"What specials are you offering?"}
                    onChangeText={text => this.onSpecialsChange(text)}
                    value={this.state.specialsText}
                    style={{backgroundColor: theme.generalLayout.backgroundColor, color:theme.generalLayout.textColor, width:"90%", alignSelf:"center", textAlign:"left", paddingHorizontal:10, paddingVertical:5, borderRadius: 5, fontFamily: theme.generalLayout.font, borderColor: theme.generalLayout.secondaryColor, borderWidth:1}}>
                    
                    </TextInput>
                  </View>

                  <View style={localStyles.fieldCont}>
                    <Text style={{ fontSize: 18, color: theme.generalLayout.textColor, marginBottom:5}}>
                      Events (seperate with '&'): 
                    </Text>
                    {/* index one to on change */}
                    <TextInput  theme={{colors:{text: theme.generalLayout.textColor}}} 
                    mode={"flat"}
                    label=""
                    placeholder={"Anything going on soon?"}
                    onChangeText={text => this.onEventsChange(text)}
                    style={{backgroundColor:theme.generalLayout.backgroundColor, color: theme.generalLayout.textColor,width:"90%", alignSelf:"center", borderRadius: 5, borderColor:theme.generalLayout.secondaryColor, borderWidth:1}}
                    value={this.state.eventsText}
                    >
                      
                    </TextInput>
                    
                  </View>
              </ScrollView>
              {/* buttons at the top */}
              <TouchableOpacity style={localStyles.SaveOverlay}
                onPress={()=> this.onSave()}
              >
                <Ionicons name="ios-checkmark-circle-outline" size={30} color={theme.icons.color} />
              </TouchableOpacity>

              <TouchableOpacity style={localStyles.CancelOverlay}
                onPress={()=> this.onCancel()}
              >
                <Ionicons name="ios-close-circle-outline" size={30} color={theme.icons.color} />
              </TouchableOpacity>
              <DrawerButton drawerButtonColor="#eca6c4" onPress={this.props.onDrawerPress} /> 
            </View>
            :
        ///////////////////////////////////////////
            <View style={styles.viewDark}>
                <ActivityIndicator size="large" color={theme.loadingIcon.color}></ActivityIndicator>
                <DrawerButton drawerButtonColor="#eca6c4" onPress={this.props.onDrawerPress} /> 
            </View> 
        
      );
    }
}

const localStyles = StyleSheet.create({
  surface: {
    width:"auto",
    elevation: 10,
  },
  fieldCont:{
    marginVertical:5
  },
  mainCont:{
    width:"95%",
    flex:1,
    flexDirection:"column",
  },

  SaveOverlay: {
    position: 'absolute',
    top:"6%",
    left: "90.5%",
    backgroundColor: theme.generalLayout.backgroundColor,
    borderRadius: 10,
    paddingVertical:0,
  },
  CancelOverlay: {
    position: 'absolute',
    top:"6%",
    left: "80%",
    backgroundColor: theme.generalLayout.backgroundColor,
    borderRadius: 10,
    paddingVertical:0,
  },

  AddFriendOverlay: {
    position: 'absolute',
    top:"6%",
    left: "70%",
    opacity: 0.75,
    backgroundColor: theme.generalLayout.backgroundColor,
    borderRadius: 10,
    paddingVertical:0,
  },

  LocAndFriends:{
    flexDirection: "row",
    justifyContent:"space-between",
    alignItems:"stretch",
    width:"90%"
  },
  loggedInContainer:{
    alignItems:"flex-start", 
    flex: 1, 
    flexDirection: "column",
    backgroundColor: theme.generalLayout.backgroundColor,
    alignItems:"center",
    justifyContent:"space-evenly"
  },
  loggedInSubView:{
    flex: 1, 
    backgroundColor: theme.generalLayout.backgroundColor,
    width: "100%",
    justifyContent:"center",
    marginBottom:"10%",
    alignItems:"center",
  },
  HeaderCont:{
    flex: 1, 
    backgroundColor: theme.generalLayout.backgroundColor,
    width: "100%",
    maxHeight:"15%",
    justifyContent:"flex-end",
    alignItems:"center",
    borderBottomColor: theme.generalLayout.secondaryColor,
    borderBottomWidth: 2,

  },
  profilePic: {
    width: 75, 
    height: 75, 
    borderRadius: 50,
    marginBottom: "5%"
  },
  friendPic: {
    width: 50, 
    height: 50, 
    borderRadius: 50,
  },
  friendCont:{
    flexDirection: "row",
    borderBottomColor:theme.generalLayout.secondaryColor,
    borderBottomWidth: 1,
  },
  name: {
    fontSize: 18,
    color: theme.generalLayout.textColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical:'.5%',
    marginLeft:'2.5%',
    width: "100%",
    fontFamily: theme.generalLayout.font
  },
  FriendCount: {
    fontSize: 15,
    marginTop: "2%",
    marginBottom: "1%",
    color: theme.generalLayout.textColor,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: theme.generalLayout.font
  },
  Header: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.generalLayout.textColor,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: theme.generalLayout.font
  },
  ScrollView: {
    flex: 1,
    width:"100%",
    borderLeftWidth:2,
    borderLeftColor: theme.generalLayout.secondaryColor,
    borderRightWidth:2,
    borderRightColor: theme.generalLayout.secondaryColor,
    paddingHorizontal: "5%",
    paddingBottom: "1%"
  }
});