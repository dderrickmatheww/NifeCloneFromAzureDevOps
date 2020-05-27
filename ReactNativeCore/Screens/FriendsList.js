import React from 'react';
import * as firebase from 'firebase';
import { View, Text,  StyleSheet, Image, ScrollView, ActivityIndicator} from 'react-native';
import {styles} from '../Styles/style';
import DrawerButton from './Universal Components/DrawerButton';
import theme from '../Styles/theme';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {GetFriends} from '../Screens/Firebase/FriendsUtil'
import 'firebase/firestore';

var defPhoto = require('../Media/Images/logoicon.png')
class FriendsList extends React.Component  {
    state = {
        isLoggedin: firebase.auth().currentUser ? true : false,
        userData: firebase.auth().currentUser ? firebase.auth().currentUser : null,
        token: null,
        user: null,
        modalVisible: false,
        friends: null,
      }
      //Set login status
      setLoggedinStatus = async (dataObj) => {
        this.setState({ isLoggedin: dataObj ? true : false });
      }  
      //Set user data
      setUserData = async (dataObj) => {
        this.setState({ userData: dataObj});
        this.setState({ token: dataObj });
      }
      logout = () => {
        this.setState({ isLoggedin: false });
        this.setState({ userData: null });
        firebase.auth().signOut();
       }
       setFriends = async (friends) => {
         this.setState({friends: friends});
       }

    componentDidMount(){
        let data = {};
        let user = firebase.auth().currentUser;
        data['user'] = user;
        console.log(data.user)
        this.setUserData(data.user);
        this.setLoggedinStatus(data.user);
        GetFriends(firebase.firestore(),  this.state.userData.email, (data) =>{
          console.log(data)
          this.setFriends(data);
        });
    }

    render(){
        return(
          (this.state.friends != null && this.state.friends != undefined)?
            <View style={localStyles.loggedInContainer}>
                <View style={localStyles.HeaderCont}>
                  <Image style={localStyles.profilePic}source={{ uri: this.state.userData ? this.state.userData.providerData[0].photoURL : null }} />
                  <Text style={localStyles.Header}>{this.state.userData.displayName}'s Friends</Text>
                  <Text style={localStyles.FriendCount}>{(this.state.friends != null ? this.state.friends.length : "0")} Friends</Text>
                </View>
                <ScrollView style={localStyles.ScrollView}>
                  {this.state.friends.map((friend, i)=> (
                    <View style={localStyles.friendCont}>
                      <Image style={localStyles.friendPic} source={friend.providerData != null ? {uri: friend.providerData[0].photoURL} : defPhoto}/><Text style={localStyles.name} key={i}>{friend.displayName}</Text>
                    </View>
                  ))}
                </ScrollView>
                {/* <View style={localStyles.loggedInSubView}>
                  <TouchableOpacity onPress={() => SeedAddFriend(firebase.firestore())}>
                        <Text >GetFriends</Text>
                  </TouchableOpacity>
                </View> */}

               {/* keep this button at the bottom */}
                <DrawerButton drawerButtonColor="#eca6c4" onPress={this.props.onDrawerPress} /> 
            </View> 
              :
              <View style={localStyles.loggedInContainer}>
              <View style={localStyles.HeaderCont}>
                  <Image style={localStyles.profilePic}source={{ uri: this.state.userData ? this.state.userData.providerData[0].photoURL : null }} />
                  <Text style={localStyles.Header}>Your Friends</Text>
                  <Text style={localStyles.FriendCount}>Loading Friends...</Text>
                </View>
              <View style={localStyles.loggedInSubView}>
                <ActivityIndicator size="large" color="#eca6c4"></ActivityIndicator>
              </View> 
            {/* keep this button at the bottom */}
              <DrawerButton drawerButtonColor="#eca6c4" onPress={this.props.onDrawerPress} /> 
          </View>  
        )
    }
}

const localStyles = StyleSheet.create({
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

export default FriendsList;
