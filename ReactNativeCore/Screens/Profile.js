import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, ActivityIndicator, StyleSheet, TouchableHighlightComponent } from 'react-native';
import Util from '../scripts/Util';
import { styles } from '../Styles/style';
import DrawerButton from './Universal Components/DrawerButton';
import theme from '../Styles/theme';
import * as firebase from 'firebase';
import { Ionicons } from '@expo/vector-icons'; 

export default class ProfileScreen extends Component {
  state = {
    isLoggedin: firebase.auth().currentUser ? true : false,
    userData: null,
    modalVisible: false,
    friendData:null,
    isUsersProfile:true,
  }

  
  //Set login status
  setLoggedinStatus = async (dataObj) => {
    this.setState({ isLoggedin: dataObj.data ? true : false });
  }  
  //Set user data
  setUserData = async (dataObj) => {
    
    Util.asyncStorage.GetAsyncStorageVar('User', (userData) => {
      this.setState({userData: JSON.parse(userData)});
      console.log('User: ' + JSON.stringify(this.state.userData));
    });
  }

  setFriendData = async (dataObj) => {
    Util.asyncStorage.GetAsyncStorageVar('Friends', (friends) => {
      this.setState({friendData: JSON.parse(friends)});
      // console.log('Friends: ' + this.state.friendData);
    });
  }
  logout = () => {
    this.setState({ isLoggedin: false });
    firebase.auth().signOut();
   }
   //gets user and friend data
  getAsyncStorageData = (callback) => {
    this.setState({userData:null})
    this.setUserData();
    this.setFriendData();
  }

  componentDidMount(){
    this.getAsyncStorageData();
    this.rerender = this.props.navigation.addListener('focus', () => {
      this.setUserData();
    });
  }

  componentWillUnmount() {
    this.rerender();
  }

   calculateAge = (birthday) => { // birthday is a date
    var bDay = new Date(birthday);
    var ageDifMs = Date.now() - bDay.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  genderUpperCase = (gender) => {
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  }

  

   render () {
      return ( 
        ////////////////////////////////////////
          this.state.userData ?
            <View style={styles.loggedInContainer}>
              <View style={localStyles.HeaderCont}>
                  <Image style={localStyles.profilePic}source={{ uri: this.state.userData ? this.state.userData.photoSouce : null }} />
                  <View style={{flexDirection:"row"}}>
                    <Text style={localStyles.Header}>{this.state.userData.displayName}, {this.genderUpperCase(this.state.userData.gender)} - {this.calculateAge(this.state.userData.dateOfBirth.seconds * 1000)}</Text>
                    
                  </View>
                  
                  <View style={localStyles.LocAndFriends}>
                    <View style={{alignSelf:"flex-start", width:"50%"}}>
                      <Text  style={localStyles.FriendCount}>{this.state.userData.loginLocation.region.city}, {this.state.userData.loginLocation.region.region}</Text>
                    </View>
                    <View style={{alignSelf:"flex-end", flexDirection:"row", justifyContent:"space-evenly", width:"50%"}}>
                      <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', {screen:'Friends'})}>
                        <Text style={localStyles.FriendCount}>{(this.state.friendData != null ? this.state.friendData.length : "0")} Friends</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
              </View>
              <View style={localStyles.mainCont}> 
              {/* bio */}
                  <View> 
                    <Text style={{ fontSize: 18, color: theme.LIGHT_PINK}}>
                      Bio: {this.state.userData.bio ?  this.state.userData.bio : "None"}
                    </Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 18, color: theme.LIGHT_PINK}}>
                          Favorite Drinks: {this.state.userData.favoriteDrinks ? this.state.userData.favoriteDrinks.toString() : "None"}
                    </Text>  
                  
                  </View>
                  <View>
                    <Text style={{ fontSize: 18, color: theme.LIGHT_PINK}}>
                      Favorite Bars: Cutty's, Big Gun, Ghost Monkey, Frothy Beards
                    </Text>
                  </View>
                
              </View>
              <TouchableOpacity style={localStyles.EditOverlay}
                onPress={() => this.props.navigation.navigate('Profile', {screen:'Edit', params:{user: this.state.userData}})}
              >
                <Ionicons name="md-create" size={24} color={theme.LIGHT_PINK} />
              </TouchableOpacity>
              <TouchableOpacity style={localStyles.AddFriendOverlay}
                //  onPress={() => this.props.navigation.navigate('Profile', {screen:'Edit'})}
              >
                <Text  style={{paddingHorizontal:3, fontSize: 12, color: theme.LIGHT_PINK}}>Add Friend</Text>
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
  mainCont:{
    width:"95%",
    flex:1,
    flexDirection:"column",
    alignItems:"stretch",
    justifyContent:"flex-start",
  },

  EditOverlay: {
    position: 'absolute',
    top:"6%",
    left: "92.5%",
    opacity: 0.75,
    backgroundColor: theme.DARK,
    borderRadius: 10,
    paddingVertical:0,
  },

  AddFriendOverlay: {
    position: 'absolute',
    top:"7%",
    left: "70%",
    opacity: 0.75,
    backgroundColor: theme.DARK,
    borderRadius: 5,
    paddingVertical:0,
    borderWidth:1,
    borderColor: theme.LIGHT_PINK
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
    maxHeight:"30%",
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
    fontSize: 13,
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

