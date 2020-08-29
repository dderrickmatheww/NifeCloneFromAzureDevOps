import React from 'react';
import { View, SafeAreaView, RefreshControl, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import theme from '../Styles/theme';
import { Ionicons } from '@expo/vector-icons'; 
import { styles } from '../Styles/style';
import getFeedData from './Components/Whats Poppin Components/GetFeedData';
import DataRow from './Components/Whats Poppin Components/DataRow';
import * as firebase from 'firebase';
import InputWithIcon from './Universal Components/InputWithIcon';
import PleaseLogin from './Universal Components/PleaseLogin';
import {
    Headline
} from 'react-native-paper';
import Util from '../scripts/Util';


class WhatsPoppin extends React.Component  {

    state = {
        isLoggedIn: firebase.auth().currentUser ? true : false,
        user: firebase.auth().currentUser ? firebase.auth().currentUser : null,
        query: null,
        feedData: null,
        DataRoWKey: 0,
        modalVisable: false,
        tweetData: null,
        launch: true,
        refresh: false
    }

    async componentDidMount () {
        await this.grabFeedData();
        this.setState({ isLoggedIn: firebase.auth().currentUser ? true : false });
        this.setState({ user: firebase.auth().currentUser });
        this.rerender = this.props.navigation.addListener('focus', () => {
            this.componentDidMount();
        });
    }

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
                    refresh: false
                });
            });
        }
    }

    favoriteABar = (buisnessUID, boolean) => {
        let email = this.state.user.email;
        Util.user.setFavorite(this.props.user, buisnessUID, boolean, (bool)=>{
            
        });
    }

    onRefresh = () => {
        this.setState({ refresh: true });
        this.grabFeedData();
    }

    render() {
        return (
            this.state.launch ?
                this.state.isLoggedIn ? 
                    this.state.feedData ?
                    <View style={styles.viewDark} >
                        <View style={localStyles.navHeader}>
                            {/* Drawer Button */}
                            <TouchableOpacity onPress={this.props.onDrawerPress} style={localStyles.DrawerOverlay}>
                                <Ionicons style={{paddingHorizontal:2, paddingVertical:0}} name="ios-menu" size={40} color={theme.LIGHT_PINK}/>
                            </TouchableOpacity> 
                            <View style={{width:"100%", textAlign:"center", alignSelf:"center"}}>
                                <Headline style={{color:theme.LIGHT_PINK, paddingLeft:75}}>Whats Poppin</Headline>
                            </View>
                        </View>
                        <ScrollView 
                            style={styles.dataRowScrollView}
                            refreshControl={
                                <RefreshControl refreshing={this.state.refresh} onRefresh={this.onRefresh}  />
                            }
                        >
                            <InputWithIcon styles={styles.searchBar} name={'ios-mail'} color={'black'} size={12} placeHolderText={'Search...'} returnKey={'search'} secureText={false} onChangeText={(text, type) => this.onChangeText(text, type)} type={'name'} keyboardType={'default'} value={this.state.query} onSubmit={(text, eventCount, target) => this.OnSubmit(text, eventCount, target)}/>
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
                                        user={this.props.user}
                                        usersCheckedIn={ data.checkedIn }
                                        email={this.state.user.email}
                                        favoriteABar={(buisnessUID, boolean) => {this.favoriteABar(buisnessUID, boolean)}}
                                    />
                                ))
                            }
                            <View style={{ height: 120 }} />
                        </ScrollView>
                    </View>
                    : 
                    <View style={styles.viewDark}>
                        <ActivityIndicator 
                            size={'large'}
                            color={theme.LIGHT_PINK}
                        />
                    </View>
                : 
                <PleaseLogin 
                    navigation={this.props.navigation}
                    appName={`What's poppin' feed`}
                />
            :
            <ScrollView style={styles.viewDark}>
                
            </ScrollView>
        )
    }
}
const localStyles = StyleSheet.create({ 
    navHeader: {
        marginTop:30,
        flexDirection:"row",
        borderBottomColor:theme.LIGHT_PINK,
        borderBottomWidth:1,
        width:"98%",
        textAlign:"center",
        alignItems:"center",
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
})
export default WhatsPoppin;