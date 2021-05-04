import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MapScreen from '../components/Screens/MapScreen';


function MapComp({route, navigation}){
  const {user, friends, refresh, navigationMain} = route.params;
  return(
    <MapScreen refresh={refresh} user={user} friends={friends} onDrawerPress={() => navigation.openDrawer()} navigation={navigationMain}></MapScreen>

  );
}

const Stack = createStackNavigator();

class MapStack extends React.Component {
  render(){
    return (
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="Map" component={MapComp} initialParams={{ user:this.props.user, friends:this.props.friends, refresh:this.props.refresh, navigationMain: this.props.navigate }} options={{title: 'Map'}} />
      </Stack.Navigator>
    );
  }
  
};

export default MapStack;

