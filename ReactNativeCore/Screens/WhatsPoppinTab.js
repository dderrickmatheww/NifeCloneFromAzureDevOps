import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { styles } from '../Styles/style';
import getFeedData from './Components/Whats Poppin Components/GetFeedData';
import DataRow from './Components/Whats Poppin Components/DataRow';
import * as firebase from 'firebase';
import InputWithIcon from './Universal Components/InputWithIcon';
import PleaseLogin from './Universal Components/PleaseLogin';
import AppLoading from './AppLoading';

class WhatsPoppin extends React.Component  {

    state = {
        isLoggedIn: firebase.auth().currentUser ? true : false,
        user: firebase.auth().currentUser ? firebase.auth().currentUser : null,
        query: null,
        feedData: null,
        DataRoWKey: 0,
        modalVisable: false,
        tweetData: null,
        launch: true
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
                    feedData: dataObj
                });
            });
        }
    }

    render() {
        return (
            this.state.launch ?
                this.state.isLoggedIn ? 
                    this.state.feedData ? 
                        <ScrollView style={styles.dataRowScrollView}>
                            <InputWithIcon styles={styles.searchBar} name={'ios-mail'} color={'black'} size={12} placeHolderText={'Search...'} returnKey={'search'} secureText={false} onChangeText={(text, type) => this.onChangeText(text, type)} type={'name'} keyboardType={'default'} value={this.state.query} onSubmit={(text, eventCount, target) => this.OnSubmit(text, eventCount, target)}/>
                            {
                                this.state.feedData.countData.map(data => (
                                    <DataRow 
                                        key={ data.buisnessUID }
                                        phone={ data.buisnessData.phone }
                                        name={ data.buisnessData.name }
                                        barImage={ data.buisnessData.image }
                                        address={ data.buisnessData.address }
                                        lat={ data.buisnessData.latAndLong.split(',')[0] ? data.buisnessData.latAndLong.split(',')[0] :  null }
                                        long={ data.buisnessData.latAndLong.split(',')[1] ? data.buisnessData.latAndLong.split(',')[1] : null }
                                        modalVisability={ this.state.modalVisable }
                                        userData={ data.users }
                                        usersCheckedIn={ data.checkedIn }
                                    />
                                ))
                            }
                            <View style={{ height: 120 }} />
                        </ScrollView>
                    : 
                    <View style={styles.viewDark}>
                        <ActivityIndicator 
                            size={'large'}
                            color={'#ff1493'}
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

export default WhatsPoppin;