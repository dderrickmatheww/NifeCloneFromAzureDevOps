import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WhatsPoppin from '../components/Whats Poppin/WhatsPoppinTab';
import HomeScreen from '../components/Home/HomeScreen';
import FriendsFeed from '../components/Whats Poppin/FriendsFeed';
import IconWithBadge from '../components/Universal/IconWithBadge';
import { connect } from "react-redux";
import theme from '../../Styles/theme';

const Tab = createBottomTabNavigator();

function HomeScreenTab ({route, navigation}) {
  const { uploadImage, favorites } = route.params;
  return (
    <HomeScreen uploadImage={uploadImage} favorites={favorites} onDrawerPress={() => navigation.openDrawer()} navigation={navigation} />
  )
}

function Friends ({route, navigation}) {
  return (
    <FriendsFeed navigation={navigation}  onDrawerPress={() => navigation.openDrawer()}/>
  )
}

function whatsPoppinScreenTab ({route, navigation}) {
  return (
    <WhatsPoppin onDrawerPress={() => navigation.openDrawer()} navigation={navigation} />
  )
}

class PoppinStack extends React.Component {

  state = {
    userData: null,
    friendData: null
  }

  componentDidMount(){
    this.setState({userData:this.props.user});
    this.setState({friendData:this.props.friends});
  }

  render() {
    return(
      this.state.userData ? 
      <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName, type;
              if (route.name === 'My Feed') {
                iconName = 'feed';
                type = 'FontAwesome';
              } 
              else if (route.name === "Friend's Feed") {
                iconName = 'user-friends';
                type = 'FontAwesome5';
              }
              else {
                iconName = 'ios-beer';
                type = 'Ionicons';
              }
              return <IconWithBadge name={iconName} badgeCount={0} size={size} color={color} type={type} />;
            }
          })}
          tabBarOptions={{
            activeTintColor: theme.icons.tabIcon.activeTintColor,
            inactiveTintColor:  theme.icons.color,
            labelStyle: {
              color: theme.icons.tabIcon.textColor,
              fontFamily: theme.generalLayout.font
            },
            style: {
              backgroundColor: 'transparent',
              borderWidth:0,
              elevation:0,
              borderBottomColor:'transparent',
              borderTopColor:'transparent',
              borderTopWidth: 0,
              position: 'absolute',
              color: theme.icons.tabIcon.textColor,
              fontFamily: theme.generalLayout.font,
              bottom: 20,
              height: 100
            }
          }}
          initialRouteName="My Feed"
          >
          <Tab.Screen name="My Feed" component={HomeScreenTab} initialParams={{ uploadImage: this.props.uploadImage, favorites: this.props.favorites }}/>
          {
            !this.props.user.isBusiness ? 
              <Tab.Screen name="Friend's Feed" component={Friends} /> 
            : 
              null
          }
          <Tab.Screen name="What's Poppin'" component={whatsPoppinScreenTab} />
        </Tab.Navigator> 
        :
        <View style={localStyles.viewDark}>
          <ActivityIndicator size="large" color={theme.loadingIcon.color}></ActivityIndicator>
        </View> 
    )
  }
};

const localStyles = StyleSheet.create({ 
  viewDark: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center' ,
    backgroundColor: theme.generalLayout.backgroundColor
  },
})

function mapStateToProps(state) {
  return {
    userData: state.userData,
    friendRequests: state.friendRequests,
    friendData: state.friendData,
    businessData: state.businessData
  }
}

function mapDispatchToProps(dispatch){
  return {
    refresh: (userData) => dispatch({type:'REFRESH', data:userData})
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(PoppinStack);