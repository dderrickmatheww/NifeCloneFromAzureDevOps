import React from 'react';
import { View, SafeAreaView, RefreshControl, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity, Text } from 'react-native';
import theme from '../Styles/theme';
import { styles } from '../Styles/style';
import getFeedData from './Components/Whats Poppin Components/GetFeedData';
import DataRow from './Components/Whats Poppin Components/DataRow';
import * as firebase from 'firebase';
import PleaseLogin from './Universal Components/PleaseLogin';
import {
    Headline,
    Avatar
} from 'react-native-paper';
import Util from '../scripts/Util';
const defPhoto = { uri: Util.basicUtil.defaultPhotoUrl };

class WhatsPoppin extends React.Component  {

    state = {
        isLoggedIn: firebase.auth().currentUser ? true : false,
        user: firebase.auth().currentUser ? firebase.auth().currentUser : this.props.user,
        userData: this.props.user,
        query: null,
        feedData: null,
        DataRoWKey: 0,
        modalVisable: false,
        tweetData: null,
        refresh: false,
        DetailsTab:true,
        EventsTab: false,
        SpecialsTab: false,
        feedLoadDone:false,
    }

    async componentDidMount () {
        await this.grabFeedData();
    }

    rerender = this.props.navigation.addListener('focus', () => {
        this.componentDidMount();
    });

    componentWillUnmount() {
        this.rerender();
    }

    onChangeText = (text, type) => {
        this.setState({ query: text });  
    }

    OnSubmit = () => {
        this.componentDidMount();
    }

    onDataRowPress = (boolean) => {
        this.setState({ modalVisable: boolean });
    }

    grabFeedData = () => {
        if(this.state.isLoggedIn) {
            let query = this.state.query;
            let email = this.state.user.email;
            getFeedData(query, email, (dataObj) => {
                this.setState({ 
                    feedData: dataObj,
                    refresh: false,
                    isLoggedIn: firebase.auth().currentUser ? true : false,
                    user: this.props.user,
                    feedLoadDone:true
                });
            });
        }
    }

    favoriteABar = (buisnessUID, boolean, buisnessName) => {
        let email = this.state.user.email;
        let updatedUserData = this.props.user;
        Util.user.setFavorite(updatedUserData, buisnessUID, boolean, buisnessName, (boolean, boolean2) => {
            if(boolean2) {
                this.setState({navModal: true});
            }
            else {
                if(typeof updatedUserData['favoritePlaces'] !== 'undefined') {
                    updatedUserData['favoritePlaces'][buisnessUID] = {
                      favorited: boolean,
                      name: buisnessName
                    };
                    this.props.refresh(updatedUserData, null, null, null);
                }
            }
        });
    }

    onRefresh = () => {
        this.setState({ refresh: true });
        this.grabFeedData();
    }

    toggleTab = (tabstate) => {
        if(tabstate.details){
          if(!this.state.DetailsTab)
          {
            this.setState({DetailsTab: true});
          }
          if(this.state.EventsTab){
            this.setState({EventsTab: false});
          }
          if(this.state.SpecialsTab){
            this.setState({SpecialsTab: false});
          }
        }
        if(tabstate.events){
          if(!this.state.EventsTab)
          {
            this.setState({EventsTab: true});
          }
          if(this.state.DetailsTab){
            this.setState({DetailsTab: false});
          }
          if(this.state.SpecialsTab){
            this.setState({SpecialsTab: false});
          }
        }
        if(tabstate.specials){
          if(!this.state.SpecialsTab)
          {
            this.setState({SpecialsTab: true});
          }
          if(this.state.EventsTab){
            this.setState({EventsTab: false});
          }
          if(this.state.DetailsTab){
            this.setState({DetailsTab: false});
          }
        }
      }

    render() {
        return (
            this.state.isLoggedIn ? 
                <SafeAreaView style={localStyles.safeAreaContainer}>
                    <View style={localStyles.navHeader}>
                        <TouchableOpacity onPress={this.props.onDrawerPress} style={localStyles.drawerBtn}>
                            <Avatar.Image 
                                source={this.state.userData && this.state.userData.photoSource !== 'Unknown' ? {
                                    uri:  this.state.userData.photoSource  
                                } : defPhoto}
                                size={35}
                            />
                        </TouchableOpacity> 
                        <View style={{width:"100%"}}>
                            <Headline style={{ color: theme.TEXT_COLOR, marginLeft: '5%', marginBottom: '2%'}}>What's Poppin'</Headline>
                        </View>
                    </View>
                    {/* <InputWithIcon styles={styles.searchBar} name={'ios-mail'} color={'black'} size={12} placeHolderText={'Search...'} returnKey={'search'} secureText={false} onChangeText={(text, type) => this.onChangeText(text, type)} type={'name'} keyboardType={'default'} value={this.state.query} onSubmit={(text, eventCount, target) => this.OnSubmit(text, eventCount, target)}/> */}
                    {this.state.feedData ?
                    this.state.feedData.countData && this.state.feedData.countData.length > 0 ?
                    <ScrollView 
                        style={localStyles.dataRowScrollView}
                        refreshControl={
                            <RefreshControl 
                                refreshing={this.state.refresh} 
                                onRefresh={this.onRefresh}  
                                size={22}
                                color={[theme.GOLD]}
                                tintColor={theme.GOLD}
                                title={'Loading...'}
                                titleColor={theme.GOLD}
                            />
                        }
                    >
                        
                        {
                            this.state.feedData.countData.map(data => (
                                <DataRow 
                                    key={ data.buisnessUID }
                                    buisnessUID={ data.buisnessUID }
                                    phone={ data.buisnessData.phone }
                                    name={ data.buisnessData.name }
                                    barImage={ data.buisnessData.barPhoto }
                                    address={ data.buisnessData.address ? data.buisnessData.address.split(',') : null }
                                    lat={ data.buisnessData.latAndLong.split(',')[0] ? data.buisnessData.latAndLong.split(',')[0] :  null }
                                    long={ data.buisnessData.latAndLong.split(',')[1] ? data.buisnessData.latAndLong.split(',')[1] : null }
                                    modalVisability={ this.state.modalVisable }
                                    userData={ data.users }
                                    user={ this.state.user }
                                    usersCheckedIn={ data.checkedIn }
                                    email={this.state.user.email}
                                    favoriteABar={(buisnessUID, boolean, buisnessName) => {this.favoriteABar(buisnessUID, boolean, buisnessName)}}
                                />
                            ))
                        }
                        <View style={{ height: 120 }} />
                    </ScrollView> 
                    :
                    <View style={localStyles.viewDark}>
                        <ScrollView 
                            style={localStyles.safeAreaContainer} 
                            refreshControl={
                                <RefreshControl 
                                    refreshing={this.state.refresh} 
                                    onRefresh={this.onRefresh}  
                                    size={22}
                                    color={[theme.GOLD]}
                                    tintColor={theme.GOLD}
                                    title={'Loading...'}
                                    titleColor={theme.GOLD}
                                />
                            }
                        >
                            <Text style={localStyles.emptyPoppinFeed}>
                                Nothing seems to be happening yet! {"\n"}
                                {"\n"}
                                Once users start checking in, the resturants that your friends check into will populate here! {"\n"}
                                {"\n"}
                                Tell your friends about Nife and start checking in!
                            </Text>
                        </ScrollView>
                    </View>
                     : 
                     <View style={localStyles.viewDark}>
                         <ActivityIndicator 
                             size={'large'}
                             color={theme.loadingIcon.color}
                         />
                     </View>
                    }
                </SafeAreaView>
            : 
            <PleaseLogin 
                navigation={this.props.navigation}
                appName={`What's poppin' feed`}
            />
        )
    }
}
const localStyles = StyleSheet.create({ 
    navHeader: {
        marginTop: 12.5,
        flexDirection:"row",
        borderBottomColor: theme.LIGHT_PINK,
        borderBottomWidth:1,
        width:"98%",
        textAlign:"center",
        alignItems:"center",
    },
    emptyPoppinFeed: {
        color: theme.TEXT_COLOR, 
        fontSize: 16,
        padding: 20,
        textAlign: "center",
        justifyContent: "center"
    },
    DrawerOverlay: {
        alignSelf:"flex-start",
        opacity: 0.75,
        backgroundColor: theme.DARK,
        borderRadius: 10,
        paddingVertical:0,
    },
    statusButton: {
        color:theme.LIGHT_PINK,
        fontSize:10,
    },
    StatusOverlay: {
        position:"relative",
        top:2.5,
        right:125,
        backgroundColor: theme.DARK,
        borderRadius: 10,
        paddingVertical:0,
        borderWidth:1,
        borderColor:theme.LIGHT_PINK,
        borderRadius:5,
        paddingVertical:2,
        paddingHorizontal:5
    },
    drawerBtn: {
        marginTop: '1%',
        marginLeft: '3%',
        marginBottom: '3%',
        borderRadius: 70
    },
    safeAreaContainer: {
        flex: 1,
        paddingTop:"7%",
        backgroundColor: theme.DARK,
    },
    viewDark: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center' ,
        backgroundColor: theme.DARK
    },
    dataRowScrollView: {
        flex: 1,
        width: "100%",
        paddingHorizontal: "5%",
        paddingBottom: 10,
        paddingTop: 10
    },
})
export default WhatsPoppin;