import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import {
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    List
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';
import theme from '../../../Styles/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import Util from '../../../scripts/Util';
import { TouchableOpacity } from 'react-native-gesture-handler';

const defPhoto = require('../../../Media/Images/logoicon.png');

export function DrawerContent(props) {

    return(
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{flexDirection:'row',marginTop: 15}}>
                            
                            {
                                props.user.photoSource  ?
                                    <Avatar.Image 
                                        source={props.user.providerData ? {
                                            uri:  props.user.photoSource  
                                        }: defPhoto}
                                        size={100}
                                    />
                                    :
                                    <TouchableOpacity style={styles.NoAvatarButton}
                                        onPress={()=> props.uploadImage(()=>null)}
                                    >
                                        {
                                            props.uploading ?
                                            <ActivityIndicator color={theme.LIGHT_PINK} size={"large"}></ActivityIndicator>
                                            :
                                            <View style={{alignItems:"center"}}>
                                                <Ionicons size={50} color={theme.LIGHT_PINK} name="ios-person"></Ionicons>
                                                <Caption style={styles.caption}>Add Picture!</Caption>
                                            </View>
                                        }
                                    </TouchableOpacity>
                            }
                            
                            
                            
                            <View style={{marginLeft:15, flexDirection:'column'}}>
                                {/* display name */}
                                <Title style={styles.title}>
                                  {props.user.displayName}
                                </Title>
                                {/* status */}
                                <Caption style={styles.statuscaption}>
                                  Status: { props.user.status ? props.user.status.text ? props.user.status.text : "No Status" : "No Status"} 
                                </Caption>
                                {/* TODO Badge */}
                                {/* <Caption style={styles.caption}>
                                  { props.user.title ? props.user.title : "Casual Socialite"}
                                </Caption> */}
                            </View>
                            
                        </View>

                        <View style={styles.row}>
                            <View style={styles.section}>
                                <Paragraph style={[styles.paragraph, styles.caption]}>
                                  {props.friends ? props.friends.length : 0}
                                </Paragraph>
                                <Caption style={styles.caption}>{props.user.isBusiness ? "Followers" : "Drinking Buddies"}</Caption>
                            </View>
                            <View style={styles.section}>
                              
                                {/* <Paragraph style={[styles.paragraph, styles.caption]}>420</Paragraph>
                                <Caption style={styles.caption}>Points</Caption> */}
                            </View>
                            {!props.user.isBusiness ?
                                <View style={styles.section}>
                                    <TouchableOpacity 
                                        onPress={ () =>  props.navigation.navigate('Profile', {screen:'QRCode'})  }
                                        style={{zIndex:10, alignSelf:"flex-end",position:"relative", width:"auto", height:"auto"}}
                                    >
                                        <Avatar.Icon 
                                        size={30}
                                        icon="qrcode-scan"
                                        color={theme.LIGHT_PINK}
                                        style={{position: "relative",backgroundColor:theme.DARK, color:theme.LIGHT_PINK}}/>
                                    </TouchableOpacity>
                                </View> 
                            : null}
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
                            onPress={() => props.navigation.navigate('My Feed', {screen:"My Feed", params:{user: props.user, isUserProfile:true, friends:props.friends}})}
                        />
                            
                        
                        <DrawerItem 
                            icon={() => (
                                <MaterialCommunityIcons 
                                name="glass-mug" 
                                color={theme.LIGHT_PINK}
                                size={20}
                                />
                            )}
                            label={()=> <Text style={styles.text}>My Feed</Text>}
                            onPress={() => {props.navigation.navigate("My Feed", {screen:"Friend's Feed", params:{user: props.user, friends: props.friends, refresh: props.refresh}})}}
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
                            onPress={() => {props.navigation.navigate('Map', {params:{user: props.user, friends:props.friends, requests:props.requests, refresh: props.refresh}})}}
                        />
                       { !props.user.isBusiness ? 
                            <List.Accordion
                                titleStyle={{color:theme.LIGHT_PINK}}
                                
                                title="      You"
                                left={() => <MaterialCommunityIcons 
                                    name="account" 
                                    color={theme.LIGHT_PINK}
                                    size={20}
                                    style={{paddingLeft:10}}
                                    />}
                                theme={{colors:{text : theme.LIGHT_PINK}}}
                            >
                               <DrawerItem 
                                    icon={() => (
                                        <MaterialCommunityIcons 
                                        name="account-box-outline" 
                                        color={theme.LIGHT_PINK}
                                        size={20}
                                        />
                                    )}
                                    label={()=> <Text style={styles.text}>Profile</Text>}
                                    onPress={() => {
                                        props.navigation.navigate('Profile', {screen:"ProfileScreen", params:{user: props.user, friends:props.friends}})
                                        props.navigation.closeDrawer();    
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
                                        onPress={() => {props.navigation.navigate('Profile', {screen:'Friends', 
                                                        params:{user: props.user, friends:props.friends, requests:props.requests, refresh: props.refresh}
                                                    })
                                                }
                                            }
                                    /> 
                               
                                <DrawerItem 
                                        icon={() => (
                                            <Ionicons 
                                            name="md-search" 
                                            color={theme.LIGHT_PINK}
                                            size={20}
                                            />
                                        )}
                                        label={()=> <Text style={styles.text}>Find your friends or bars!</Text>}
                                        onPress={() => {props.navigation.navigate('Profile', {screen:'Search',  params:{currentUser: props.user}})}}
                                    />
                                
                              
                                <DrawerItem 
                                        icon={() => (
                                            <Ionicons 
                                            name="md-qr-scanner" 
                                            color={theme.LIGHT_PINK}
                                            size={20}
                                            />
                                        )}
                                        label={()=> <Text style={styles.text}>Scan Friends QR Code</Text>}
                                        onPress={() => {props.navigation.navigate('Profile', {screen:'ScanQR'})}}
                                    /> 
                            </List.Accordion> :
                                <DrawerItem 
                                    icon={() => (
                                        <MaterialCommunityIcons 
                                        name="account-box-outline" 
                                        color={theme.LIGHT_PINK}
                                        size={20}
                                        />
                                    )}
                                    label={()=> <Text style={styles.text}>Profile</Text>}
                                    onPress={() => {
                                        props.navigation.navigate('Profile', {screen:"ProfileScreen", params:{user: props.user, friends:props.friends}})
                                        props.navigation.closeDrawer();    
                                    }}
                                />
                            }
                        
                        <DrawerItem 
                            icon={() => (
                                <MaterialCommunityIcons 
                                name="settings" 
                                color={theme.LIGHT_PINK}
                                size={20}
                                />
                            )}
                            label={()=> <Text style={styles.text}>Settings</Text>}
                            onPress={() => {props.navigation.navigate('Settings', {params:{user: props.user, friends:props.friends, requests:props.requests, refresh: props.refresh}})}}
                        />
                        
                         {/* <DrawerItem 
                            icon={() => (
                                <MaterialCommunityIcons 
                                name="settings" 
                                color={theme.LIGHT_PINK}
                                size={20}
                                />
                            )}
                            label={()=> <Text style={styles.text}>Test</Text>}
                            onPress={() => {props.navigation.navigate('Test')}}
                        />  */}
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
                    onPress={() => {Util.dataCalls.Firebase.signOut()}}
                />
            </Drawer.Section>
        </View>
    );
}

const styles = StyleSheet.create({
    NoAvatarButton:{
        padding:10,
        borderRadius:10,
        borderWidth:1,
        borderColor:theme.LIGHT_PINK,
        justifyContent:'center',
        alignItems:"center"
    },
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
    statuscaption: {
        fontSize: 12,
        lineHeight: 14,
        color:theme.LIGHT_PINK,
        flexWrap:"wrap",
        overflow:"hidden"
      },
    caption: {
      fontSize: 12,
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