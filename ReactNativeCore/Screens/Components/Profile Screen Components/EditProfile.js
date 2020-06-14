import React, { Component } from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator, StyleSheet, TextInput,ScrollView, Picker} from 'react-native';
import Util from '../../../scripts/Util';
import { styles } from '../../../Styles/style';
import DrawerButton from '../../Universal Components/DrawerButton';
import theme from '../../../Styles/theme';
import * as firebase from 'firebase';
import { Ionicons } from '@expo/vector-icons'; 
import DateTimePicker from '@react-native-community/datetimepicker';




export default class EditProfile extends Component {
  

  state = {
    userData:  null,
    dateOfBirth: null,
    maxDateValue: null,
    gender: 'other',
    sexualOrientation: 'other',
    bio:null,
    favoriteDrinks: [],
    showDatePicker: false,
  }

  setMaxDate = () => {
    var maxDateValue = new Date();
    maxDateValue.setFullYear( maxDateValue.getFullYear() - 18 );
    this.setState({maxDateValue:maxDateValue})
  }

  //Set user data
  setUserData = async (dataObj) => {
    
    Util.asyncStorage.GetAsyncVar('User', (user) => {
      user = JSON.parse(user);
      this.setState({userData: user});
      // console.log("User: " + JSON.stringify(this.state.userData));

      this.setState({dateOfBirth:  user.dateOfBirth ? new Date(user.dateOfBirth.seconds * 1000) : this.state.maxDateValue});
      

      this.setState({gender: user.gender ? JSON.stringify(user.gender) : "other"});
     

      this.setState({sexualOrientation: user.sexualOrientation ? JSON.stringify(user.sexualOrientation) : 'other'});
      

      this.setState({bio: user.bio ? JSON.stringify(user.bio) : ""});
      
      
      this.setState({favoriteDrinks: user.favoriteDrinks ? user.favoriteDrinks: []});
      
      console.log("sexualOrientation:" + this.state.sexualOrientation);
      console.log("dateOfBirth: " + this.state.dateOfBirth.toLocaleDateString('en-US'));
      console.log("gender: " + this.state.gender);
      console.log("bio: " + this.state.bio);
      console.log("favoriteDrinks: " + this.state.favoriteDrinks);
    });

      
  }

   //gets user and friend data
  getAsyncStorageData = (callback) => {
    this.setUserData();
  }
  componentDidMount(){
    this.setMaxDate();
    this.getAsyncStorageData();  
  }

  onDOBChange = (event, selectedDate) => {
    var date = new Date(selectedDate);
    this.setState({dateOfBirth: date});
    console.log("New DOB: " + this.state.dateOfBirth)
    this.setState({showDatePicker:false});
  }

  
  onGenderChange = (gender) => {
    console.log(gender);
    this.setState({gender:gender})
  }

  onSexualOrientationChange = (orientation) => {
    console.log(orientation);
    this.setState({sexualOrientation:orientation})
  }

  onBioChange = (bio) => {
    bio = bio.nativeEvent.text;
    console.log(bio);
    this.setState({bio:bio})
  }

  onFavoriteDrinkChange = (drinks) => {
    var fieldText = drinks.nativeEvent.text;
    fieldText = fieldText.toString();
    var drinkArr = [];
    if(fieldText.indexOf(',') == -1){

      drinkArr.push(fieldText);
    } else {
      drinkArr = fieldText.split(',');
    }

    console.log("result text: " + drinkArr);
    this.setState({favoriteDrinks:drinkArr});
  }

  onSave = () => {
    console.log('Saving attempted');
    var profileInfo = {
      dateOfBirth: new Date(this.state.dateOfBirth),
      gender: this.state.gender,
      sexualOrientation: this.state.sexualOrientation,
      bio: this.state.bio,
      favoriteDrinks: this.state.favoriteDrinks
    }
      console.log("sexualOrientation:" + this.state.sexualOrientation);
      console.log("dateOfBirth: " + this.state.dateOfBirth.toLocaleDateString('en-US'));
      console.log("gender: " + this.state.gender);
      console.log("bio: " + this.state.bio);
      console.log("favoriteDrinks: " + this.state.favoriteDrinks);

    Util.user.UpdateUser(firebase.firestore(), firebase.auth().currentUser.email, profileInfo
    , (data)=>{
        console.log('saving attempted');
    });

    var user = this.state.userData;

    var updatedUser = extend(user, profileInfo);
    updatedUser = JSON.stringify(updatedUser);
    Util.asyncStorage.SetAsyncStorageVar('User', updatedUser);
    this.getAsyncStorageData();

    this.props.navigation.navigate("Profile", {screen:"ProfileScreen"})

    function extend(dest, src) {
      for(var key in src) {
          dest[key] = src[key];
      }
      return dest;
    }
      
  }

   render () {
      return ( 
        ////////////////////////////////////////
          this.state.userData ?
            <View style={styles.loggedInContainer}>
              <View style={localStyles.HeaderCont}>
                  <View style={{flexDirection:"row"}}>
                    <Text style={localStyles.Header}>{this.state.userData.displayName}</Text>
                  </View>
              </View>

              <ScrollView contentContainerStyle={{justifyContent:"flex-start", width:"90%"}} style={localStyles.mainCont}> 
              {/* Input Area */}
                  <Text style={{ fontSize: 18, color: theme.LIGHT_PINK, marginBottom:15}}>
                    All information is optional and can be hidden via privacy settings! 
                  </Text>
                    
                    {/* DOB */}
                  <View style={localStyles.fieldCont}> 
                    <View style={{flexDirection:"row", width:"90%"}}>
                      <Text style={{ fontSize: 18, color: theme.LIGHT_PINK, marginBottom:5}}>
                        Date of Birth:  {this.state.dateOfBirth ? this.state.dateOfBirth.toLocaleDateString('en-US'): "None given."}
                        
                      </Text>
                      <TouchableOpacity style={{alignSelf: "flex-end", marginLeft:50, paddingBottom:5}}
                        onPress={() => this.setState({showDatePicker:true})}
                      >
                          <Ionicons name="md-calendar" size={24} color={theme.LIGHT_PINK} />
                      </TouchableOpacity>
                    </View>
                    
                    {
                      this.state.showDatePicker && (
                        <DateTimePicker
                          mode={"date"}
                          value={this.state.dateOfBirth}
                          maximumDate={this.state.maxDateValue}
                          display={"spinner"}
                          onChange={(event, selectedDate) => this.onDOBChange(event, selectedDate)}
                        />
                      )
                    }
                  </View>

                  <View style={localStyles.fieldCont}> 
                    <Text style={{ fontSize: 18, color: theme.LIGHT_PINK, marginBottom:5}}>
                      Gender: 
                    </Text>
                    <Picker 
                      style={{backgroundColor:theme.LIGHT,width:"90%", alignSelf:"center", borderRadius: 50,}}
                      selectedValue={this.state.gender ? this.state.gender : "other"}
                      onValueChange={(value) => this.onGenderChange(value)}
                    >
                      <Picker.Item label="Male" value="male"/>
                      <Picker.Item label="Female" value="female"/>
                      <Picker.Item label="Other" value="other"/>
                    </Picker>
                  </View>

                  <View style={localStyles.fieldCont}> 
                    <Text style={{ fontSize: 18, color: theme.LIGHT_PINK, marginBottom:5}}>
                      Sexual Orientation: 
                    </Text>
                    <Picker
                    selectedValue={this.state.sexualOrientation ? this.state.sexualOrientation : "other"}
                      style={{backgroundColor:theme.LIGHT,width:"90%", alignSelf:"center", borderRadius: 50,}}
                      onValueChange={(value) => this.onSexualOrientationChange(value)}
                    >
                      <Picker.Item label="Straight" value="straight"/>
                      <Picker.Item label="Homosexual/Gay/Lesbian" value="homosexual"/>
                      <Picker.Item label="Bi-sexual/Fluid" value="bi-sexual"/>
                      <Picker.Item label="Other" value="other"/>
                    </Picker>
                  </View>

                  <View style={localStyles.fieldCont}> 
                    <Text style={{ fontSize: 18, color: theme.LIGHT_PINK, marginBottom:5}}>
                      Bio: 
                    </Text>
                    <TextInput numberOfLines={5}
                    onEndEditing={(text)=> this.onBioChange(text)}
                    style={{backgroundColor:theme.LIGHT,width:"90%", alignSelf:"center", textAlign:"left", paddingHorizontal:10, paddingVertical:5, borderRadius: 5, alignItems:"flex-start", justifyContent:"flex-start"}}>

                    </TextInput>
                  </View>

                  <View style={localStyles.fieldCont}>
                    <Text style={{ fontSize: 18, color: theme.LIGHT_PINK, marginBottom:5}}>
                      Favorite Drinks (comma seperated): 
                    </Text>
                    {/* index one to on change */}
                    <TextInput
                    onEndEditing={(text)=> this.onFavoriteDrinkChange(text)}
                    style={{backgroundColor:theme.LIGHT,width:"90%", alignSelf:"center", borderRadius: 5,}}>

                    </TextInput>
                    
                  </View>
              </ScrollView>
              {/* buttons at the top */}
              <TouchableOpacity style={localStyles.SaveOverlay}
                onPress={()=> this.onSave()}
              >
                <Ionicons name="ios-checkmark-circle-outline" size={30} color={theme.LIGHT_PINK} />
                
              </TouchableOpacity>
              <DrawerButton drawerButtonColor="#eca6c4" onPress={this.props.onDrawerPress} /> 
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
    maxHeight:"15%",
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

