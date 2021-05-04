import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import {
  Surface,
  Paragraph,
  Searchbar,
  Avatar,
  Text
} from 'react-native-paper';
import Util from '../../scripts/Util';
import theme from '../../../Styles/theme';
const defPhoto = { uri: Util.basicUtil.defaultPhotoUrl };

export default class UserSearch extends Component {

  state = {
    queriedUsers:null,
    skip:0,
    take:50,
    searchText:null,
    isSearching: false,
    currentUserData:false,
    userData: this.props.currentUser
  }

  componentDidMount(){
    this.setState({ currentUserData: this.props.currentUser });
  }
  
  onChangeSearch = (query) => {
    this.setState({ searchText: query });
  }

  onUserQuery = (query) => {
    let queryText = query.nativeEvent.text;
    let wantedUsers = [];
    this.setState({isSearching:true});
    Util.user.QueryPublicUsers(queryText, this.state.take, (users) => {
      if(users.length > 0){
        users.forEach((user) => { wantedUsers.push(user) });
        this.setState({
          queriedUsers: wantedUsers,
          isSearching: false
        });
      }
      else{
        this.setState({
          queriedUsers: null,
          isSearching: false
        });
      }
      // Util.user.QueryPrivateUsers(firebase.firestore(), queryText,  this.state.take,(privUsers) =>{
      //   users.forEach((privUsers)=>{wantedUsers.push(privUsers)});
      //   this.setState({queriedUsers:wantedUsers});
      // });
    });
  }

   render () {
      return ( 
          <View style={localStyles.mainCont}>
            <Surface style={localStyles.navHeader}>
            <TouchableOpacity onPress={this.props.onDrawerPress} style={localStyles.drawerBtn}>
                <Avatar.Image 
                    source={this.state.userData && this.state.userData.photoSource !== 'Unknown' ? {
                        uri:  this.state.userData.photoSource  
                    } : defPhoto}
                    size={35}
                />
            </TouchableOpacity> 
            </Surface>
            <Surface style={localStyles.surface}>
                <View  style={localStyles.mainCont}>
                  <View style={localStyles.searchBarCont}>
                    <Searchbar
                      placeholder="Search by name or email..."
                      onChangeText={(query) => this.onChangeSearch(query)}
                      onEndEditing={(query) => this.onUserQuery(query)}
                      value={this.state.searchText}
                      inputStyle={{ color: theme.generalLayout.textColor}}
                      style={{color:theme.generalLayout.textColor, fontFamily: theme.generalLayout.font, backgroundColor:theme.generalLayout.backgroundColor, borderWitdth: 1, borderColor:theme.generalLayout.secondaryColor, borderRadius:25, alignSelf:"flex-start"}}
                      iconColor={theme.icons.color}
                    /> 
                  </View>
                  <ScrollView contentContainerStyle={{justifyContent:"flex-start", alignItems:"center", paddingTop:4, paddingHorizontal:4, paddingBottom:75}} style={localStyles.searchResultCont}>
                  {
                    this.state.queriedUsers ? 
                      this.state.queriedUsers.map((user, i) => (
                          <TouchableOpacity style={{paddingLeft:27}}  key={i} onPress={() => !user.isBusiness ? 
                            this.props.navigation.navigate('Profile', {screen:"OtherProfile", params:{user:user, isUsersProfile:false}}) :
                              this.props.navigation.navigate('Profile', {screen:"BusinessProfile", params:{user:user, currentUser:this.state.currentUserData}})
                            }>
                            <View style={localStyles.friendCont}>
                              <Image style={localStyles.friendPic} source={ user.providerData != null ? {uri:user.photoSource}  : defPhoto} />
                              <Text style={localStyles.name}>{user.displayName}</Text>
                            </View>
                          </TouchableOpacity>
                      )
                    )
                    : 
                    this.state.isSearching ?
                      <ActivityIndicator size="large" color={theme.loadingIcon.color}></ActivityIndicator> 
                    : 
                      <Paragraph style={localStyles.paragraph}>No Results...</Paragraph> 
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
    borderBottomColor: theme.generalLayout.secondaryColor,
    borderBottomWidth: 1,
    alignSelf:"center"
  },
  name: {
    fontSize: 18,
    color: theme.generalLayout.textColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: '.5%',
    marginLeft: '2.5%',
    width: "100%",
    fontFamily: theme.generalLayout.font
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
    height:"100%",
    width: "100%",
  },
  mainCont:{
    flex:1,
    backgroundColor: theme.generalLayout.backgroundColor,
    alignItems:"center",
    flexDirection:'column',
    justifyContent:"flex-start"
  },
  paragraph:{
    color: theme.generalLayout.textColor,
    fontSize:18,
    fontFamily: theme.generalLayout.font
  },
  surface:{
    alignSelf:"center",
    width: "95%",
    height:"100%",
    elevation: 10,
    backgroundColor: theme.generalLayout.backgroundColor,
  },
  DrawerOverlay: {
    alignSelf:"flex-start",
    opacity: 0.75,
    backgroundColor: theme.generalLayout.backgroundColor,
    borderRadius: 10,
    paddingVertical:0,
  },
  navHeader:{
    flexDirection:"row",
    marginTop:30,
    borderBottomColor: theme.generalLayout.secondaryColor,
    borderBottomWidth:1,
    width:"95%",
    backgroundColor: theme.generalLayout.backgroundColor,
  },
  drawerBtn: {
    marginTop: '5%',
    marginLeft: '1%',
    marginBottom: '3%',
    borderWidth: 1,
    borderColor: theme.generalLayout.secondaryColor,
    borderRadius: 70
  },
});

