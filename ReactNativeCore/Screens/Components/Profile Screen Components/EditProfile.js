import React, { Component } from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import Picker from '@react-native-community/picker';
import Util from '../../../scripts/Util';
import { styles } from '../../../Styles/style';
import DrawerButton from '../../Universal Components/DrawerButton';
import theme from '../../../Styles/theme';
import * as firebase from 'firebase';
import { Ionicons } from '@expo/vector-icons'; 
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  TextInput,
  Surface,
  Chip
} from 'react-native-paper';


export default class EditProfile extends Component {
  
  state = {
    userData:  this.props.user,
    dateOfBirth: this.props.user.dateOfBirth ? new Date(this.props.user.dateOfBirth._seconds ? this.props.user.dateOfBirth._seconds : this.props.user.dateOfBirth.seconds * 1000) : null,
    maxDateValue: null,
    gender: this.props.user.gender ? this.props.user.gender : 'other',
    sexualOrientation: this.props.user.sexualOrientation ? this.props.user.sexualOrientation : 'other',
    bio: this.props.user.bio ? this.props.user.bio : "",
    favoriteDrinks: this.props.user.favoriteDrinks && this.props.user.favoriteDrinks >0 ? this.props.user.favoriteDrinks : null,
    showDatePicker: false,
    doneLoading: false,
    favoriteBars: null,
    faveCount: 0
  }

  setMaxDate = () => {
    var maxDateValue = new Date();
    maxDateValue = maxDateValue.setFullYear( maxDateValue.getFullYear() - 18 );
    return new Date(maxDateValue);
  }

  //Set user data
  setUserData = async () => {
      var user = this.props.user;
      let favorites = this.props.user.favoritePlaces;
      let actualFavoriteBars = [];
      if(favorites){
        let barIds = Object.keys(favorites);
        
        barIds.forEach((id)=>{
          if(favorites[id]['favorited']== true){
            actualFavoriteBars.push(actualFavoriteBars)
          }
        });
      }
      
      //console.log(user.dateOfBirth)
      this.setState({
        userData: user,
        dateOfBirth:  user.dateOfBirth ? new Date(user.dateOfBirth._seconds ? user.dateOfBirth._seconds : user.dateOfBirth.seconds * 1000) : this.setMaxDate(),
        gender: user.gender ? user.gender : "other",
        sexualOrientation: user.sexualOrientation ? user.sexualOrientation : 'other',
        bio: user.bio ? user.bio : "",
        favoriteDrinks: user.favoriteDrinks ? user.favoriteDrinks : [],
        doneLoading: true,
        favoriteBars: user.favoritePlaces ? user.favoritePlaces : {},
        displayName: user.displayName,
        faveCount: actualFavoriteBars.length,
      });

  }

  //gets user and friend data
  componentDidMount(){
    //console.log(this.state)
    this.setMaxDate();
    this.setUserData();
  }

  onDOBChange = async (event, selectedDate) => {
    if(selectedDate){
      var date = new Date(selectedDate);
      await this.setState({dateOfBirth: date});
      this.setState({showDatePicker: false});
    }
    else {
      this.setState({showDatePicker: false});
    }
  }

  onGenderChange = (gender) => {
    this.setState({ gender: gender })
  }

  onSexualOrientationChange = (orientation) => {
    this.setState({ sexualOrientation: orientation })
  }

  onBioChange = (bio) => { 
    this.setState({ bio: bio });
  }

  onFavoriteDrinkChange = (drinks) => {
    var fieldText = drinks;
    fieldText = fieldText.toString();
    var drinkArr = [];
    if(fieldText.indexOf(',') == -1){

      drinkArr.push(fieldText);
    } else {
      drinkArr = fieldText.split(',');
    }
    this.setState({ favoriteDrinks: drinkArr });
  }

  deleteFavBar = (bar, UID) => {
    let barName = bar.name;
    Util.user.setFavorite(this.state.userData, UID, false, barName, (boolean, boolean2) => {
      let updatedUserData = this.props.user;
      if(boolean2) {
        this.setState({ navModal: true });
      }
      else {
        if(typeof updatedUserData['favoritePlaces'] !== 'undefined') {
          updatedUserData['favoritePlaces'][UID] = {
            favorited: boolean,
            name: barName
          };
          let favorites = this.props.updatedUserData.favoritePlaces;
          let barIds = Object.keys(favorites);
          let actualFavoriteBars = [];
          barIds.forEach((id) => {
            if(favorites[id]['favorited'] == true){
              actualFavoriteBars.push(actualFavoriteBars);
            }
          });
          this.setState({
            userData: updatedUserData,
            faveCount:actualFavoriteBars.length
          });
          this.props.refresh(updatedUserData, null, null, null);
        }
      }
    });

  }

  onSave = () => {
    var profileInfo = {
      dateOfBirth: this.state.dateOfBirth ? this.state.dateOfBirth : null,
      gender: this.state.gender,
      sexualOrientation: this.state.sexualOrientation,
      bio: this.state.bio,
      favoriteDrinks: this.state.favoriteDrinks,
      favoritePlaces: this.state.favoriteBars,
      displayName: this.state.displayName
    }
    Util.user.UpdateUser(firebase.firestore(), firebase.auth().currentUser.email, profileInfo, () => {});
    var user = this.state.userData;
    var updatedUser = extend(user, profileInfo);
    this.props.refresh(updatedUser, null, null);
    this.props.navigation.navigate("Profile", {screen:"ProfileScreen"})
    function extend(dest, src) {
      for(var key in src) {
          if(key =='dateOfBirth'){
            dest[key] = { seconds: new Date(src[key]).getTime()/1000};
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

  onNameChange = (displayName) => {
    this.setState({displayName:displayName})
  }

   render () {
      return ( 
          this.state.doneLoading ?
            <View style={styles.loggedInContainer}>
              <View style={localStyles.HeaderCont}>
                  
              </View>
              <ScrollView contentContainerStyle={{justifyContent:"flex-start",  width:"90%"}} style={localStyles.mainCont}> 
              {/* Input Area */}
                  <Text style={{ fontSize: 18, color: theme.LIGHT_PINK, marginBottom: 15}}>
                    All information is optional and can be hidden via privacy settings! 
                  </Text>
                  {/* Display name */}
                  <View style={localStyles.fieldCont}> 
                    <Text style={localStyles.fieldLabel}>
                      Display Name: 
                    </Text>
                    <TextInput  theme={{colors:{text:theme.LIGHT_PINK}}}  numberOfLines={2}
                    mode={"flat"}
                    label=""
                    placeholder={"What should we call you?"}
                    onChangeText={text => this.onNameChange(text)}
                    value={this.state.displayName}
                    style={{backgroundColor:theme.DARK, color:theme.DARK, width:"90%", alignSelf:"center", textAlign:"left", paddingHorizontal:10, paddingVertical:5, borderRadius: 5, borderColor:theme.LIGHT_PINK_OPAC, borderWidth:1}}>
                    
                    </TextInput>
                  </View>
                    
                    {/* DOB */}
                  <View style={localStyles.fieldCont}> 
                    <View style={{flexDirection:"row", width:"90%"}}>
                      <Text style={localStyles.fieldLabel}>
                        Date of Birth:  
                      </Text>
                      <Text style={{color:theme.LIGHT_PINK, fontSize:18, marginBottom:5, marginLeft:20}}>
                        {this.state.dateOfBirth ? new Date(this.state.dateOfBirth).toLocaleDateString() : "None given."}
                      </Text>
                      <TouchableOpacity style={{alignSelf: "flex-end", marginLeft: 50, paddingBottom: 5}}
                        onPress={() => this.setState({showDatePicker: true})}
                      >
                          <Ionicons name="md-calendar" size={24} color={theme.LIGHT_PINK} />
                      </TouchableOpacity>
                    </View>
                    
                    {
                      this.state.showDatePicker && (
                        <DateTimePicker
                          mode={"date"}
                          value={this.state.dateOfBirth ? this.state.dateOfBirth :this.state.maxDateValue}
                          maximumDate={ this.setMaxDate()}
                          display={"spinner"}
                          onChange={(event, selectedDate) => this.onDOBChange(event, selectedDate)}
                        />
                      )
                    }
                  </View>

                  <View style={localStyles.fieldCont}> 
                    <Text  style={localStyles.fieldLabel}>
                      Gender: 
                    </Text>
                    <Surface style={localStyles.surface}>
                      <Picker 
                        mode={"dropdown"}
                        style={{backgroundColor:theme.DARK, width:"100%", alignSelf:"center"}}
                        selectedValue={this.state.gender ? this.state.gender : "other"}
                        onValueChange={(value) => this.onGenderChange(value)}
                      >
                        <Picker.Item color={theme.LIGHT_PINK} label="Male" value="male"/>
                        <Picker.Item color={theme.LIGHT_PINK} label="Female" value="female"/>
                        <Picker.Item color={theme.LIGHT_PINK} label="Other" value="other"/>
                      </Picker>
                    </Surface>
                      
                  </View>

                  <View style={localStyles.fieldCont}> 
                    <Text  style={localStyles.fieldLabel}>
                      Sexual Orientation: 
                    </Text>
                    <Surface style={localStyles.surface}>
                      <Picker
                        mode={"dropdown"}
                        selectedValue={this.state.sexualOrientation ? this.state.sexualOrientation : "other"}
                        style={{backgroundColor:theme.DARK, width:"100%", alignSelf:"center"}}
                        onValueChange={(value) => this.onSexualOrientationChange(value)}
                      >
                        <Picker.Item color={theme.LIGHT_PINK} label="Straight" value="straight"/>
                        <Picker.Item color={theme.LIGHT_PINK} label="Homosexual/Gay/Lesbian" value="homosexual"/>
                        <Picker.Item color={theme.LIGHT_PINK} label="Bi-sexual/Fluid" value="bi-sexual"/>
                        <Picker.Item color={theme.LIGHT_PINK} label="Other" value="other"/>
                      </Picker>
                    </Surface>
                  </View>
                  {this.state.faveCount > 0 ?
                    <View style={localStyles.fieldCont}> 
                      <Text  style={localStyles.fieldLabel}>
                        Click a bar to delete from your favorites!
                      </Text>
                      {
                          this.state.userData.favoritePlaces ?  
                          Object.values(this.state.userData.favoritePlaces).map((bar, i) => (
                            
                            this.state.userData.favoritePlaces[Object.keys(this.state.userData.favoritePlaces)[i]]['favorited'] == true ? 
                            <Chip mode={"outlined"}  
                                key={i}
                                style={{backgroundColor:theme.DARK, borderColor:theme.LIGHT_PINK, marginHorizontal:2, marginVertical:2
                                }} 
                                bar={bar}
                                textStyle={{color:theme.LIGHT_PINK}}
                                onPress={(e) => {
                                  let UID = Object.keys(this.state.userData.favoritePlaces)[i];
                                  this.deleteFavBar(bar, UID);
                                }}
                              >
                                {bar.name}
                              </Chip> : null
                          )) 
                          :
                          <Chip mode={"outlined"}  
                              style={{backgroundColor:theme.DARK, borderColor:theme.LIGHT_PINK, marginHorizontal:2
                              }} 
                              textStyle={{color:theme.LIGHT_PINK}}>
                            You have no favorites!
                          </Chip>
                      }
                    </View> : null
                  }
                  <View style={localStyles.fieldCont}> 
                    <Text style={localStyles.fieldLabel}>
                      Bio: 
                    </Text>
                    <TextInput  theme={{colors:{text:theme.LIGHT_PINK}}}  numberOfLines={2}
                    mode={"flat"}
                    label=""
                    placeholder={"Tell us about yourself"}
                    onChangeText={text => this.onBioChange(text)}
                    value={this.state.bio}
                    style={{backgroundColor:theme.DARK, color:theme.DARK, width:"90%", alignSelf:"center", textAlign:"left", paddingHorizontal:10, paddingVertical:5, borderRadius: 5, borderColor:theme.LIGHT_PINK_OPAC, borderWidth:1}}>
                    
                    </TextInput>
                  </View>

                  <View style={localStyles.fieldCont}>
                    <Text  style={localStyles.fieldLabel}>
                      Favorite Drinks (comma seperated): 
                    </Text>
                    {/* index one to on change */}
                    <TextInput  theme={{colors:{text:theme.LIGHT_PINK}}} 
                    mode={"flat"}
                    label=""
                    placeholder={"What're you drinkin'?"}
                    onChangeText={text => this.onFavoriteDrinkChange(text)}
                    style={{backgroundColor:theme.DARK,color:theme.DARK,width:"90%", alignSelf:"center", borderRadius: 5, borderColor:theme.LIGHT_PINK_OPAC, borderWidth:1}}
                    value={this.state.favoriteDrinks.toString()}
                    >
                    </TextInput>
                    
                  </View>
              </ScrollView>
              {/* buttons at the top */}
              <TouchableOpacity style={localStyles.SaveOverlay}
                onPress={()=> this.onSave()}
              >
                <Ionicons name="ios-checkmark-circle-outline" size={30} color={theme.LIGHT_PINK} />
              </TouchableOpacity>

              <TouchableOpacity style={localStyles.CancelOverlay}
                onPress={()=> this.onCancel()}
              >
                <Ionicons name="ios-close-circle-outline" size={30} color={theme.LIGHT_PINK} />
              </TouchableOpacity>
              <DrawerButton drawerButtonColor={theme.LIGHT_PINK} onPress={this.props.onDrawerPress} /> 
            </View>
            :
        ///////////////////////////////////////////
            <View style={styles.viewDark}>
                <ActivityIndicator size="large" color={theme.LIGHT_PINK}></ActivityIndicator>
                <DrawerButton drawerButtonColor="#eca6c4" onPress={this.props.onDrawerPress} /> 
            </View> 
        
      );
    }
}

const localStyles = StyleSheet.create({
  fieldLabel:{ 
    fontSize: 18,
    color: theme.LIGHT_PINK,
    marginBottom:5,
    textDecorationLine:"underline",
    fontWeight:"bold"
  },
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
    backgroundColor: theme.DARK,
    borderRadius: 10,
    paddingVertical:0,
  },
  CancelOverlay: {
    position: 'absolute',
    top:"6%",
    left: "80%",
    backgroundColor: theme.DARK,
    borderRadius: 10,
    paddingVertical:0,
  },

  AddFriendOverlay: {
    position: 'absolute',
    top:"6%",
    left: "70%",
    opacity: 0.75,
    backgroundColor: theme.DARK,
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
    backgroundColor: theme.DARK,
    alignItems:"center",
    justifyContent:"space-evenly"
  },
  loggedInSubView:{
    flex: 1, 
    backgroundColor: theme.DARK,
    width: "100%",
    justifyContent:"center",
    marginBottom:"10%",
    alignItems:"center",
  },
  HeaderCont:{
    flex: 1, 
    backgroundColor: theme.DARK,
    width: "100%",
    maxHeight:"12%",
    justifyContent:"flex-end",
    alignItems:"center",
    borderBottomColor: theme.LIGHT_PINK,
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
    borderBottomColor:theme.LIGHT_PINK,
    borderBottomWidth: 1,
  },
  name: {
    fontSize: 18,
    color: theme.LIGHT_PINK,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical:'.5%',
    marginLeft:'2.5%',
    width: "100%"
  },
  FriendCount: {
    fontSize: 15,
    marginTop: "2%",
    marginBottom: "1%",
    color: theme.LIGHT_PINK,
    justifyContent: 'center',
    alignItems: 'center'
  },
  Header: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.LIGHT_PINK,
    justifyContent: 'center',
    alignItems: 'center'
    
  },
  ScrollView: {
    flex: 1,
    width:"100%",
    borderLeftWidth:2,
    borderLeftColor: theme.LIGHT_PINK,
    borderRightWidth:2,
    borderRightColor: theme.LIGHT_PINK,
    paddingHorizontal: "5%",
    paddingBottom: "1%"
  }
});