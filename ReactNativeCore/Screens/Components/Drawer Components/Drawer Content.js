import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';
import theme from '../../../Styles/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 

const defPhoto = require('../../../Media/Images/logoicon.png');
export function DrawerContent(props) {

    return(
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{flexDirection:'row',marginTop: 15}}>
                            <Avatar.Image 
                                source={props.user.providerData ? {
                                     uri:  props.user.photoSource  
                                }: defPhoto}
                                size={50}
                            />
                            <View style={{marginLeft:15, flexDirection:'column'}}>
                                <Title style={styles.title}>
                                  {props.user.displayName}
                                </Title>
                                <Caption style={styles.caption}>
                                  { props.user.status ? props.user.status : "No Status"}
                                </Caption>
                                {/* TODO Badge */}
                                <Caption style={styles.caption}>
                                  { props.user.title ? props.user.title : "Casual Socialite"}
                                </Caption>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.section}>
                                <Paragraph style={[styles.paragraph, styles.caption]}>
                                  {props.friends ? props.friends.length : 0}
                                </Paragraph>
                                <Caption style={styles.caption}>Drinking Buddies</Caption>
                            </View>
                            <View style={styles.section}>
                              
                                <Paragraph style={[styles.paragraph, styles.caption]}>420</Paragraph>
                                <Caption style={styles.caption}>Points</Caption>
                            </View>
                        </View>
                    </View>

                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem style={styles.text}
                            icon={() => (
                                <MaterialCommunityIcons 
                                name="home" 
                                color={theme.LIGHT_PINK}
                                size={20}
                                />
                            )}
                            label={()=> <Text style={styles.text}>Home</Text>}
                            onPress={() => {props.navigation.navigate('Home')}}
                        />
                        <DrawerItem 
                            icon={() => (
                                <MaterialCommunityIcons 
                                name="account" 
                                color={theme.LIGHT_PINK}
                                size={20}
                                />
                            )}
                            label={()=> <Text style={styles.text}>Profile</Text>}
                            onPress={() => {
                                props.navigation.navigate('Profile', {screen:"ProfileScreen", params:{user: props.user, isUserProfile:true, friends:props.friends}})
                                props.navigation.closeDrawer()    
                            }}
                        />
                        <DrawerItem 
                            icon={() => (
                                <Ionicons 
                                name="ios-people" 
                                color={theme.LIGHT_PINK}
                                size={20}
                                />
                            )}
                            label={()=> <Text style={styles.text}>Friends</Text>}
                            onPress={() => {props.navigation.navigate('Profile', {screen:'Friends', params:{user: props.user, friends:props.friends}})}}
                        />
                        <DrawerItem 
                            icon={() => (
                                <MaterialCommunityIcons 
                                name="glass-mug" 
                                color={theme.LIGHT_PINK}
                                size={20}
                                />
                            )}
                            label={()=> <Text style={styles.text}>What's Poppin'?</Text>}
                            onPress={() => {props.navigation.navigate("What's Poppin'?")}}
                        />
                        <DrawerItem 
                            icon={() => (
                                <MaterialCommunityIcons 
                                name="map-outline" 
                                color={theme.LIGHT_PINK}
                                size={20}
                                />
                            )}
                            label={()=> <Text style={styles.text}>Map</Text>}
                            onPress={() => {props.navigation.navigate('Map')}}
                        />
                        <DrawerItem 
                            icon={() => (
                                <Ionicons 
                                name="md-search" 
                                color={theme.LIGHT_PINK}
                                size={20}
                                />
                            )}
                            label={()=> <Text style={styles.text}>Find your drinking buddies</Text>}
                            onPress={() => {props.navigation.navigate('Profile', {screen:'Search'})}}
                        />
                        <DrawerItem 
                            icon={() => (
                                <MaterialCommunityIcons 
                                name="settings" 
                                color={theme.LIGHT_PINK}
                                size={20}
                                />
                            )}
                            label={()=> <Text style={styles.text}>Settings</Text>}
                            onPress={() => {props.navigation.navigate('Settings')}}
                        />
                        <DrawerItem 
                            icon={() => (
                                <MaterialCommunityIcons 
                                name="settings" 
                                color={theme.LIGHT_PINK}
                                size={20}
                                />
                            )}
                            label={()=> <Text style={styles.text}>Test</Text>}
                            onPress={() => {props.navigation.navigate('Test')}}
                        />
                    </Drawer.Section>
                    {/* <Drawer.Section title="Preferences">
                        <TouchableRipple onPress={() => {toggleTheme()}}>
                            <View style={styles.preference}>
                                <Text>Dark Theme</Text>
                                <View pointerEvents="none">
                                    <Switch value={theme.DARK}/>
                                </View>
                            </View>
                        </TouchableRipple>
                    </Drawer.Section> */}
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem 
                    icon={() => (
                        <MaterialCommunityIcons 
                        name="exit-to-app" 
                        color={theme.LIGHT_PINK}
                        size={20}
                        />
                    )}
                    label={()=> <Text style={styles.text}>Sign Out</Text>}
                    onPress={() => {signOut()}}
                />
            </Drawer.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
    },
    userInfoSection: {
      paddingLeft: 20,
      borderBottomColor:theme.LIGHT_PINK,
      borderBottomWidth:1,
      paddingBottom:4
    },
    title: {
      fontSize: 16,
      marginTop: 3,
      fontWeight: 'bold',
      color: theme.LIGHT_PINK
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
      color:theme.LIGHT_PINK
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
      color: theme.LIGHT_PINK
    },
    text:{
      color:theme.LIGHT_PINK
    },
    drawerSection: {
      marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: theme.LIGHT_PINK,
        borderTopWidth: 1
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  });