import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Util from '../../scripts/Util';
import theme from '../../../Styles/theme';
import { Ionicons } from '@expo/vector-icons';
import * as firebase from 'firebase';
import { 
  Avatar,
} from 'react-native-paper';
import{
  Switch
} from 'react-native-paper';
import {connect} from "react-redux";
const defPhoto = { uri: Util.basicUtil.defaultPhotoUrl };

class SettingsTab extends Component {
  state = {
    isLoggedin: firebase.auth().currentUser ? true : false,
    userData: null,
    modalVisible: false,    
    searchPrivacy:false,
    checkInPrivacy:false,
    favoritingPrivacy:false,
    visitedPrivacy:false,
    DOBPrivacy:false,
    genderPrivacy:false,
    orientationPrivacy:false,
    locationPrivacy:false,
  }
  //Set login status
  setLoggedinStatus = async (dataObj) => {
    this.setState({ isLoggedin: dataObj.data ? true : false });
  }  
  //Set user data
  setUserData = async () => {
    this.setState({ userData: this.props.user});
    if (this.props.user.privacySettings) {
      this.setState({
        searchPrivacy: this.props.user.privacySettings.searchPrivacy ? this.props.user.privacySettings.searchPrivacy : false,
        checkInPrivacy: this.props.user.privacySettings.checkInPrivacy ? this.props.user.privacySettings.checkInPrivacy : false,
        favoritingPrivacy: this.props.user.privacySettings.favoritingPrivacy ? this.props.user.privacySettings.favoritingPrivacy : false,
        visitedPrivacy: this.props.user.privacySettings.visitedPrivacy ? this.props.user.privacySettings.visitedPrivacy : false,
        DOBPrivacy: this.props.user.privacySettings.DOBPrivacy ? this.props.user.privacySettings.DOBPrivacy : false,
        genderPrivacy: this.props.user.privacySettings.genderPrivacy ? this.props.user.privacySettings.genderPrivacy : false,
        orientationPrivacy: this.props.user.privacySettings.orientationPrivacy ? this.props.user.privacySettings.orientationPrivacy : false,
      });
    }
  }
  logout = () => {
    this.setState({ isLoggedin: false });
    firebase.auth().signOut();
  }

  componentDidMount() {
    this.setUserData()
  }

   handleSwitch (obj) {
     if(obj.searchPrivacy){
       if(!this.state.searchPrivacy == true){
        Util.basicUtil.Alert('Search Privacy Update!', "Users can no longer search for you. Friends will have to add you with a QR Code.", null);
       }
       let user = this.state.userData;
       user['privacySettings']["searchPrivacy"] = !this.state.searchPrivacy
       let updateObj = {
         privacySettings:{
           searchPrivacy: !this.state.searchPrivacy
         }
       }
       this.props.refresh(user);
       Util.user.UpdateUser(user.email, updateObj);
      this.setState({searchPrivacy:!this.state.searchPrivacy})
    }
    if(obj.favoritingPrivacy){
      if(!this.state.favoritingPrivacy == true){
        Util.basicUtil.Alert('Favorite Places Privacy Update!', "Users can no longer see your favorite places when they navigate to your profile. ", null);
      }
      let user = this.state.userData;
       user['privacySettings']["favoritingPrivacy"] = !this.state.favoritingPrivacy
       let updateObj = {
         privacySettings:{
          favoritingPrivacy: !this.state.favoritingPrivacy
         }
       }
       this.props.refresh(user);
       Util.user.UpdateUser(user.email, updateObj);
      this.setState({favoritingPrivacy:!this.state.favoritingPrivacy})
    }

    if(obj.checkInPrivacy){
      if(!this.state.checkInPrivacy == true){
        Util.basicUtil.Alert('Check In Privacy Update!', "Users can no longer see where or when you have checked in on their maps and their feeds.", null);
       }
       let user = this.state.userData;
       user['privacySettings']["checkInPrivacy"] = !this.state.checkInPrivacy
       let updateObj = {
         privacySettings:{
          checkInPrivacy: !this.state.checkInPrivacy
         }
       }
       this.props.refresh(user);
       Util.user.UpdateUser(user.email, updateObj);
      this.setState({checkInPrivacy:!this.state.checkInPrivacy})
    }

    if(obj.visitedPrivacy){
      if(!this.state.visitedPrivacy == true){
        Util.basicUtil.Alert('Last Visited Privacy Update!', "Users can no longer see places you visited recently on their feeds.", null);
       }
       let user = this.state.userData;
       user['privacySettings']["visitedPrivacy"] = !this.state.visitedPrivacy
       let updateObj = {
         privacySettings:{
          visitedPrivacy: !this.state.visitedPrivacy
         }
       }
       this.props.refresh(user);
       Util.user.UpdateUser(user.email, updateObj);
      this.setState({visitedPrivacy:!this.state.visitedPrivacy}) 
    }

    if(obj.orientationPrivacy){
      if(!this.state.orientationPrivacy == true){
        Util.basicUtil.Alert('Sexual Orientation Privacy Update!', "Users can no longer see your sexual orientation on your profile.", null);
       }
       let user = this.state.userData;
       user['privacySettings']["orientationPrivacy"] = !this.state.orientationPrivacy
       let updateObj = {
         privacySettings:{
          orientationPrivacy: !this.state.orientationPrivacy
         }
       }
       this.props.refresh(user);
       Util.user.UpdateUser(user.email, updateObj);
      this.setState({orientationPrivacy:!this.state.orientationPrivacy})
    }

    if(obj.DOBPrivacy){
      if(!this.state.DOBPrivacy == true){
        Util.basicUtil.Alert('Age Privacy Update!', "Users can no longer see your age on your profile.", null);
       }
       let user = this.state.userData;
       user['privacySettings']["DOBPrivacy"] = !this.state.DOBPrivacy
       let updateObj = {
         privacySettings:{
          DOBPrivacy: !this.state.DOBPrivacy
         }
       }
       this.props.refresh(user);
       Util.user.UpdateUser(user.email, updateObj);
      this.setState({DOBPrivacy:!this.state.DOBPrivacy})
    }

    if(obj.genderPrivacy){
      if(!this.state.genderPrivacy == true){
        Util.basicUtil.Alert('Gender Privacy Update!', "Users can no longer see your gender on your profile.", null);
       }
       let user = this.state.userData;
       user['privacySettings']["genderPrivacy"] = !this.state.genderPrivacy
       let updateObj = {
         privacySettings:{
          genderPrivacy: !this.state.genderPrivacy
         }
       }
       this.props.refresh(user);
       Util.user.UpdateUser(user.email, updateObj);
      this.setState({genderPrivacy:!this.state.genderPrivacy})
    }
    if(obj.locationPrivacy){
      if(!this.state.locationPrivacy == true) {
        Util.basicUtil.Alert('Location Privacy Update!', "Users can no longer see your location on your profile.", null);
       }
       let user = this.state.userData;
       user['privacySettings']["locationPrivacy"] = !this.state.locationPrivacy
       let updateObj = {
         privacySettings:{
          locationPrivacy: !this.state.locationPrivacy
         }
       }
       this.props.refresh(user);
       Util.user.UpdateUser(user.email, updateObj);
      this.setState({locationPrivacy:!this.state.locationPrivacy})
    }
   }

   render () {
      return ( 
          this.state.userData ?
             <View style={localStyles.mainCont}>
               <View style={localStyles.navHeader}>
               <TouchableOpacity onPress={this.props.onDrawerPress} style={localStyles.drawerBtn}>
                    <Avatar.Image 
                        source={this.state.userData && this.state.userData.photoSource !== 'Unknown' ? {
                            uri:  this.state.userData.photoSource  
                        } : defPhoto}
                        size={35}
                    />
                </TouchableOpacity> 
                <Text style={localStyles.headerText}>Settings</Text>
               </View>
               <View style={localStyles.bodyCont}>
                  
                {/* 
                    /TODO
                    1. Feed privacy
                    2. search privacy
                    3. favorites privacy
                    4. General public/private setting
                */}
                <View style={localStyles.switchCont}>
                  <Text style={localStyles.switchText}>Do Not Allow Users To Search For Me</Text>
                  <Switch style={localStyles.switch} onValueChange={()=>this.handleSwitch({searchPrivacy:true})} value={this.state.searchPrivacy}></Switch>
                </View>

                <View style={localStyles.switchCont}>
                  <Text style={localStyles.switchText}>Do Not Allow Users To See Places I Favorite</Text>
                  <Switch style={localStyles.switch} onValueChange={()=>this.handleSwitch({favoritingPrivacy:true})} value={this.state.favoritingPrivacy}></Switch>
                </View>

                <View style={localStyles.switchCont}>
                  <Text style={localStyles.switchText}>Do Not Allow Friends To See My Check Ins</Text>
                  <Switch style={localStyles.switch} onValueChange={()=>this.handleSwitch({checkInPrivacy:true})} value={this.state.checkInPrivacy}></Switch>
                </View>
                
                <View style={localStyles.switchCont}>
                  <Text style={localStyles.switchText}>Do Not Allow Friends To See Places I Visited</Text>
                  <Switch style={localStyles.switch} onValueChange={()=>this.handleSwitch({visitedPrivacy:true})} value={this.state.visitedPrivacy}></Switch>
                </View>

                <View style={localStyles.switchCont}>
                  <Text style={localStyles.switchText}>Do Not Show Your Location On Your Profile</Text>
                  <Switch style={localStyles.switch} onValueChange={()=>this.handleSwitch({locationPrivacy:true})} value={this.state.locationPrivacy}></Switch>
                </View>

                <View style={localStyles.switchCont}>
                  <Text style={localStyles.switchText}>Do Not Show Date Of Birth On Your Profile</Text>
                  <Switch style={localStyles.switch} onValueChange={()=>this.handleSwitch({DOBPrivacy:true})} value={this.state.DOBPrivacy}></Switch>
                </View>

                <View style={localStyles.switchCont}>
                  <Text style={localStyles.switchText}>Do Not Show Sexual Orientation On Your Profile</Text>
                  <Switch style={localStyles.switch} onValueChange={()=>this.handleSwitch({orientationPrivacy:true})} value={this.state.orientationPrivacy}></Switch>
                </View>

                <View style={localStyles.switchCont}>
                  <Text style={localStyles.switchText}>Do Not Show Sexual Gender On Your Profile</Text>
                  <Switch style={localStyles.switch} onValueChange={()=>this.handleSwitch({genderPrivacy:true})} value={this.state.genderPrivacy}></Switch>
                </View>

                
                
               </View>
               <View style={[localStyles.switchCont, {borderTopColor: theme.generalLayout.secondaryColor, borderTopWidth:1}]}>
                  <Text style={localStyles.switchText}>Sign Out</Text>
                  <TouchableOpacity 
                  onPress={()=>Util.dataCalls.Firebase.signOut()}
                  style={{marginRight:20}}>
                    <Ionicons name="ios-log-out" size={24} color={theme.icons.color}/>
                  </TouchableOpacity>
                </View>
             </View>
             :
          null
        
      );
    }
}

const localStyles = StyleSheet.create({
  
  switchText:{
    alignSelf:"flex-start",
    color: theme.generalLayout.textColor,
    fontFamily: theme.generalLayout.font,
    paddingLeft:10,
    fontSize:12
  },
  switchCont:{
    flexDirection:"row",
    borderColor: theme.generalLayout.secondaryColor,
    borderBottomWidth:1,
    justifyContent:"space-between",
    paddingVertical:10
  },
  bodyCont:{
    flex:1,
    flexDirection:"column"
  },
  mainCont:{
    flex:1,
    flexDirection:"column",
    backgroundColor: theme.generalLayout.backgroundColor,
  },
  navHeader:{
    marginTop:10,
    flexDirection:"row",
    borderBottomColor: theme.generalLayout.secondaryColor,
    borderBottomWidth:1,
    width:"100%",
    textAlign:"center"
  },
  DrawerOverlay: {
    alignSelf:"flex-start",
    opacity: 0.75,
    backgroundColor: theme.generalLayout.backgroundColor,
    borderRadius: 10,
    paddingVertical:0,
    alignContent:"center",
    width:"10%"
  },
  headerText:{
    color: theme.generalLayout.textColor,
    fontFamily: theme.generalLayout.font,
    marginTop: '9%',
    marginLeft: '5%',
    fontSize: 25
  },
  drawerBtn: {
    marginTop: '8%',
    marginLeft: '3%',
    marginBottom: '3%',
    borderWidth: 1,
    borderColor: theme.generalLayout.secondaryColor,
    borderRadius: 70
},
});

function mapStateToProps(state){
    return{
        user: state.userData,
        friendRequests: state.friendRequests,
        friendData: state.friendData,
        businessData: state.businessData,
    }
}

function mapDispatchToProps(dispatch){
    return {
        refresh: (userData) => dispatch({type:'REFRESH', data:userData})
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(SettingsTab);
