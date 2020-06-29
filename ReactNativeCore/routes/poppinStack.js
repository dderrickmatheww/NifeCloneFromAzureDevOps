import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WhatsPoppin from '../Screens/WhatsPoppinTab';
import HomeScreen from '../Screens/HomeScreen';
import Profile from '../Screens/Profile';
import IconWithBadge from '../Screens/Universal Components/IconWithBadge';
import theme from '../Styles/theme';

const Tab = createBottomTabNavigator();

function HomeScreenTab ({navigation}) {
  return (
    <HomeScreen onDrawerPress={() => navigation.openDrawer()} navigation={navigation} />
  )
}

function profileScreenTab ({route, navigation}) {
  const { user, isUserProfile,  friends} = route.params;
  return (
    <Profile friends={friends}  user={user} isUserProfile={isUserProfile} onDrawerPress={() => navigation.openDrawer()} navigation={navigation} />
  )
}

function whatsPoppinScreenTab ({navigation}) {
  return (
    <WhatsPoppin onDrawerPress={() => navigation.openDrawer()} navigation={navigation} />
  )
}

export default poppinStack = () => {
  return (
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
      activeTintColor: theme.LIGHT_PINK,
      inactiveTintColor: theme.DARK_PINK,
      style: {
        backgroundColor: theme.DARK
      }
    }}
    >
    <Tab.Screen name="My Feed" component={HomeScreenTab}/>
    <Tab.Screen name="Friend's Feed" component={profileScreenTab}/>
    <Tab.Screen name="What's Poppin'" component={whatsPoppinScreenTab}/>
  </Tab.Navigator>
  );
};