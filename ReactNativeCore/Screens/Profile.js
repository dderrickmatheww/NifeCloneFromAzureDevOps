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
    userData: firebase.auth().currentUser ? firebase.auth().currentUser : null,
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
    if(this.state.isUsersProfile){
      Util.asyncStorage.GetAsyncVar('User', (userData) => {
        this.setState({userData: JSON.parse(userData)});
        console.log('User: ' + this.state.userData);
      });
    } else {
      this.setState({userData: this.state.userData});
    }

  }
  setFriendData = async (dataObj) => {
    Util.asyncStorage.GetAsyncVar('Friends', (friends) => {
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
    this.setUserData();
    this.setFriendData();
  }
  componentDidMount(){
    this.getAsyncStorageData();
  }

   render () {
      return ( 
        ////////////////////////////////////////
          this.state.userData ?
            <View style={styles.loggedInContainer}>
              <View style={localStyles.HeaderCont}>
                  <Image style={localStyles.profilePic}source={{ uri: this.state.userData ? this.state.userData.photoSouce : null }} />
                  <View style={{flexDirection:"row"}}>
                    <Text style={localStyles.Header}>{this.state.userData.displayName}</Text>
                    
                  </View>
                  
                  <View style={localStyles.LocAndFriends}>
                    <View style={{alignSelf:"flex-start", width:"50%"}}>
                      <Text  style={localStyles.FriendCount}>South Carolina</Text>
                    </View>
                    <View style={{alignSelf:"flex-end", flexDirection:"row", justifyContent:"space-evenly", width:"50%"}}>
                      <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', {screen:'Friends', params:{userData: this.state.userData, friendData:this.state.friendData}})}>
                        <Text style={localStyles.FriendCount}>{(this.state.friendData != null ? this.state.friendData.length : "0")} Friends</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
              </View>
              <View style={localStyles.mainCont}> 
              {/* bio */}
                  <View> 
                    <Text style={{ fontSize: 18, color: theme.LIGHT_PINK}}>
                      Bio: I like to drink beer, go to a bar drink more beer, and avoid peeing while dreaming. 
                    </Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 18, color: theme.LIGHT_PINK}}>
                        Favorite Drinks: Amber Ale, Fat Tire, Red Stripe, Gaelic Ale
                    </Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 18, color: theme.LIGHT_PINK}}>
                      Favorite Bars: Cutty's, Big Gun, Ghost Monkey, Frothy Beards
                    </Text>
                  </View>
                
              </View>
              <TouchableOpacity style={localStyles.EditOverlay}
                onPress={() => this.props.navigation.navigate('Profile', {screen:'Edit'})}
              >
                <Ionicons name="md-create" size={24} color={theme.LIGHT_PINK} />
              </TouchableOpacity>
              <TouchableOpacity style={localStyles.AddFriendOverlay}
                //  onPress={() => this.props.navigation.navigate('Profile', {screen:'Edit'})}
              >
                <Ionicons name="md-add-circle-outline" size={24} color={theme.LIGHT_PINK} />
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

