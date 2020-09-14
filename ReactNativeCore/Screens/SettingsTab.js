import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import Util from '../scripts/Util';
import theme from '../Styles/theme';
import { Ionicons } from '@expo/vector-icons'; 
import { styles } from '../Styles/style';
import * as firebase from 'firebase';
import{
  List,
  Switch
} from 'react-native-paper'

export default class SettingsTab extends Component {
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
  }
  //Set login status
  setLoggedinStatus = async (dataObj) => {
    this.setState({ isLoggedin: dataObj.data ? true : false });
  }  
  //Set user data
  setUserData = async (dataObj) => {
    this.setState({ userData: this.props.user,
     });
     if(this.props.user.privacySettings){
      this.setState({
        searchPrivacy: this.props.user.privacySettings.searchPrivacy ? this.props.user.privacySettings.searchPrivacy : false,
        checkInPrivacy:this.props.user.privacySettings.checkInPrivacy ? this.props.user.privacySettings.checkInPrivacy : false,
        favoritingPrivacy:this.props.user.privacySettings.favoritingPrivacy ? this.props.user.privacySettings.favoritingPrivacy : false,
        visitedPrivacy:this.props.user.privacySettings.visitedPrivacy ? this.props.user.privacySettings.visitedPrivacy : false,
        DOBPrivacy:this.props.user.privacySettings.DOBPrivacy ? this.props.user.privacySettings.DOBPrivacy : false,
        genderPrivacy:this.props.user.privacySettings.genderPrivacy ? this.props.user.privacySettings.genderPrivacy : false,
        orientationPrivacy:this.props.user.privacySettings.orientationPrivacy ? this.props.user.privacySettings.orientationPrivacy : false,
      })
     }
  }
  logout = () => {
    this.setState({ isLoggedin: false });
    firebase.auth().signOut();
   }

   componentDidMount(){
    this.setUserData()
   }

   handleSwitch(obj){
     if(obj.searchPrivacy){
       if(!this.state.searchPrivacy == true){
        alert("Users can no longer search for you. Friends will have to add you with a QR Code.")
       }
       let user = this.state.userData;
       user['privacySettings']["searchPrivacy"] = !this.state.searchPrivacy
       let updateObj = {
         privacySettings:{
           searchPrivacy: !this.state.searchPrivacy
         }
       }
       this.props.refresh(user);
       Util.user.UpdateUser(firebase.firestore(), user.email, updateObj, ()=>{
         console.log('searchPrivacy toggled on DB');
       });
      this.setState({searchPrivacy:!this.state.searchPrivacy})
    }
    if(obj.favoritingPrivacy){
      if(!this.state.favoritingPrivacy == true){
        alert("Users can no longer see your favorite places when they navigate to your profile. ")
      }
      let user = this.state.userData;
       user['privacySettings']["favoritingPrivacy"] = !this.state.favoritingPrivacy
       let updateObj = {
         privacySettings:{
          favoritingPrivacy: !this.state.favoritingPrivacy
         }
       }
       this.props.refresh(user);
       Util.user.UpdateUser(firebase.firestore(), user.email, updateObj, ()=>{
         console.log('favoritingPrivacy toggled on DB');
       });
      this.setState({favoritingPrivacy:!this.state.favoritingPrivacy})
    }

    if(obj.checkInPrivacy){
      if(!this.state.checkInPrivacy == true){
        alert("Users can no longer see where or when you have checked in on their maps and their feeds. ")
       }
       let user = this.state.userData;
       user['privacySettings']["checkInPrivacy"] = !this.state.checkInPrivacy
       let updateObj = {
         privacySettings:{
          checkInPrivacy: !this.state.checkInPrivacy
         }
       }
       this.props.refresh(user);
       Util.user.UpdateUser(firebase.firestore(), user.email, updateObj, ()=>{
         console.log('favoritingPrivacy toggled on DB');
       });
      this.setState({checkInPrivacy:!this.state.checkInPrivacy})
    }

    if(obj.visitedPrivacy){
      if(!this.state.visitedPrivacy == true){
        alert("Users can no longer see places you visited recently on their feeds.")
       }
       let user = this.state.userData;
       user['privacySettings']["visitedPrivacy"] = !this.state.visitedPrivacy
       let updateObj = {
         privacySettings:{
          visitedPrivacy: !this.state.visitedPrivacy
         }
       }
       this.props.refresh(user);
       Util.user.UpdateUser(firebase.firestore(), user.email, updateObj, ()=>{
         console.log('favoritingPrivacy toggled on DB');
       });
      this.setState({visitedPrivacy:!this.state.visitedPrivacy}) 
    }

    if(obj.orientationPrivacy){
      if(!this.state.orientationPrivacy == true){
        alert("Users can no longer see your sexual orientation on your profile.")
       }
       let user = this.state.userData;
       user['privacySettings']["orientationPrivacy"] = !this.state.orientationPrivacy
       let updateObj = {
         privacySettings:{
          orientationPrivacy: !this.state.orientationPrivacy
         }
       }
       this.props.refresh(user);
       Util.user.UpdateUser(firebase.firestore(), user.email, updateObj, ()=>{
         console.log('favoritingPrivacy toggled on DB');
       });
      this.setState({orientationPrivacy:!this.state.orientationPrivacy})
    }

    if(obj.DOBPrivacy){
      if(!this.state.DOBPrivacy == true){
        alert("Users can no longer see your age on your profile.")
       }
       let user = this.state.userData;
       user['privacySettings']["DOBPrivacy"] = !this.state.DOBPrivacy
       let updateObj = {
         privacySettings:{
          DOBPrivacy: !this.state.DOBPrivacy
         }
       }
       this.props.refresh(user);
       Util.user.UpdateUser(firebase.firestore(), user.email, updateObj, ()=>{
         console.log('favoritingPrivacy toggled on DB');
       });
      this.setState({DOBPrivacy:!this.state.DOBPrivacy})
    }

    if(obj.genderPrivacy){
      if(!this.state.genderPrivacy == true){
        alert("Users can no longer see your gender on your profile.")
       }
       let user = this.state.userData;
       user['privacySettings']["genderPrivacy"] = !this.state.genderPrivacy
       let updateObj = {
         privacySettings:{
          genderPrivacy: !this.state.genderPrivacy
         }
       }
       this.props.refresh(user);
       Util.user.UpdateUser(firebase.firestore(), user.email, updateObj, ()=>{
         console.log('favoritingPrivacy toggled on DB');
       });
      this.setState({genderPrivacy:!this.state.genderPrivacy})
    }
   }


   render () {
      return ( 
          this.state.userData ?

              
             <View style={localStyles.mainCont}>
               <View style={localStyles.navHeader}>
                  <TouchableOpacity onPress={this.props.onDrawerPress} style={localStyles.DrawerOverlay}>
                      <Ionicons style={{paddingHorizontal:2, paddingVertical:0}} name="ios-menu" size={40} color={theme.LIGHT_PINK}/>
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
               <View style={[localStyles.switchCont, {borderTopColor:theme.LIGHT_PINK, borderTopWidth:1}]}>
                  <Text style={localStyles.switchText}>Sign Out</Text>
                  <TouchableOpacity 
                  onPress={()=>Util.dataCalls.Firebase.signOut()}
                  style={{marginRight:20}}>
                    <Ionicons name="ios-log-out" size={24} color={theme.LIGHT_PINK}/>
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
    color:theme.LIGHT_PINK,
    paddingLeft:10,
    fontSize:14
  },
  switchCont:{
    flexDirection:"row",
    borderColor:theme.LIGHT_PINK,
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
    backgroundColor:theme.DARK
  },
  navHeader:{
    marginTop:25,
    flexDirection:"row",
    borderBottomColor:theme.LIGHT_PINK,
    borderBottomWidth:1,
    width:"100%",
    textAlign:"center"
  },
  DrawerOverlay: {
    alignSelf:"flex-start",
    opacity: 0.75,
    backgroundColor: theme.DARK,
    borderRadius: 10,
    paddingVertical:0,
    alignContent:"center",
    width:"10%"
  },
  headerText:{
    color:theme.LIGHT_PINK,
    alignSelf:"center",
    textAlign:"center",
    width:"80%",
    fontSize:25
  }
});
