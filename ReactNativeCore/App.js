import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import IconWithBadge from './Screens/Components/IconWithBadge';
import HomeScreen from './Screens/Components/Home Screen Components/HomeScreen';
import MapScreen from './Screens/Components/Home Screen Components/MapScreen';
import WhatsPoppinScreen from './Screens/Components/Home Screen Components/WhatsPoppinScreen';
import SettingsScreen from './Screens/SettingsTab';
import * as firebase from 'firebase';
import config from './Screens/Firebase/FirebaseConfig';

//Intialize Firebase Database
firebase.initializeApp(config);

function HomeIconWithBadge(props) {
  // Here we can pass in badge data to the home icon
  return <IconWithBadge {...props} badgeCount={3} />;
}

function MapIconWithBadge(props) {
  // Here we can pass in badge data to the map icon
  return <IconWithBadge {...props} badgeCount={1} />;
}

function BeerIconWithBadge(props) {
  // Here we can pass in badge data to the whatspoppin icon
  return <IconWithBadge {...props} badgeCount={1} />;
}

function GearIconWithBadge(props) {
  // Here we can pass in badge data to the whatspoppin icon
  return <IconWithBadge {...props} badgeCount={1} />;
}

const Tab = createBottomTabNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Tab.Navigator
       screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'My Feed') {
            return (
              <HomeIconWithBadge 
                name={
                  iconName = focused
                  ? 'ios-home'
                  : 'ios-home'
                }
                size={size}
                color={color}
              />
            )
          } 
          else if (route.name === 'Nerby') {
            return (
              <MapIconWithBadge 
                  name={
                    iconName = focused ? 'md-locate' : 'md-locate'
                  }
                  size={size}
                  color={color}
              />
            )
            
          }
          else if (route.name === "Whats Poppin'?") {
            return (
              <BeerIconWithBadge 
                  name={
                    iconName = focused ? 'ios-beer' : 'ios-beer' 
                  }
                  size={size}
                  color={color}
              />
            );
          }
          else if (route.name === "Settings") {
            < GearIconWithBadge 
              name={
                iconName = focused ? 'ios-menu' : 'ios-menu' 
              }
              size={size}
              color={color}
            />
          }
          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
      >
        <Tab.Screen name="Nerby" component={ MapScreen } />
        <Tab.Screen name="My Feed" component={ HomeScreen } />
        <Tab.Screen name="Whats Poppin'?" component={ WhatsPoppinScreen } />
        <Tab.Screen name="Settings" component={ SettingsScreen } />
      </Tab.Navigator>
    </NavigationContainer>
  );
}