 import React, {useEffect} from 'react';
import { 
    View, 
    StyleSheet, 
    ActivityIndicator, 
    Text 
} from 'react-native';
import {
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    List
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';
import theme from '../../../Styles/theme';
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import Util from '../../scripts/Util';
import { TouchableOpacity } from 'react-native-gesture-handler';
import IconWithBadge from "../Universal/IconWithBadge"
 import * as Notifications from "expo-notifications";
 import * as firebase from "firebase";
const defPhoto = { uri: Util.basicUtil.defaultPhotoUrl };

 Notifications.setNotificationHandler({
     handleNotification: async () => ({
         shouldShowAlert: true,
         shouldPlaySound: false,
         shouldSetBadge: false,
     }),
 });

export function DrawerContent(props) {

    useEffect(() => {
        console.log('useEffect hit')
        Notifications.addNotificationReceivedListener((notification) => {
            // console.log('Notification: ');
            console.log(notification);
            console.log('addNotificationReceivedListener hit')
        });
        Notifications.addNotificationResponseReceivedListener((response) => {
            console.log(response);
            console.log('addNotificationResponseReceivedListener hit');
            if(response.notification.request.content.data.isFriendRequest){
                Util.user.GetUserData(firebase.auth().currentUser.email, (user)=>{
                    props.refresh(user);
                    props.navigation.navigate('Profile', {screen:'Friends'})
                })

            }
        });
    })
    return(
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{flexDirection:'row',marginTop: 15}}>
                            
                            {
                                props.user.photoSource !== "Unknown"  ?
                                    <Avatar.Image 
                                        source={props.user.providerData ? {
                                            uri:  props.user.photoSource  
                                        } : defPhoto}
                                        size={100}
                                    />
                                    :
                                    <TouchableOpacity style={styles.NoAvatarButton}
                                        onPress={()=> props.uploadImage(() => null)}
                                    >
                                        {
                                            props.uploading ?
                                                <View style={{alignItems:"center", padding: '2%'}}>
                                                    <ActivityIndicator color={theme.loadingIcon.color} size={"large"}></ActivityIndicator>
                                                </View>
                                            :
                                                <View style={{alignItems:"center"}}>
                                                    <Avatar.Image 
                                                        source={defPhoto}
                                                        size={100}
                                                    />
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
                                        color={theme.icons.color}
                                        style={{position: "relative", backgroundColor: theme.generalLayout.backgroundColor}}/>
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
                                color={theme.icons.color}
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
                                color={theme.icons.color}
                                size={20}
                                />
                            )}
                            label={()=> <Text style={styles.text}>My Feed</Text>}
                            onPress={() => {props.navigation.navigate("My Feed", {screen:"Friend's Feed", params:{user: props.user, friends: props.friends, refresh: props.refresh}})}}
                        />
                        <DrawerItem
                            icon={() => (
                                <Ionicons
                                name="map-outline"
                                color={theme.icons.color}
                                size={20}
                                />
                            )}
                            label={()=> <Text style={styles.text}>Map</Text>}
                            onPress={() => {props.navigation.navigate('Map', {params:{user: props.user, friends:props.friends, requests:props.requests, refresh: props.refresh}})}}
                        />
                       { !props.user.isBusiness ? 
                            <List.Accordion
                                titleStyle={{color:theme.icons.textColor}}
                                
                                title="      You"
                                left={() => <IconWithBadge
                                    name={'ios-person'}
                                    color={theme.icons.color}
                                    size={20}
                                    type="Ionicons"
                                    isDrawer={true}
                                    badgeCount={props.requests ? props.requests.length : 0}
                                ></IconWithBadge>}
                                theme={{colors:{text: theme.icons.color}}}
                            >
                               <DrawerItem 
                                    icon={() => (
                                        <MaterialCommunityIcons 
                                        name="account-box-outline" 
                                        color={theme.icons.color}
                                        size={20}
                                        />
                                    )}
                                    label={()=> <Text style={styles.text}>Profile</Text>}
                                    onPress={() => {
                                        props.navigation.navigate('Profile', {screen:"ProfileScreen", params:{uploadImage:props.uploadImage, isUserProfile: true}})
                                        props.navigation.closeDrawer();    
                                    }}
                                />
                               
                                <DrawerItem 
                                        icon={() => (
                                            <IconWithBadge
                                                name={'ios-people'}
                                                color={theme.icons.color}
                                                size={20}
                                                type="Ionicons"
                                                badgeCount={props.requests ? props.requests.length : 0}
                                            ></IconWithBadge>
                                        )}
                                        label={()=> <Text style={styles.text}>Friends</Text>
                                        }
                                        onPress={() => {props.navigation.navigate('Profile', {screen:'Friends'})}
                                            }
                                    /> 
                               
                                <DrawerItem 
                                        icon={() => (
                                            <Ionicons 
                                            name="md-search" 
                                            color={theme.icons.color}
                                            size={20}
                                            />
                                        )}
                                        label={()=> <Text style={styles.text}>Find your friends or bars!</Text>}
                                        onPress={() => {props.navigation.navigate('Profile', {screen:'Search',  params:{currentUser: props.user}})}}
                                    />
                                
                              
                                <DrawerItem 
                                        icon={() => (
                                            <Ionicons 
                                            name="md-qr-code" 
                                            color={theme.icons.color}
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
                                        color={theme.icons.color}
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
                                <FontAwesome
                                name="gears"
                                color={theme.icons.color}
                                size={20}
                                />
                            )}
                            label={()=> <Text style={styles.text}>Settings</Text>}
                            onPress={() => {props.navigation.navigate('Settings')}}
                        />
                        
                         <DrawerItem
                            icon={() => (
                                <FontAwesome
                                name="gears"
                                color={theme.LIGHT_PINK}
                                size={20}
                                />
                            )}
                            label={()=> <Text style={styles.text}>Test</Text>}
                            onPress={() => {props.navigation.navigate('Test', {params:{user: props.user}})}}
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
                        color={theme.icons.color}
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
        justifyContent:'center',
        alignItems:"center"
    },
    drawerContent: {
      flex: 1,
    },
    userInfoSection: {
      paddingLeft: 20,
      borderBottomColor: theme.icons.color,
      borderBottomWidth: .5,
      paddingBottom: 10
    },
    title: {
      fontSize: 16,
      marginTop: 3,
      fontWeight: 'bold',
      lineHeight: 16,
      color: theme.generalLayout.textColor,
      flexWrap: "wrap",
        maxWidth: '80%',
        fontFamily: theme.generalLayout.font
    },
    statuscaption: {
        marginTop: 3,
        fontSize: 12,
        lineHeight: 14,
        color: theme.generalLayout.textColor,
        flexWrap: "wrap",
        maxWidth: '78%',
        fontFamily: theme.generalLayout.font
      },
    caption: {
      fontSize: 12,
      lineHeight: 14,
      color: theme.generalLayout.textColor,
      fontFamily: theme.generalLayout.font
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
      color: theme.generalLayout.textColor,
      fontFamily: theme.generalLayout.font
    },
    text: {
      color: theme.generalLayout.textColor,
      fontFamily: theme.generalLayout.font
    },
    drawerSection: {
      marginTop: 15,
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  });