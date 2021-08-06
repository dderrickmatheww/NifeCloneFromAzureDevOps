import React, { Component } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-community/picker'
import Util from '../../scripts/Util';
import { styles } from '../../../src/styles/style';
import DrawerButton from '../Universal/DrawerButton';
import theme from '../../../src/styles/theme';
import { Ionicons } from '@expo/vector-icons'; 
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  TextInput,
  Surface,
  Chip
} from 'react-native-paper';
import { connect } from "react-redux";
const TouchableOpacity = Util.basicUtil.TouchableOpacity();


 class EditProfile extends Component {
  
  state = {
    userData:  this.props.user,
    dateOfBirth: this.props.user.dateOfBirth && this.props.user != 'Unknown' ? new Date(this.props.user.dateOfBirth._seconds * 1000 ? this.props.user.dateOfBirth._seconds * 1000 : this.props.user.dateOfBirth.seconds * 1000) : new Date(),
    maxDateValue: null,
    gender: this.props.user.gender ? this.props.user.gender : 'Other',
    sexualOrientation: this.props.user.sexualOrientation ? this.props.user.sexualOrientation : 'Other',
    bio: this.props.user.bio ? this.props.user.bio : "This user has no bio!",
    favoriteDrinks: this.props.user.favoriteDrinks && this.props.user.favoriteDrinks > 0 ? this.props.user.favoriteDrinks : [],
    showDatePicker: false,
    doneLoading: false,
    favoriteBars: null,
    faveCount: 0,
    dropdownTextColor: null,
  }

  setMaxDate = () => {
    var maxDateValue = new Date();
    maxDateValue = maxDateValue.setFullYear( maxDateValue.getFullYear() - 18 );
    maxDateValue = new Date(maxDateValue);
    console.log(maxDateValue)
    return maxDateValue
  }

  //Set user data
  setUserData = async () => {
      var user = this.props.user;
      let favorites = this.props.user.favoritePlaces ? this.props.user.favoritePlaces : {};
      let actualFavoriteBars = [];
      if (favorites) {
        let barIds = Object.keys(favorites);
        if(barIds.length > 0) {
          barIds.forEach((id) => {
            if(favorites[id]['favorited'] == true) {
              actualFavoriteBars.push(actualFavoriteBars);
            }
          });
        }
      }
      this.setState({
        userData: typeof user !== 'undefined' ? user : {},
        dateOfBirth:  (typeof user.dateOfBirth !== 'undefined' && typeof user.dateOfBirth !== 'string') ? new Date(user.dateOfBirth._seconds ? user.dateOfBirth._seconds * 1000 : user.dateOfBirth.seconds * 1000) : new Date().setFullYear( new Date().getFullYear() - 18 ),
        gender: typeof user.gender !== 'undefined' ? user.gender : "Other",
        sexualOrientation: typeof user.sexualOrientation !== 'undefined' ? user.sexualOrientation : 'Other',
        bio: typeof user.bio !== 'undefined' ? user.bio : "This user has no bio!",
        favoriteDrinks: typeof user.favoriteDrinks !== 'undefined' ? user.favoriteDrinks : [],
        doneLoading: true,
        favoriteBars: typeof user.favoritePlaces !== 'undefined' ? user.favoritePlaces : {},
        displayName: typeof user.displayName !== 'undefined' ? user.displayName : 'Anonymous',
        faveCount: typeof actualFavoriteBars !== 'undefined' ? actualFavoriteBars.length : 0
      });
  }

  getDropdownColor = () =>{
    this.setState({dropdownTextColor: {
      ...Platform.select({
        ios: 'white',
        android:'black'
      })
    }}) 
  }
  //gets user and friend data
  async componentDidMount() {
    this.setMaxDate();
    this.setUserData();
  }

  onDOBChange = (event, selectedDate) => {
    if (selectedDate) {
      var date = new Date(selectedDate);
      this.setState({ 
        dateOfBirth: date
      });
    }
  }

  onGenderChange = (gender) => {
    this.setState({ gender: gender });
  }

  onSexualOrientationChange = (orientation) => {
    this.setState({ sexualOrientation: orientation });
  }

  onNameChange = (displayName) => {
    this.setState({ displayName: displayName });
  }

  onBioChange = (bio) => { 
    this.setState({ bio: bio });
  }

  onFavoriteDrinkChange = (drinks) => {
    var fieldText = drinks;
    fieldText = fieldText.toString();
    var drinkArr = [];
    if(fieldText.indexOf(',') == -1) {
      drinkArr.push(fieldText);
    } 
    else {
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
    let user = this.state.userData;
    Util.user.UpdateUser(user.email, profileInfo);
    let updatedUser = Util.basicUtil.extend(user, profileInfo);
    // this.props.refresh(updatedUser, null, null);
    this.props.refresh(updatedUser);
    this.props.navigation.navigate("Profile", { screen: "ProfileScreen" });
  }

  onCancel = () => {
    this.props.navigation.navigate("Profile", {screen:"ProfileScreen"});
  }

   render () {
      return ( 
          this.state.doneLoading ?
            <View style={localStyles.loggedInContainer}>
              <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center'}} style={localStyles.mainCont}> 
              {/* Input Area */}
                  <Text style={{ fontSize: 16, color: theme.generalLayout.textColor, marginBottom: 15, fontFamily: theme.generalLayout.font}}>
                    All information is optional and can be hidden via privacy settings! 
                  </Text>
                  {/* Display name */}
                  <View style={localStyles.fieldCont}> 
                    <Text style={localStyles.fieldLabel}>
                      Display Name: 
                    </Text>
                    <TextInput  theme={{ colors: { text: theme.generalLayout.textColor } }}  numberOfLines={2}
                      mode={"flat"}
                      label=""
                      placeholder={"What should we call you?"}
                      onChangeText={text => this.onNameChange(text)}
                      placeholderTextColor={theme.generalLayout.textColor}
                      value={this.state.displayName}
                      style={{backgroundColor: theme.generalLayout.backgroundColor, color: theme.generalLayout.textColor, width:"100%", alignSelf:"center", textAlign:"left", paddingHorizontal:10, paddingVertical:5, borderRadius: 5, borderColor: theme.generalLayout.secondaryColor, borderWidth:1}}>
                    </TextInput>
                  </View>
                    
                    {/* DOB */}
                  <View style={localStyles.fieldCont}> 
                    <View style={{flexDirection:"row", width:"100%", alignItems: 'center'}}>
                      <Text style={localStyles.fieldLabel}>
                        Date of Birth:  
                      </Text>
                      <Text style={{ color: theme.generalLayout.textColor, fontFamily: theme.generalLayout.font, fontSize: 14, marginBottom: 5, marginLeft: '15.5%' }}>
                        {this.state.dateOfBirth ? new Date(this.state.dateOfBirth).toLocaleDateString() : "None given."}
                      </Text>
                      <TouchableOpacity style={{alignSelf: "flex-end", marginLeft: '16.5%', paddingBottom: 5}}
                        onPress={() => this.state.showDatePicker ? this.setState({showDatePicker: false}) : this.setState({showDatePicker: true})}
                      >
                          <Ionicons name="md-calendar" size={24} color={theme.icons.color} />
                      </TouchableOpacity>
                    </View>
                    
                    {
                      this.state.showDatePicker && (
                        <View style={localStyles.fieldCont, {alignContent: 'center'}}> 
                        <Text style={{ fontSize: 12, color: theme.generalLayout.textColor, marginBottom: 15, fontFamily: theme.generalLayout.font}}>
                          Click the date again to dismiss!
                        </Text>
                        <DateTimePicker
                          mode={"date"}
                          textColor={theme.generalLayout.textColor}
                          value={ this.state.dateOfBirth ? this.state.dateOfBirth : new Date() }
                          maximumDate={ this.setMaxDate() }
                          display={"spinner"}
                          onChange={(event, selectedDate) => this.onDOBChange(event, selectedDate)}
                        />
                        </View>
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
                        style={localStyles.dropdown}
                        selectedValue={this.state.gender ? this.state.gender : "Other"}
                        onValueChange={(value) => this.onGenderChange(value)}
                        itemStyle={{color:'black', backgroundColor: theme.generalLayout.backgroundColor,}}
                      >
                        <Picker.Item  color={Platform.select({
                            ios: theme.generalLayout.textColor,
                            android:'black'
                          })} 
                          style={{color:'black'}} label="Male" value="male"
                        />
                        <Picker.Item color={Platform.select({
                            ios: theme.generalLayout.textColor,
                            android:'black'
                          })}  label="Female" value="female"/>
                        <Picker.Item color={Platform.select({
                            ios: theme.generalLayout.textColor,
                            android:'black'
                          })}  label="Other" value="other"/>
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
                        selectedValue={this.state.sexualOrientation ? this.state.sexualOrientation : "Other"}
                        style={localStyles.dropdown}
                        onValueChange={(value) => this.onSexualOrientationChange(value)}
                        itemStyle={{backgroundColor:theme.DARK}}
                      >
                        <Picker.Item color={Platform.select({
                            ios: theme.generalLayout.textColor,
                            android:'black'
                          })}  style={{backgroundColor:theme.DARK}} label="Straight" value="straight"/>
                        <Picker.Item color={Platform.select({
                            ios: theme.generalLayout.textColor,
                            android:'black'
                          })}  label="Homosexual/Gay/Lesbian" value="homosexual"/>
                        <Picker.Item color={Platform.select({
                            ios: theme.generalLayout.textColor,
                            android:'black'
                          })}  label="Bi-sexual/Fluid" value="bi-sexual"/>
                        <Picker.Item color={Platform.select({
                            ios: theme.generalLayout.textColor,
                            android:'black'
                          })}  label="Other" value="other"/>
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
                                style={{backgroundColor: theme.generalLayout.backgroundColor, borderColor: theme.generalLayout.secondaryColor, marginHorizontal:2, marginVertical:2
                                }} 
                                bar={bar}
                                textStyle={{color: theme.generalLayout.textColor}}
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
                              style={{backgroundColor: theme.generalLayout.backgroundColor, borderColor: theme.generalLayout.secondaryColor, marginHorizontal:2
                              }} 
                              textStyle={{color: theme.generalLayout.textColor, fontFamily: theme.generalLayout.font}}>
                            You have no favorites!
                          </Chip>
                      }
                    </View> : null
                  }
                  <View style={localStyles.fieldCont}> 
                    <Text style={localStyles.fieldLabel}>
                      Bio: 
                    </Text>
                    <TextInput  theme={{colors:{text: theme.generalLayout.textColor}}}  numberOfLines={2}
                    mode={"flat"}
                    label=""
                    placeholder={"Tell us about yourself"}
                    onChangeText={text => this.onBioChange(text)}
                    value={this.state.bio  ? this.state.bio : ''}
                    style={{backgroundColor: theme.generalLayout.backgroundColor, color: theme.generalLayout.textColor, fontFamily: theme.generalLayout.font, width:"100%", alignSelf:"center", textAlign:"left", paddingHorizontal:10, paddingVertical:5, borderRadius: 5, borderColor: theme.generalLayout.secondaryColor, borderWidth:1}}>
                    </TextInput>
                  </View>

                  <View style={localStyles.fieldCont}>
                    <Text  style={localStyles.fieldLabel}>
                      Favorite Drinks (comma seperated): 
                    </Text>
                    {/* index one to on change */}
                    <TextInput  theme={{colors: { text: theme.generalLayout.textColor }}} 
                    mode={"flat"}
                    label=""
                    placeholder={"What're you drinkin'?"}
                    placeholderTextColor={{color: theme.generalLayout.textColor}}
                    onChangeText={text => this.onFavoriteDrinkChange(text)}
                    style={{backgroundColor: theme.generalLayout.backgroundColor, color: theme.generalLayout.textColor, fontFamily: theme.generalLayout.font, width:"100%", alignSelf:"center", borderRadius: 5, borderColor: theme.generalLayout.secondaryColor, borderWidth:1}}
                    value={this.state.favoriteDrinks ? this.state.favoriteDrinks.toString() : 'None'}
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
              <DrawerButton userPhoto={this.state.userData.photoSource} drawerButtonColor={theme.icons.color} onPress={this.props.onDrawerPress} /> 
            </View>
            :
        ///////////////////////////////////////////
            <View style={styles.viewDark}>
                <ActivityIndicator size="large" color={theme.loadingIcon.color}></ActivityIndicator>
                <DrawerButton userPhoto={this.state.userData.photoSource} drawerButtonColor={theme.icons.color} onPress={this.props.onDrawerPress} /> 
            </View> 
        
      );
    }
}

function mapStateToProps(state){
  return{
    user: state.userData,
    requests: state.friendRequests,
    friends: state.friendData,
    businessData: state.businessData,
  }
}

function mapDispatchToProps(dispatch){
  return {
    refresh: (userData) => dispatch({type:'REFRESH', data:userData})
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);


const localStyles = StyleSheet.create({
  dropdown:{
      ...Platform.select({
        ios: { backgroundColor: theme.generalLayout.backgroundColor, width:"100%", alignSelf:"center"},
        android:{backgroundColor:'white', width:"100%", alignSelf:"center"}
      })
  },
  fieldLabel:{ 
    fontSize: 18,
    color: theme.generalLayout.textColor,
    marginBottom:5,
    fontWeight:"bold",
    fontFamily: theme.generalLayout.font
  },
  surface: {
    width:"auto",
    elevation: 10,
    borderColor: theme.generalLayout.secondaryColor,
    borderWidth: 1,
    borderRadius: 3
  },
  fieldCont:{
    width: '100%',
    margin: '5%'
  },
  mainCont:{
    width:"95%",
    marginTop: '30%',
    marginBottom: '10%'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.generalLayout.backgroundColor,
    elevation:4
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
    backgroundColor: theme.generalLayout.backgroundColor,
    alignItems:"center",
    justifyContent:"space-evenly",
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
    maxHeight:"12%",
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
    borderBottomColor: theme.generalLayout.secondaryColor,
    borderBottomWidth: 1,
  },
  name: {
    fontSize: 18,
    color: theme.generalLayout.textColor,
    fontFamily: theme.generalLayout.font,
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
    color: theme.generalLayout.textColor,
    fontFamily: theme.generalLayout.font,
    justifyContent: 'center',
    alignItems: 'center'
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