import React from 'react';
import * as firebase from 'firebase';
import { View, Text,  StyleSheet, Image, ScrollView} from 'react-native';
import {styles} from '../Styles/style';
import DrawerButton from './Universal Components/DrawerButton';
import theme from '../Styles/theme';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {GetFriends} from '../Screens/Firebase/FriendsUtil'
import 'firebase/firestore';


class FriendsList extends React.Component  {
    state = {
        isLoggedin: firebase.auth().currentUser ? true : false,
        userData: firebase.auth().currentUser ? firebase.auth().currentUser : null,
        token: null,
        user: null,
        modalVisible: false,
        friends: [],
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
                <ScrollView >
                  {this.state.friends.map(friend => (
                    <Text>{friend}</Text>
                  ))}
                </ScrollView>
                <View style={localStyles.loggedInSubView}>
                  <TouchableOpacity>
                        <Text >GetFriends</Text>
                  </TouchableOpacity>
                </View>

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
                <Text style={localStyles.name}>Your Friends</Text>
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
    width: "95%",
    justifyContent:"flex-start",
    alignItems:"flex-start",
  },
  HeaderCont:{
    flex: 1, 
    backgroundColor: theme.DARK,
    width: "100%",
    maxHeight:"30%",
    justifyContent:"flex-end",
    alignItems:"center",
    borderBottomColor: theme.LIGHT_PINK,
    borderBottomWidth: 2
  },
  profilePic: {
    width: 75, 
    height: 75, 
    borderRadius: 50,
    marginBottom: "5%"
  },
  name: {
    fontSize: 15,
    color: theme.LIGHT_PINK,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical:'.5%',
    borderBottomColor:theme.LIGHT_PINK,
    borderBottomWidth: 1,
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
  
  });

export default FriendsList;
