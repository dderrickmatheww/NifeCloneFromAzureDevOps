import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeTab from './Screens/HomeTab';
import MapTab from './Screens/MapTab';
import WhatsPoppinTab from './Screens/WhatsPoppinTab';
import { styles } from './Styles/style';
import * as Location from 'expo-location';

function HomeScreen() {
  return (
    <View style={styles.viewDark}>
      <HomeTab />
    </View>
  );
}

function MapScreen() {
  
  return (
    <View style={styles.viewDark}>
      <MapTab />
    </View>
  );
}

function WhatsPoppinScreen() {
  return (
    <View style={styles.viewDark}>
      <WhatsPoppinTab />
    </View>
  );
}

function IconWithBadge({ name, badgeCount, color, size }) {
  return (
    <View style={{ width: 24, height: 24, margin: 5 }}>
      <Ionicons name={name} size={size} color={color} />
      {badgeCount > 0 && (
        <View
          style={{
            // On React Native < 0.57 overflow outside of parent will not work on Android, see https://git.io/fhLJ8
            position: 'absolute',
            right: -6,
            top: -3,
            backgroundColor: 'red',
            borderRadius: 6,
            width: 12,
            height: 12,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
            {badgeCount}
          </Text>
        </View>
      )}
    </View>
  );
}

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

const Tab = createBottomTabNavigator();

export default function App() {
  Location.requestPermissionsAsync()
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
          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
        style: styles.tabDark,
      }}
      >
        <Tab.Screen name="Nerby" component={ MapScreen } />
        <Tab.Screen name="My Feed" component={ HomeScreen } />
        <Tab.Screen name="Whats Poppin'?" component={ WhatsPoppinScreen } />
      </Tab.Navigator>
    </NavigationContainer>
  );
}