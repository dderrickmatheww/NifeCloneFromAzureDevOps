import React from 'react';
import {
    View,
    StyleSheet,
    Text
} from 'react-native';
import {
    Drawer,
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';
import theme from '../../../styles/theme';
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import * as Notifications from "expo-notifications";
import {UserInfoSection} from "./UserInfoSection";
import {styles} from "./style";


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});


export function DrawerContent(props) {
    return (
        <View style={{flex: 1}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <UserInfoSection
                        user={props.user}
                        onPress={() => props.uploadImage(() => null)}
                        uploading={props.uploading}
                        friends={props.friends}
                    />

                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem style={styles.text}
                                    icon={() => (
                                        <MaterialCommunityIcons
                                            name="home"
                                            color={theme.icons.color}
                                            size={20}
                                        />
                                    )}
                                    label={() => <Text style={styles.text}>Home</Text>}
                                    onPress={() => props.navigation.navigate('WhatsPoppin')}
                        />
                        <DrawerItem
                            icon={() => (
                                <Ionicons
                                    name="map-outline"
                                    color={theme.icons.color}
                                    size={20}
                                />
                            )}
                            label={() => <Text style={styles.text}>Map</Text>}
                            onPress={() => {
                                props.navigation.navigate('Map')
                            }}
                        />
                    </Drawer.Section>

                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem
                    icon={() => (
                        <MaterialCommunityIcons
                            name="exit-to-app"
                            color={theme.icons.color}
                            size={20}
                        />
                    )}
                    label={() => <Text style={styles.text}>Sign Out</Text>}
                    onPress={() => { }}
                />
            </Drawer.Section>
        </View>
    );
}

