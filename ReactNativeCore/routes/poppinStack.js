import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import {styles} from '../Styles/style';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WhatsPoppin from '../Screens/WhatsPoppinTab';
import HomeScreen from '../Screens/HomeScreen';
import FriendsFeed from '../Screens/Components/Whats Poppin Components/FriendsFeed';
import IconWithBadge from '../Screens/Universal Components/IconWithBadge';
import theme from '../Styles/theme';

const Tab = createBottomTabNavigator();

function HomeScreenTab ({route, navigation}) {
  const {uploadImage, user, friends, business,favorites ,refresh} = route.params;
  return (
    <HomeScreen uploadImage={uploadImage} favorites={favorites} business={business} refresh={refresh} user={user} friends={friends} onDrawerPress={() => navigation.openDrawer()} navigation={navigation} />
  )
}

function Friends ({route, navigation}) {
  const {user, friends, refresh} = route.params;
  return (
    <FriendsFeed refresh={refresh} user={user} friends={friends} navigation={navigation}  onDrawerPress={() => navigation.openDrawer()}/>
  )
}

function whatsPoppinScreenTab ({route, navigation}) {
  const {user, friends, business, refresh} = route.params;
  return (
    <WhatsPoppin business={business} refresh={refresh} user={user} friends={friends} onDrawerPress={() => navigation.openDrawer()} navigation={navigation} />
  )
}

class PoppinStack extends React.Component {

  state = {
    userData:null,
    friendData:null
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
            activeTintColor: theme.LIGHT_PINK,
            inactiveTintColor: theme.LIGHT_PINK_OPAC,
            style: {
              backgroundColor: theme.DARK
            }
          }}
          initialRouteName="My Feed"
          >
          <Tab.Screen name="My Feed" component={HomeScreenTab} initialParams={{uploadImage:this.props.uploadImage, user:this.props.user, friends:this.props.friends, refresh:this.props.refresh, business:this.props.business, favorites:this.props.favorites}}/>
          {!this.props.user.isBusiness ? <Tab.Screen name="Friend's Feed" component={Friends} initialParams={{user:this.props.user, friends:this.props.friends, refresh:this.props.refresh}}/> : null}
          <Tab.Screen name="What's Poppin'" component={whatsPoppinScreenTab} initialParams={{user:this.props.user, friends:this.props.friends, refresh:this.props.refresh, business:this.props.business}}/>
        </Tab.Navigator> 
        :
        <View style={styles.viewDark}>
          <ActivityIndicator size="large" color={theme.LIGHT_PINK}></ActivityIndicator>
        </View> 
    )
    
  
  }
};

export default PoppinStack;