import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, ImageBackground, ActivityIndicator, StyleSheet } from 'react-native';
import {
  Title,
  Caption,
  Headline,
  Chip,
  Surface
} from 'react-native-paper';
import Util from '../../scripts/Util';
import { styles } from '../../../Styles/style';
import theme from '../../../Styles/theme';
import { Ionicons } from '@expo/vector-icons'; 
import StatusModal from './Status Modal';
import Favorite from '../Universal/Favorite'

export default class ProfileScreen extends Component {
  state = {
    isLoggedin: false,
    userData: this.props.user,
    modalVisible: false,
    friendData:null,
    isAddingFriend:false,
    areFriends: false,
    statusModalVisible: false,
    uploading: false,
    businessData: null,
    followerCount: 0,
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
    if(this.props.isUsersProfile){
      this.setState({ userData: this.props.user });
    }
    else {
      Util.user.GetUserData(this.props.user.email, (user) => {
        Util.user.CheckLoginStatus((boolean) => {
          this.setState({
            isLoggedin: boolean,
            userData: user
          });
        });
      });
    }
  }

  setFriendData = async () => {
    if (this.props.isUsersProfile) {
      this.setState({ friendData: this.props.friends });
    }
    else {
      Util.friends.GetFriends(this.props.user.email, (friends, userEmail) => {
        this.setState({ friendData: friends });
        friends.forEach((friend) => {
          if(friend.email == userEmail){
            this.setState({ areFriends: friend['friends'][this.props.user.email] == true });
          }
        });
      });  
    }
  }

   //gets user and friend data
   setProps = () => {
    this.setUserData();
    this.setFriendData();
  }

  onDismissStatus = () => {
    this.setState({ statusModalVisible: false });
  }

  getBusinessData = () => {
    if(this.state.userData.isBusiness){
      Util.business.GetBusinessByUID(this.state.userData.businessId, (data) => {
        this.setState({ businessData: data });
      });
      Util.business.GetFavoriteCount(this.state.userData.businessId, (count) => {
        this.setState({ followerCount: count });
      });
    }
  }

  componentDidMount(){
    this.setProps();
    this.getBusinessData();
  }

  favoriteABar = async (buisnessUID, boolean) => {
    let updatedUserData = this.props.currentUser;
    await Util.user.setFavorite(updatedUserData, buisnessUID, boolean, this.state.userData.displayName, (boolean, boolean2) => {
      if (!boolean2) {
        updatedUserData['favoritePlaces'][buisnessUID] = {
          favorited: boolean,
          name: this.state.userData.displayName
        };
        this.props.refresh(updatedUserData, null, null, null);
        this.setState({
          followerCount: boolean ? this.state.followerCount += 1 : this.state.followerCount > 0 ?  this.state.followerCount -=1 : 0
        });
      } 
      else {
        alert("You already have 10 favorites. Go to edit profile to remove some!");
      }
    });
  }

  UploadPic = () => {
    this.setState({uploading:true});
    this.props.uploadImage((uri)=>{
      let user = this.state.userData;
      user['photoSource'] = uri;
      this.setState({ userData: user });
    });
  }

   render () {
      return ( 
        ////////////////////////////////////////
          this.state.businessData ?
          <Surface style={styles.loggedInContainer}>
            <View style={localStyles.navHeader}>
              {/* Drawer Button */}
              <TouchableOpacity onPress={this.props.onDrawerPress} style={localStyles.DrawerOverlay}>
                  <Ionicons style={{paddingHorizontal:2, paddingVertical:0}} name="ios-menu" size={40} color={theme.icons.color}/>
              </TouchableOpacity> 
              {/* Add Friend */}
                {
                this.state.businessData.email == this.state.userData.email ? null: 
                <View style={{marginRight:15}}>
                  <Favorite
                    favoriteTrigg={(buisnessUID, bool) => this.favoriteABar(buisnessUID, bool)} user={this.props.currentUser} buisnessUID={this.state.userData.businessId} 
                  />
                </View>
                  
                }
              

              {/* Edit Button */}
              {this.state.userData.email == this.state.userData.email ? 
              <TouchableOpacity style={{
                position:"relative",
                left: this.state.businessData.email != this.state.userData.email ? 220 : 275,
                alignSelf:"flex-end",
                opacity: 0.75,
                backgroundColor: theme.generalLayout.backgroundColor,
                borderRadius: 10,
                marginBottom:5,
              }}
                onPress={() => this.props.navigation.navigate('Profile', {screen:'EditBusiness', params:{user: this.state.userData, business: this.state.businessData}})}
              >
                <Ionicons name="md-create" size={24} color={theme.icons.color} />
              </TouchableOpacity> : null
              }   
            </View>

            <ScrollView contentContainerStyle={localStyles.loggedInContainer}>
              
              <View style={localStyles.HeaderCont}>
                <View style={{flexDirection:"column", justifyContent:"center"}}>
                    <Headline style={localStyles.headerName}>{this.state.userData.displayName} </Headline>
                    <Title style={localStyles.headerAgeGender}> 
                      {"" + this.state.businessData.hours.open + " - " + this.state.businessData.hours.close}
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
                            <Ionicons size={25} color={theme.icons.color} name="ios-add-circle"></Ionicons>
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
                            <ActivityIndicator color={theme.loadingIcon.color} size={"large"}></ActivityIndicator>
                            :
                            <View style={{alignItems:"center"}}>
                                <Ionicons size={50} color={theme.icons.color} name="ios-person"></Ionicons>
                                <Caption style={{color:theme.icons.textColor, fontFamily: theme.generalLayout.font, textAlign:"center"}}>Click Me To Add Picture!</Caption>
                            </View>
                        }
                    </TouchableOpacity>
                }

                {/* <Caption  style={localStyles.FriendCount}>Casual Socialite | 420 Points</Caption> */}
                  
                  <View style={localStyles.LocAndFriends}>
                    <View style={{alignSelf:"flex-start", width:"50%"}}>
                      <Caption  style={localStyles.FriendCount}>{this.state.businessData ? this.state.businessData.address + ", " + this.state.businessData.city + ", " +  this.state.businessData.state  : null}</Caption>
                    </View>
                    
                      <Caption  style={localStyles.FriendCount}></Caption>
                    
                    <View style={{alignSelf:"flex-end", flexDirection:"row", justifyContent:"space-evenly", width:"50%"}}>
                      
                      <Caption style={localStyles.FriendCount}>{this.state.followerCount} Followers</Caption>
                      
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
                        this.props.isUsersProfile ?
                          <TouchableOpacity style={{backgroundColor: theme.generalLayout.backgroundColor, position:"relative",top:10, left:235, opacity:.75 }}
                            onPress={() => this.setState({statusModalVisible: true})}
                          >
                              <Ionicons name="ios-chatboxes" size={24} color={theme.icons.color} />
                          </TouchableOpacity> 
                        : 
                          null
                        }
                    </View>
                    <Caption style={localStyles.caption}>{this.state.userData.status ?  this.state.userData.status.text : "Lookin for what's poppin!"}</Caption>
                  </View>
                  
                  {/* fave drinks */}
                  <View style={localStyles.profRow}>
                    <Title style={localStyles.descTitle}>
                          Specials: 
                    </Title>
                    
                    <ScrollView horizontal={true} contentContainerStyle={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingBottom:10}}>
                    {
                        this.state.businessData.specials? 
                        this.state.businessData.specials.map((drink, i)=>(
                          
                            <Chip mode={"outlined"}  key={i}
                              style={{backgroundColor: theme.generalLayout.backgroundColor, borderColor: theme.generalLayout.secondaryColor, marginHorizontal:2
                            }} 
                            textStyle={{color:theme.generalLayout.textColor, fontFamily: theme.generalLayout.font}}>
                              {drink.special}
                            </Chip>
                          
                        ))
                        :
                        <Chip mode={"outlined"}  
                            style={{backgroundColor:theme.generalLayout.backgroundColor, borderColor: theme.generalLayout.secondaryColor, marginHorizontal:2
                            }} 
                            textStyle={{color:theme.generalLayout.textColor, fontFamily: theme.generalLayout.font}}>
                          None
                        </Chip>
                      }
                    </ScrollView>
                      
                    
                  </View>
                  {/* favorite bars */}
                  <View style={localStyles.profRow}>
                    <Title style={localStyles.descTitle}>
                      Events: 
                    </Title>
                    <ScrollView horizontal={true} contentContainerStyle={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingBottom:10}}>
                    {
                        this.state.businessData.events? 
                        this.state.businessData.events.map((drink, i)=>(
                          
                            <Chip mode={"outlined"}  key={i}
                            style={{backgroundColor:theme.generalLayout.backgroundColor, borderColor:theme.generalLayout.secondaryColor, marginHorizontal:2
                            }} 
                            textStyle={{color:theme.generalLayout.textColor, fontFamily: theme.generalLayout.font}}>
                              {drink.event}
                            </Chip>
                          
                        ))
                        :
                        <Chip mode={"outlined"}  
                            style={{backgroundColor:theme.generalLayout.backgroundColor, borderColor: theme.generalLayout.secondaryColor, marginHorizontal:2
                            }} 
                            textStyle={{color:theme.generalLayout.textColor, fontFamily: theme.generalLayout.font}}>
                          None
                        </Chip>
                      }
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
                    refresh={this.props.refresh()}
                  >
                  </StatusModal> :null
              }

            </ScrollView>
            </Surface>
            :
            <View style={styles.viewDark}>
                <ActivityIndicator size="large" color={theme.loadingIcon.color}></ActivityIndicator>
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
    borderColor: theme.generalLayout.secondaryColor,
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
    borderBottomColor: theme.generalLayout.secondaryColor,
    borderBottomWidth:1,
    width:"98%",
    justifyContent:"space-between"
  },
  EditOverlay: {
    position:"relative",
    left: 215,
    alignSelf:"flex-end",
    opacity: 0.75,
    backgroundColor: theme.generalLayout.backgroundColor,
    borderRadius: 10,
    marginBottom:5,
  },
  DrawerOverlay: {
    alignSelf:"flex-start",
    opacity: 0.75,
    backgroundColor: theme.generalLayout.backgroundColor,
    borderRadius: 10,
    paddingVertical:0,
  },

  AddFriendOverlay: {
    position:"relative",
    left: 195,
    alignSelf:"flex-end",
    opacity: 0.75,
    backgroundColor: theme.generalLayout.backgroundColor,
    borderRadius: 5,
    marginBottom:7.5,
    borderWidth:1,
    borderColor: theme.generalLayout.secondaryColor
  },
  profRow:{
    marginVertical: 10
  },
  descTitle:{
    fontSize: 18, 
    color: theme.generalLayout.textColor,
    fontFamily: theme.generalLayout.font
  },
  caption:{
    fontSize: 14, 
    color: theme.generalLayout.secondaryColor,
    fontFamily: theme.generalLayout.font,
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
    maxHeight:"30%",
    justifyContent:"flex-end",
    alignItems:"center",
    borderBottomColor: theme.generalLayout.secondaryColor,
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
    fontSize: 12,
    marginTop: "2%",
    marginBottom: "1%",
    color: theme.generalLayout.textColor,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: theme.generalLayout.font
  },
  headerName: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.generalLayout.textColor,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign:"center",
    marginTop:15,
    fontFamily: theme.generalLayout.font
  },
  headerAgeGender: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.generalLayout.textColor,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign:"center",
    marginTop:-10,
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
