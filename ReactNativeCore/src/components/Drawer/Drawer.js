import * as React from 'react';
import {View, Text} from 'react-native'
import {NavigationContainer} from "@react-navigation/native";
import {createDrawerNavigator} from "@react-navigation/drawer";
import {drawerContentOptions, drawerStyle, overlayColor} from "./style";
import Map from "../Map/Map";
import {connect} from "react-redux";

const Drawer = createDrawerNavigator();


const INITIAL_ROUTE = 'Map';
const DRAWER_TYPE = 'front';

class DrawerComponent extends React.Component {
 render() {
     return (
         <NavigationContainer>

             <Drawer.Navigator
                drawerContentOptions={drawerContentOptions}
                drawerStyle={drawerStyle}
                overlayColor={overlayColor}
                initialRouteName={INITIAL_ROUTE}
                drawerType={DRAWER_TYPE}
                drawerContent={props => (
                    <View style={{flex: 1, padding: 25}}>
                        <Text>DRAWER CONTENT BABY</Text>
                    </View>
                )}
             >
                 <Drawer.Screen
                     name="Map"
                     component={ Map }
                     // options={{ lazy: false }}
                     lazy={false}
                 />

             </Drawer.Navigator>
         </NavigationContainer>
     )
 }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(DrawerComponent);