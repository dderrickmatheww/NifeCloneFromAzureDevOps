import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MapScreen from '../Screens/MapScreen';

function Map({route, navigation}){
  const {user, refresh, friends} = route.params;
  return(
    <MapScreen refresh={refresh} user={user} friends={friends} navigation={ navigation } onDrawerPress={() => navigation.openDrawer()}></MapScreen>
  );
}
const Stack = createStackNavigator();
export default class MapStack extends React.Component {
  render() {
    return (
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="Map" component={Map} initialParams={{ user: this.props.user, refresh: this.props.refresh, friends: this.props.friends }} options={{title: 'Map'}} />
      </Stack.Navigator>
    );
  }
};