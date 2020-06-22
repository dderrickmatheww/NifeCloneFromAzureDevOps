import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import {
  Surface,
  Paragraph,
  Searchbar
} from 'react-native-paper';
import Util from '../../../scripts/Util';
import { styles } from '../../../Styles/style';
import theme from '../../../Styles/theme';
import { Ionicons } from '@expo/vector-icons'; 

export default class UserSearch extends Component {

  state = {
    queriedUsers:null,
    skip:0,
    take:50,
    searchText:null
  }

  componentDidMount(){

  }
  
  onChangeSearch = (query) => {
    this.setState({searchText:query});
    console.log(query);
  }

  onUserQuery = () => {
    let wantedUsers = [];
    Util.user.QueryPublicUsers(this.state.searchText, this.state.take, (users) =>{
      console.log("Public Users: \n" + JSON.stringify(users));
      users.forEach((user)=>{wantedUsers.push(user)});
      Util.user.QueryPrivateUsers(this.state.searchText, (privUsers) =>{
        console.log("Private Users: \n" + JSON.stringify(privUsers));
        users.forEach((privUsers)=>{wantedUsers.push(privUsers)});
        this.setState({queriedUsers:wantedUsers});
      });
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
                      onBlur={() => this.onUserQuery()}
                      value={this.state.searchText}
                      inputStyle={{color:theme.LIGHT_PINK, }}
                      style={{color:theme.LIGHT_PINK, backgroundColor:theme.DARK, borderWitdth: 1, borderColor:theme.LIGHT_PINK, borderRadius:25, alignSelf:"flex-start"}}
                      iconColor={theme.LIGHT_PINK}
                    /> 
                  </View>
                  <ScrollView contentContainerStyle={{justifyContent:"flex-start", alignItems:"center", paddingVertical:4, paddingHorizontal:4}} style={localStyles.searchResultCont}>
                  {
                    this.state.queriedUsers ? 

                    <Paragraph style={localStyles.paragraph}>Queried Users...</Paragraph>
                    :
                    <Paragraph style={localStyles.paragraph}>No Users...</Paragraph>
                  }
                  </ScrollView>
                </View>
                
            </Surface>

          </View>
      );
    }
}

const localStyles = StyleSheet.create({
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

