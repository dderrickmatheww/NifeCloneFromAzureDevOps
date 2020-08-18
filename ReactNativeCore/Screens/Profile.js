import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Image, ImageBackground, ActivityIndicator, StyleSheet } from 'react-native';
import {
  Title,
  Caption,
  Text,
  Headline,
  Chip,
  Surface
} from 'react-native-paper';
import Util from '../scripts/Util';
import { styles } from '../Styles/style';
import theme from '../Styles/theme';
import * as firebase from 'firebase';
import { Ionicons } from '@expo/vector-icons'; 
import StatusModal from './Components/Profile Screen Components/Status Modal';
import BusinessProfile from './BusinessProfile'
const defPhoto = require('../Media/Images/logoicon.png');
export default class ProfileScreen extends Component {
  state = {
    isLoggedin: firebase.auth().currentUser ? true : false,
    userData: this.props.user,
    modalVisible: false,
    friendData:this.props.friends,
    isUsersProfile: this.props.user.email == firebase.auth().currentUser.email,
    isAddingFriend:false,
    areFriends: false,
    statusModalVisible:false,
    uploading:false,
  }

  
  //Set login status
  setLoggedinStatus = async (dataObj) => {
    this.setState({ isLoggedin: dataObj.data ? true : false });
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

  //Set user data
  setUserData = async () => {
    if(this.state.isUsersProfile){
      this.setState({userData:this.props.user});
      // console.log(JSON.stringify(this.props.user));
      
    }
    else {
      Util.user.GetUserData(firebase.firestore(), this.props.user.email, (user)=>{
        this.setState({userData: user});
        
        // console.log(JSON.stringify(this.state.userData));
      });
    }
  }

  setFriendData = async (dataObj) => {
    if(this.state.isUsersProfile){
      this.setState({friendData: this.props.friends});
    }
    else{
      Util.friends.GetFriends(firebase.firestore(), this.props.user.email, (friends)=>{
        this.setState({friendData: friends});
        let userEmail = firebase.auth().currentUser.email
        friends.forEach((friend) => {
          if(friend.email == userEmail){
            console.log('friend: ' + friend);
            this.setState({areFriends: friend['friends'][this.props.user.email] == true});
            console.log('Are Friends : ' + this.state.areFriends)
          }
        });
        // console.log(JSON.stringify(this.state.friendData));
      });  
    }
    
  }
  
  addFriend = () => {
    this.setState({isAddingFriend:true});
    Util.friends.AddFriend(firebase.firestore(), firebase.auth().currentUser.email, this.state.userData.email, ()=>{
      this.setState({isAddingFriend:false}); 
      this.setState({areFriends:true});
    });
  }
  removeFriend = () => {
    this.setState({isAddingFriend:true});
    Util.friends.RemoveFriend(firebase.firestore(), firebase.auth().currentUser.email, this.state.userData.email, ()=>{
      this.setState({isAddingFriend:false}); 
      this.setState({areFriends:false});     
    });
  }

  logout = () => {
    this.setState({ isLoggedin: false });
    firebase.auth().signOut();
   }

   //gets user and friend data
  getAsyncStorageData = (callback) => {
    this.setState({isUsersProfile:this.props.isUserProfile});
    
    this.setUserData();
    this.setFriendData();
  }
  onDismissStatus = ()=> {
    this.setState({statusModalVisible:false});
}

  componentDidMount(){
    this.getAsyncStorageData();
    this.getBusinessData();
    console.log('User: ' + firebase.auth().currentUser.email); 
    console.log('Profile Owner: ' + this.state.userData.email);
  }

  getBusinessData = () => {
    if(this.state.userData.isBusiness){
      Util.business.GetBusinessData(firebase.firestore(), firebase.auth().currentUser.email, (data)=>{
        this.setState({businessData: data})
        console.log(JSON.stringify(data))
      })
    }
  }

  UploadPic = () => {
    this.setState({uploading:true});
    this.props.uploadImage((uri)=>{
      let user = this.state.userData;
      user['photoSource'] = uri;
      this.setState({userData: user});
    });
  }

   render () {
      return ( 
        ////////////////////////////////////////
          this.state.userData ? !this.state.userData.isBusiness ?
          <Surface style={styles.loggedInContainer}>
            <View style={localStyles.navHeader}>
              {/* Drawer Button */}
              <TouchableOpacity onPress={this.props.onDrawerPress} style={localStyles.DrawerOverlay}>
                  <Ionicons style={{paddingHorizontal:2, paddingVertical:0}} name="ios-menu" size={40} color={theme.LIGHT_PINK}/>
              </TouchableOpacity> 

              {/* Add Friend */}
              {!this.state.isUsersProfile ? !this.state.areFriends ? 
                <TouchableOpacity 
                onPress={() => this.addFriend()}
                style={localStyles.AddFriendOverlay}>
                  { 
                  this.state.isAddingFriend ?
                    <ActivityIndicator size="small" color={theme.LIGHT_PINK}></ActivityIndicator> :
                    <Text  style={{paddingHorizontal:3, fontSize: 12, color: theme.LIGHT_PINK}}>Add Friend</Text>
                  }
                </TouchableOpacity> :
                <TouchableOpacity 
                onPress={() => this.removeFriend()}
                style={localStyles.AddFriendOverlay}>
                  { 
                  this.state.isAddingFriend ?
                    <ActivityIndicator size="small" color={theme.LIGHT_PINK}></ActivityIndicator> :
                    <Text  style={{paddingHorizontal:3, fontSize: 12, color: theme.LIGHT_PINK}}>Remove Friend</Text>
                  }
                </TouchableOpacity> : null
              }

              {/* Edit Button */}
              {this.state.isUsersProfile ? 
              <TouchableOpacity style={{
                position:"relative",
                left: 285,
                alignSelf:"flex-end",
                opacity: 0.75,
                backgroundColor: theme.DARK,
                borderRadius: 10,
                marginBottom:5,
              }}
                onPress={() => this.props.navigation.navigate('Profile', {screen:'Edit', params:{user: this.state.userData}})}
              >
                <Ionicons name="md-create" size={24} color={theme.LIGHT_PINK} />
              </TouchableOpacity> : null
              }   
            </View>

            <ScrollView contentContainerStyle={localStyles.loggedInContainer}>
              
              <View style={localStyles.HeaderCont}>
                <View style={{flexDirection:"column", justifyContent:"center"}}>
                    <Headline style={localStyles.headerName}>{this.state.userData.displayName} </Headline>
                    <Title style={localStyles.headerAgeGender}> 
                      {this.genderUpperCase(this.state.userData.gender ? this.state.userData.gender : "other")}, {this.genderUpperCase(this.state.userData.sexualOrientation ? this.state.userData.sexualOrientation: "other")}  - {this.state.userData.dateOfBirth ? this.calculateAge(this.state.userData.dateOfBirth.seconds * 1000) : "No Age"}
                    </Title>
                </View>
                {
                  this.state.userData.photoSource ? 
                    <View>
                      <ImageBackground style={localStyles.profilePic} source={{ uri: this.state.userData.photoSource}}>
                        {
                          this.props.isUserProfile ? 
                          <TouchableOpacity style={{position:"relative", bottom:-125, right:-125}}
                            onPress={()=> {
                              this.UploadPic();
                            }}
                          >
                            <Ionicons size={25} color={theme.LIGHT_PINK} name="ios-add-circle"></Ionicons>
                          </TouchableOpacity> : null
                        }
                      </ImageBackground>
                    </View>
                    :
                    <TouchableOpacity style={localStyles.NoAvatarButton}
                        onPress={()=> {
                          this.UploadPic();
                        }}
                    >
                        {
                            this.state.uploading ?
                            <ActivityIndicator color={theme.LIGHT_PINK} size={"large"}></ActivityIndicator>
                            :
                            <View style={{alignItems:"center"}}>
                                <Ionicons size={50} color={theme.LIGHT_PINK} name="ios-person"></Ionicons>
                                <Caption style={{color:theme.LIGHT_PINK, textAlign:"center"}}>Click Me To Add Picture!</Caption>
                            </View>
                        }
                    </TouchableOpacity>
                }

                {/* <Caption  style={localStyles.FriendCount}>Casual Socialite | 420 Points</Caption> */}
                  
                  <View style={localStyles.LocAndFriends}>
                    <View style={{alignSelf:"flex-start", width:"50%"}}>
                      <Caption  style={localStyles.FriendCount}>{this.state.userData.loginLocation && this.state.userData.loginLocation.region? this.state.userData.loginLocation.region.city : "Margarittaville"}, {this.state.userData.loginLocation && this.state.userData.loginLocation.region ? this.state.userData.loginLocation.region.region : "Somewhere"}</Caption>
                    </View>
                    <View style={{alignSelf:"flex-end", flexDirection:"row", justifyContent:"space-evenly", width:"50%"}}>
                      <TouchableOpacity
                       disabled={this.state.isUsersProfile ? false : true}
                       onPress={() => this.props.navigation.navigate('Profile', {screen:'Friends', params:{user: this.state.userData, friends:this.state.friendData}})}>
                        <Caption style={localStyles.FriendCount}>{(this.state.friendData != null ? this.state.friendData.length : "0")} Friends</Caption>
                      </TouchableOpacity>
                    </View>
                  </View>
              </View>
              <View style={localStyles.mainCont}> 
              {/* status */}
                  <View style={localStyles.profRow}> 
                    <View style={{flexDirection:"row"}}>
                      <Title style={localStyles.descTitle}>
                          Status: 
                          
                        </Title>
                      {
                        this.state.isUsersProfile ?
                        <TouchableOpacity style={{backgroundColor:theme.DARK, position:"relative",top:10, left:235, opacity:.75 }}
                          onPress={() => this.setState({statusModalVisible:true})}
                        >
                            <Ionicons name="ios-chatboxes" size={24} color={theme.LIGHT_PINK} />
                        </TouchableOpacity> : null
                        }
                    </View>
                    <Caption style={localStyles.caption}>{this.state.userData.status ?  this.state.userData.status.text : "Lookin for what's poppin!"}</Caption>
                  </View>
                  {/* bio */}
                  <View style={localStyles.profRow}> 
                    <Title style={localStyles.descTitle}>
                      Bio: 
                    </Title>
                    <Caption  style={localStyles.caption}>{this.state.userData.bio ?  this.state.userData.bio : "None"}</Caption>
                  </View>
                  {/* fave drinks */}
                  <View style={localStyles.profRow}>
                    <Title style={localStyles.descTitle}>
                          Favorite Drinks: 
                    </Title>
                    
                    <ScrollView horizontal={true} contentContainerStyle={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingBottom:10}}>
                    {
                        this.state.userData.favoriteDrinks ? 
                        this.state.userData.favoriteDrinks.map((drink, i)=>(
                          
                            <Chip mode={"outlined"}  key={i}
                            style={{backgroundColor:theme.DARK, borderColor:theme.LIGHT_PINK, marginHorizontal:2
                            }} 
                            textStyle={{color:theme.LIGHT_PINK}}>
                              {drink}
                            </Chip>
                          
                        ))
                        :
                        <Chip mode={"outlined"}  
                            style={{backgroundColor:theme.DARK, borderColor:theme.LIGHT_PINK, marginHorizontal:2
                            }} 
                            textStyle={{color:theme.LIGHT_PINK}}>
                          None
                        </Chip>
                      }
                    </ScrollView>
                      
                    
                  </View>
                  {/* favorite bars */}
                  <View style={localStyles.profRow}>
                    <Title style={localStyles.descTitle}>
                      Favorite Bars: 
                    </Title>
                    <ScrollView horizontal={true} contentContainerStyle={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingBottom:10}}>
                      <Chip mode={"outlined"}  
                        style={{backgroundColor:theme.DARK, borderColor:theme.LIGHT_PINK, marginHorizontal:2
                        }} 
                        textStyle={{color:theme.LIGHT_PINK}}>
                        Cutty's
                      </Chip>
                      <Chip mode={"outlined"}  
                        style={{backgroundColor:theme.DARK, borderColor:theme.LIGHT_PINK, marginHorizontal:2
                        }} 
                        textStyle={{color:theme.LIGHT_PINK}}>
                        Big Gun
                      </Chip>
                      <Chip mode={"outlined"}  
                        style={{backgroundColor:theme.DARK, borderColor:theme.LIGHT_PINK, marginHorizontal:2
                        }} 
                        textStyle={{color:theme.LIGHT_PINK}}>
                        Ghost Monkey
                      </Chip>
                    </ScrollView>
                  </View>
                
              </View>
              {
                this.state.statusModalVisible ?
                <StatusModal
                    isVisible={this.state.statusModalVisible}
                    user={this.state.userData}
                    onDismiss={()=>this.onDismissStatus()}
                    refresh={this.props.refresh}
                    onSave={()=> this.onDismissStatus()}
                  >
                  </StatusModal> :null
              }

            </ScrollView>
            </Surface>
            : <BusinessProfile refresh={this.props.refresh} user={this.state.userData} friends={this.state.friendData} isUserProfile={this.state.isUsersProfile} navigation={this.props.navigation} onDrawerPress={this.props.onDrawerPress}></BusinessProfile> :
           
        ///////////////////////////////////////////
            <View style={styles.viewDark}>
                <ActivityIndicator size="large" color={theme.LIGHT_PINK}></ActivityIndicator>
            </View> 
        
      );
    }
}

const localStyles = StyleSheet.create({
  NoAvatarButton:{
    width: 150, 
    height: 150, 
    padding:10,
    borderRadius:10,
    borderWidth:1,
    borderColor:theme.LIGHT_PINK,
    justifyContent:'center',
    alignItems:"center"
},
  drinksChipCont:{
    flex:1,
    flexDirection:"row",
    alignItems:"flex-start"
  },
  navHeader:{
    marginTop:40,
    flexDirection:"row",
    borderBottomColor:theme.LIGHT_PINK,
    borderBottomWidth:1,
    width:"98%"
  },
  EditOverlay: {
    position:"relative",
    left: 215,
    alignSelf:"flex-end",
    opacity: 0.75,
    backgroundColor: theme.DARK,
    borderRadius: 10,
    marginBottom:5,
  },
  DrawerOverlay: {
    alignSelf:"flex-start",
    opacity: 0.75,
    backgroundColor: theme.DARK,
    borderRadius: 10,
    paddingVertical:0,
  },

  AddFriendOverlay: {
    position:"relative",
    left: 195,
    alignSelf:"flex-end",
    opacity: 0.75,
    backgroundColor: theme.DARK,
    borderRadius: 5,
    marginBottom:7.5,
    borderWidth:1,
    borderColor: theme.LIGHT_PINK
  },
  profRow:{
    marginVertical: 10
  },
  descTitle:{
    fontSize: 18, 
    color: theme.LIGHT_PINK
  },
  caption:{
    fontSize: 14, 
    color: theme.LIGHT_PINK,
    marginLeft: 15
  },
  mainCont:{
    width:"95%",
    flex:1,
    flexDirection:"column",
    alignItems:"stretch",
    justifyContent:"flex-start",
  },


  LocAndFriends:{
    flexDirection: "row",
    justifyContent:"space-between",
    alignItems:"stretch",
    width:"90%"
  },
  loggedInContainer:{
    paddingHorizontal:10,
    paddingBottom:25
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
    marginTop:90

  },
  profilePic: {
    width: 150, 
    height: 150, 
    borderRadius: 10,
    marginBottom: "2.5%"
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
    fontSize: 12,
    marginTop: "2%",
    marginBottom: "1%",
    color: theme.LIGHT_PINK,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerName: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.LIGHT_PINK,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign:"center"
  },
  headerAgeGender: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.LIGHT_PINK,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign:"center",
    marginTop:-10
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

