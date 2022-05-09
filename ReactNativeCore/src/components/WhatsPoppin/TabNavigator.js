import React from 'react';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import WhatsPoppin from '../components/Whats Poppin/WhatsPoppinTab';
import PostFeed from './PostFeed/PostFeed';
import IconWithBadge from '../IconWithBadge/IconWithBadge';
import theme from '../../styles/theme';
import { connect } from 'react-redux';

const Tab = createBottomTabNavigator();

class WhatsPoppinNavigator extends React.Component {
  
  state = {
  }

  render() {
    return(
      this.props.userData ? 
        <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color, size }) => {
                let iconName, type;
                if (route.name === 'My Feed') {
                  iconName = 'feed';
                  type = 'FontAwesome';
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
                backgroundColor: theme.generalLayout.backgroundColor,
                borderWidth:0,
                elevation:0,
                borderBottomColor:'transparent',
                borderTopColor:'transparent',
                borderTopWidth: 0,
                color: theme.icons.tabIcon.textColor,
                fontFamily: theme.generalLayout.font,
                bottom: 0,
                ...Platform.select({
                  ios: {
                    paddingBottom: 30,
                  },
                  android: {
                    paddingBottom: 20,
                  },
                }),
                height: 80
              }
            }}
            initialRouteName="My Feed"
          >
            <Tab.Screen name="My Feed" component={ PostFeed } initialParams={{ type: "My Feed" }} />
            {/**{!this.props.user.isBusiness ? <Tab.Screen name="Friend's Feed" component={Friends} initialParams={{user:this.props.user, friends:this.props.friends, refresh:this.props.refresh}}/> : null} */}
            <Tab.Screen name="What's Poppin'" component={ PostFeed } initialParams={{ type: "WhatsPoppin" }} />
          </Tab.Navigator> 
        :
        <View style={localStyles.viewDark}>
          <ActivityIndicator size="large" color={ theme.loadingIcon.color }></ActivityIndicator>
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
});

function mapStateToProps(state){
  return {
      ...state
  }
}

function mapDispatchToProps(dispatch){
  return {
      refresh: (userData, feedData) => dispatch({ type:'REFRESH', data: userData, feed: feedData }),
      yelpDataRefresh: (data) => dispatch({ type:'YELPDATA', data: data }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WhatsPoppinNavigator);