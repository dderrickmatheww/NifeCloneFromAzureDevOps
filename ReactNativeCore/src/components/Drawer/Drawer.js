import * as React from 'react';
import {View, Text} from 'react-native'
import {NavigationContainer} from "@react-navigation/native";
import {createDrawerNavigator} from "@react-navigation/drawer";
import {drawerContentOptions, drawerStyle, overlayColor} from "./style";
import Map from "../Map/Map";
import {connect} from "react-redux";
import WhatsPoppinNavigator from "../WhatsPoppin/Navigation/TabNavigator";
import {DrawerContent} from "./Drawer Content/Drawer Content";
import {updateUser} from "../../utils/api/users";
import ProfileNavigator from "../Profile/ProfileNavigator";
import QRCode from "../QRCode/QRCode";
import { navigationRef } from './RootNavigation';


const Drawer = createDrawerNavigator();


const INITIAL_ROUTE = 'Map';
const DRAWER_TYPE = 'front';

class DrawerComponent extends React.Component {

    render() {
     return (
         <NavigationContainer ref={navigationRef}>

             <Drawer.Navigator
                drawerContentOptions={drawerContentOptions}
                drawerStyle={drawerStyle}
                overlayColor={overlayColor}
                initialRouteName={INITIAL_ROUTE}
                drawerType={DRAWER_TYPE}
                drawerContent={props => (
                    <DrawerContent
                        {...props}
                        user={this.props.userData}
                        requests={this.props.userData.user_friends_user_friends_friendIdTousers}
                        friends={this.props.userData.user_friends.filter(friend => friend.isFriend)}
                        refresh={this.props.refresh}
                    />
                )}
             >
                 <Drawer.Screen
                     name="Map"
                     component={ Map }
                     // options={{ lazy: false }}
                     lazy={false}
                 />

                <Drawer.Screen
                     name="WhatsPoppin"
                     component={ WhatsPoppinNavigator }
                     // options={{ lazy: false }}
                     lazy={false}
                 />

                 <Drawer.Screen
                     name="Profile"
                     component={ ProfileNavigator }
                     // options={{ lazy: false }}
                     lazy={false}
                 />
                 <Drawer.Screen
                     name="QRCode"
                     component={ QRCode }
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

function mapDispatchToProps(dispatch) {
    return {
        refresh: ({ userData, feedData }) => dispatch({ 
            type:'REFRESH', 
            data: {
                userData,
                feedData 
            }
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerComponent);