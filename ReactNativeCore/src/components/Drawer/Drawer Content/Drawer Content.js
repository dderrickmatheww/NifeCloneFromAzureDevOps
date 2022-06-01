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
import {auth} from "../../../utils/firebase";
import IconWithBadge from "../../IconWithBadge/IconWithBadge";


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});


export function DrawerContent(props) {
    const requestsCount = props.friends ? props.friends.filter(friend => friend.isRequest).length : 0;
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
                        <DrawerItem style={styles.text}
                                    icon={() => (
                                        <IconWithBadge
                                            name={'ios-person'}
                                            color={theme.icons.color}
                                            size={20}
                                            type="Ionicons"
                                            isDrawer={true}
                                            badgeCount={requestsCount}
                                        />
                                    )}
                                    label={() => <Text style={styles.text}>Profile</Text>}
                                    onPress={() => props.navigation.navigate(
                                        'Profile',
                                        {
                                            screen:'UserProfile',
                                            params: {
                                                email: props.user.email,
                                                openDrawer: props.navigation.openDrawer,
                                                navigate: props.navigation.navigate
                                            }
                                        }
                                    )}
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
                    onPress={async () => {
                        props.refresh({userData: null})
                        await auth.signOut()
                    }}
                />
            </Drawer.Section>
        </View>
    );
}

