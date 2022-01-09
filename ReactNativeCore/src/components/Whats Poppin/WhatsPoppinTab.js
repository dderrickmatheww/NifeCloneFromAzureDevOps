import React from 'react';
import { View, SafeAreaView, RefreshControl, ScrollView, ActivityIndicator, StyleSheet, Text, Image } from 'react-native';
import theme from '../../../src/styles/theme';
import getFeedData from './GetFeedData';
import DataRow from './DataRow';
import * as firebase from 'firebase';
import PleaseLogin from '../Universal/PleaseLogin';
import {
    Headline,
    Avatar,
    Caption,
    Paragraph,
} from 'react-native-paper';
import Util from '../../scripts/Util';
import { connect } from 'react-redux';
const defPhoto = { uri: Util.basicUtil.defaultPhotoUrl };
const TouchableOpacity = Util.basicUtil.TouchableOpacity();

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
        businessTimeline: [],
        combinedValuesForUI: []
    }

    async componentDidMount () {
        this.grabFeedData();
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
                    feedLoadDone: true,
                    combinedValuesForUI: dataObj.combinedArray
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
                    this.props.refresh(updatedUserData, this.props.feedData);
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
                            <Headline style={{ color: theme.generalLayout.textColor, fontFamily: theme.generalLayout.fontBold, marginLeft: '5%', marginBottom: '2%'}}>What's Poppin'</Headline>
                        </View>
                    </View>
                    {
                        this.state.feedData ?
                            this.state.combinedValuesForUI && this.state.combinedValuesForUI.length > 0 ?
                                <ScrollView 
                                    style={localStyles.dataRowScrollView}
                                    refreshControl={
                                        <RefreshControl 
                                            refreshing={this.state.refresh} 
                                            onRefresh={this.onRefresh}  
                                            size={22}
                                            color={[theme.loadingIcon.color]}
                                            tintColor={theme.loadingIcon.color}
                                            title={'Loading...'}
                                            titleColor={theme.loadingIcon.textColor}
                                        />
                                    }
                                >
                                    {
                                        this.state.combinedValuesForUI.map(data => (
                                            data.users ?
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
                                            :
                                                <View style={ localStyles.feedDataRow }  key={ data.uid }>
                                                    <Avatar.Image source={ data.image ? { uri: data.image } : defPhoto } size={50}/>
                                                    <Text style={ localStyles.displayName }>
                                                            { data.username ? data.username : null }
                                                            { data.name }
                                                    </Text>
                                                    <Caption style={ localStyles.feedType }>{ data.visited ? "Took a visit" : data.checkedIn ? "Checked in" : data.event ? "Booked an event" : data.specials ? "Has a new special" : "Status update" }</Caption>
                                                    <View>
                                                        <Paragraph style={ localStyles.Paragraph }>{ data.text }</Paragraph>
                                                        {
                                                            data.statusImage ?
                                                                <Image
                                                                    resizeMethod="auto"
                                                                    resizeMode="contain"
                                                                    style={{ flex: 1, resizeMode:'contain', aspectRatio:1}}
                                                                    source={{ uri: data.statusImage }}
                                                                />
                                                            : 
                                                                null
                                                        }
                                                    </View>
                                                    <Caption style={localStyles.Caption}>{ Util.date.TimeSince(data.time._seconds ? data.time._seconds * 1000 : data.time.seconds * 1000) } ago</Caption>
                                                </View>
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
                                                color={[theme.loadingIcon.color]}
                                                tintColor={theme.loadingIcon.color}
                                                title={'Loading...'}
                                                titleColor={theme.loadingIcon.textColor}
                                            />
                                        }
                                    >
                                        <Text style={localStyles.emptyPoppinFeed}>
                                            Nothing seems to be happening yet! {"\n"}
                                            {"\n"}
                                            Once users start checking in, the restaurants that your friends check into will populate here! {"\n"}
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
        borderBottomColor: theme.generalLayout.secondaryColor,
        borderBottomWidth:1,
        width:"98%",
        textAlign:"center",
        alignItems:"center",
    },
    emptyPoppinFeed: {
        color: theme.generalLayout.textColor, 
        fontSize: 16,
        padding: 20,
        textAlign: "center",
        justifyContent: "center",
        fontFamily: theme.generalLayout.font
    },
    DrawerOverlay: {
        alignSelf:"flex-start",
        opacity: 0.75,
        backgroundColor: theme.generalLayout.backgroundColor,
        borderRadius: 10,
        paddingVertical:0,
    },
    statusButton: {
        color: theme.generalLayout.textColor,
        fontSize: 10,
        fontFamily: theme.generalLayout.font
    },
    StatusOverlay: {
        position:"relative",
        top:2.5,
        right:125,
        backgroundColor: theme.generalLayout.backgroundColor,
        borderWidth:1,
        borderColor: theme.generalLayout.secondaryColor,
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
        backgroundColor: theme.generalLayout.backgroundColor,
    },
    viewDark: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center' ,
        backgroundColor: theme.generalLayout.backgroundColor
    },
    dataRowScrollView: {
        flex: 1,
        width: "100%",
        paddingHorizontal: "5%",
        paddingBottom: 10,
        paddingTop: 10
    },
    scrollContent: {
        justifyContent: "center",
        alignItems: "center",
        width: "98%",
        ...Platform.select({
            ios: {
                paddingBottom: 120,
            },
            android: {
                paddingBottom: 120,
            },
        })
    },
    viewDark: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.generalLayout.backgroundColor,
        paddingBottom: 10
    },
    modalButton: {
        backgroundColor: theme.generalLayout.backgroundColor,
        borderWidth: 1,
        borderColor: theme.generalLayout.secondaryColor,
        borderRadius: 5,
        paddingVertical: 2,
        paddingHorizontal: 5,
        textAlign: "center",
        marginVertical: 5,
        fontFamily: theme.generalLayout.font
    },
    modalButtonText: {
        color: theme.generalLayout.secondaryColor,
        fontSize: 20,
        textAlign: "center",
        fontFamily: theme.generalLayout.font
    },
    StatusOverlay: {
        position: "relative",
        right: 150,
        backgroundColor: theme.generalLayout.backgroundColor,
        borderWidth: .5,
        borderColor: theme.generalLayout.secondaryColor,
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 8
    },
    Caption: {
        color: theme.generalLayout.textColor,
        opacity: 0.60,
        fontFamily: theme.generalLayout.font
    },
    statusButton: {
        color: theme.generalLayout.textColor,
        fontSize: 11,
        fontFamily: theme.generalLayout.font
    },
    Paragraph: {
        color: 'white',
        fontSize: 12,
        marginTop: -10,
        marginBottom: 10,
        fontFamily: theme.generalLayout.font
    },
    displayName: {
        color: 'white',
        left: 60,
        top: -45,
        position: "relative",
        fontSize: 15,
        fontWeight: "bold",
        fontFamily: theme.generalLayout.fontBold
    },
    feedType: {
        color: 'white',
        left: 60,
        top: -50,
        position: "relative",
        fontSize: 12,
        opacity: 0.60
    },
    feedDataRow: {
        flex: 1,
        backgroundColor: theme.generalLayout.backgroundColor,
        borderColor: theme.generalLayout.secondaryColor,
        color: theme.generalLayout.textColor,
        borderRadius: 10,
        borderWidth: .5,
        marginVertical: 15,
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginVertical: 2,
        width: "100%",
    },
    loaderRow: {
        flex: 1,
        backgroundColor: theme.generalLayout.backgroundColor,
        borderColor: theme.generalLayout.secondaryColor,
        color: theme.generalLayout.textColor,
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginVertical: 2,
        width: "100%",
    },
    emptyPoppinFeed: {
        color: theme.generalLayout.textColor,
        fontSize: 16,
        padding: 20,
        textAlign: "center",
        justifyContent: "center",
        fontFamily: theme.generalLayout.font
    },
    navHeader: {
        marginTop: 12.5,
        flexDirection: "row",
        borderBottomColor: theme.generalLayout.secondaryColor,
        borderBottomWidth: 1,
        width: "98%",
        textAlign: "center",
        alignItems: "center",
    },
    DrawerOverlay: {
        alignSelf: "flex-start",
        opacity: 0.75,
        backgroundColor: theme.generalLayout.backgroundColor,
        borderRadius: 10,
        paddingVertical: 0,
    },
    ScrollView: {
        flex: 1,
        width: "100%",
        paddingHorizontal: "5%",
        paddingBottom: 20,
        paddingTop: 20,
    },
    drawerBtn: {
        marginTop: '1%',
        marginLeft: '3%',
        marginBottom: '3%',
        borderRadius: 70
    },
    safeAreaContainer: {
        flex: 1,
        paddingTop: "7%",
        backgroundColor: theme.generalLayout.backgroundColor,
    },
    container: {
        flex: 1,
        marginBottom: '25%'
    },
    containerInfo: {
        margin: 20
    },
    containerGallery: {
        flex: 1
    },
    containerImage: {
        flex: 1 / 3

    },
    image: {
        flex: 1,
        aspectRatio: 1 / 1
    }
});
function mapStateToProps(state) {
    return {
        userData: state.userData,
        business: state.businessData,
        feedData: state.feedData
    }
}
function mapDispatchToProps (dispatch) {
    return {
        refresh: (userData, feedData) => dispatch({ type:'REFRESH', data: userData, feed: feedData }),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(WhatsPoppin);