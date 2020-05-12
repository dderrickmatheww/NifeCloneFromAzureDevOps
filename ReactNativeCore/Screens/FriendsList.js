import React from 'react';
import * as firebase from 'firebase';
import { View, Text,  StyleSheet, Image} from 'react-native';
import {styles} from '../Styles/style';
import DrawerButton from './Universal Components/DrawerButton';
import theme from '../Styles/theme';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {GetFriends} from './Firebase/FriendsUtil';
// import {GetRemoteUserData} from '../Screens/Firebase/UserUtil'
import 'firebase/firestore';


class FriendsList extends React.Component  {
    state = {
        isLoggedin: firebase.auth().currentUser ? true : false,
        userData: firebase.auth().currentUser ? firebase.auth().currentUser : null,
        token: null,
        user: null,
        modalVisible: false
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

    componentDidMount(){
        let data = {};
        let user = firebase.auth().currentUser;
        data['user'] = user;
        console.log(data.user)
        this.setUserData(data.user);
        this.setLoggedinStatus(data.user);
        
    }

    render(){
        return(
          this.state.userData ?
            <View style={localStyles.loggedInContainer}>
                

                <View style={localStyles.loggedInSubView}>
                  <Image style={localStyles.profilePic}source={{ uri: this.state.userData ? this.state.userData.providerData[0].photoURL : null }} />
                  <Text style={localStyles.name}>Welcome, {this.state.userData.name ? this.state.userData.name : this.state.userData.displayName}!</Text>
                </View>
                
                <View style={localStyles.loggedInSubView}>
                  <TouchableOpacity onPress={() => GetFriends(firebase.firestore(), this.state.userData.email, (data) =>{
                        console.log(data)
                    })}>
                        <Text style={localStyles.name}>GetFriends</Text>
                  </TouchableOpacity>
                </View>
                  
                
                
               {/* keep this button at the bottom */}
                <DrawerButton drawerButtonColor="#eca6c4" onPress={this.props.onDrawerPress} /> 
            </View> :
            <View style={localStyles.loggedInContainer}>
              <View>
                
                <Text style={localStyles.name}>Poop</Text>
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
    backgroundColor: theme.DARK
  },
  loggedInSubView:{
    flex: 1, 
    backgroundColor: theme.LIGHT,
    width: "95%",
  },
  profilePic: {
    width: 50, 
    height: 50, 
    borderRadius: 50,
    bottom: 105,
    left: 30
  },
  name: {
    fontSize: 12,
    marginBottom: 16,
    color: theme.LIGHT_PINK,
    justifyContent: 'center',
    alignItems: 'center'
  },
  
  });

export default FriendsList;
