import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MapScreen from '../components/Map/MapScreen';


function MapComp({route, navigation}){
  const {navigationMain} = route.params;
  return(
    <MapScreen  onDrawerPress={() => navigation.openDrawer()} navigation={navigationMain}></MapScreen>

  );
}

const Stack = createStackNavigator();

class MapStack extends React.Component {
  render(){
    return (
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="Map" component={MapComp} initialParams={{ navigationMain: this.props.navigate}} options={{title: 'Map'}} />
      </Stack.Navigator>
    );
  }
  
};

export default MapStack;

