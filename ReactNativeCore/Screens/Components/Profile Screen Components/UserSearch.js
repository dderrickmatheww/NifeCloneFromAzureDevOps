import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import {
  Surface,
  Paragraph,
  Searchbar,
  Text
} from 'react-native-paper';
import Util from '../../../scripts/Util';
import { styles } from '../../../Styles/style';
import theme from '../../../Styles/theme';
import { Ionicons } from '@expo/vector-icons'; 
import * as firebase from 'firebase';
var defPhoto = require('../../../Media/Images/logoicon.png')

export default class UserSearch extends Component {

  state = {
    queriedUsers:null,
    skip:0,
    take:50,
    searchText:null,
    isSearching: false,
  }

  componentDidMount(){

  }
  
  onChangeSearch = (query) => {
    this.setState({searchText:query});
    console.log(query);
  }

  onUserQuery = (query) => {
    let queryText = query.nativeEvent.text;
    let wantedUsers = []
    this.setState({isSearching:true});
    Util.user.QueryPublicUsers(firebase.firestore(), queryText, this.state.take, (users) =>{
      console.log("Public Users: \n" + JSON.stringify(users));
      users.forEach((user)=>{wantedUsers.push(user)});
      this.setState({queriedUsers:wantedUsers});
      this.setState({isSearching:true});
      // Util.user.QueryPrivateUsers(firebase.firestore(), queryText,  this.state.take,(privUsers) =>{
      //   console.log("Private Users: \n" + JSON.stringify(privUsers));
      //   users.forEach((privUsers)=>{wantedUsers.push(privUsers)});
      //   this.setState({queriedUsers:wantedUsers});
      // });
    });
  }

   render () {
      return ( 
          <View style={localStyles.mainCont}>
            <Surface style={localStyles.navHeader}>
              {/* Drawer Button */}
              <TouchableOpacity onPress={this.props.onDrawerPress} style={localStyles.DrawerOverlay}>
                  <Ionicons style={{paddingHorizontal:2, paddingVertical:0}} name="ios-menu" size={40} color={theme.LIGHT_PINK}/>
              </TouchableOpacity> 
            </Surface>
            <Surface style={localStyles.surface}>
                <View  style={localStyles.mainCont}>
                  <View style={localStyles.searchBarCont}>
                    <Searchbar
                      placeholder="Search for drinking buddies..."
                      onChangeText={(query) => this.onChangeSearch(query)}
                      onEndEditing={(query) => this.onUserQuery(query)}
                      value={this.state.searchText}
                      inputStyle={{color:theme.LIGHT_PINK, }}
                      style={{color:theme.LIGHT_PINK, backgroundColor:theme.DARK, borderWitdth: 1, borderColor:theme.LIGHT_PINK, borderRadius:25, alignSelf:"flex-start"}}
                      iconColor={theme.LIGHT_PINK}
                    /> 
                  </View>
                  <ScrollView contentContainerStyle={{justifyContent:"flex-start", alignItems:"center", paddingVertical:4, paddingHorizontal:4}} style={localStyles.searchResultCont}>
                  {
                    this.state.queriedUsers ? 

                    this.state.queriedUsers.map((user, i) => (
                      <TouchableOpacity  key={i} onPress={() => this.props.navigation.navigate('Profile', {screen:"ProfileScreen", params:{user:user, isUserProfile:false}})}>
                        <View style={localStyles.friendCont}>
                          <Image style={localStyles.friendPic} source={ user.providerData != null ? {uri:user.providerData.photoURL}  : defPhoto} /><Text style={localStyles.name}>{user.displayName}</Text>
                        </View>
                      </TouchableOpacity>
                      
                    ))
                    : this.state.isSearching ?
                    <ActivityIndicator size="large" color={theme.LIGHT_PINK}></ActivityIndicator> : <Paragraph style={localStyles.paragraph}>No Users...</Paragraph> 
                  }
                  </ScrollView>
                </View>
                
            </Surface>

          </View>
      );
    }
}

const localStyles = StyleSheet.create({
  friendPic: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  friendCont: {
    flexDirection: "row",
    borderBottomColor: theme.LIGHT_PINK,
    borderBottomWidth: 1,
  },
  name: {
    fontSize: 18,
    color: theme.LIGHT_PINK,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: '.5%',
    marginLeft: '2.5%',
    width: "100%"
  },
  searchBarCont:{
    flex:1,
    flexDirection:"column",
    justifyContent:"center",
    maxHeight:"10%",
    height:"10%",

  },
  searchResultCont:{
    flex:3,
    flexDirection:"column",
    borderWidth:1,
    borderColor:theme.LIGHT_PINK,
    height:"100%",
    width: "100%",
  },
  mainCont:{
    flex:1,
    backgroundColor: theme.DARK,
    alignItems:"center",
    flexDirection:'column',
    justifyContent:"flex-start"
  },
  paragraph:{
    color:theme.LIGHT_PINK,
    fontSize:18
  },
  surface:{
    alignSelf:"center",
    width: "95%",
    height:"100%",
    elevation: 10,
    backgroundColor: theme.DARK,
  },
  DrawerOverlay: {
    alignSelf:"flex-start",
    opacity: 0.75,
    backgroundColor: theme.DARK,
    borderRadius: 10,
    paddingVertical:0,
  },
  navHeader:{
    flexDirection:"row",
    marginTop:30,
    borderBottomColor:theme.LIGHT_PINK,
    borderBottomWidth:1,
    width:"95%",
    backgroundColor: theme.DARK,
  },
});

