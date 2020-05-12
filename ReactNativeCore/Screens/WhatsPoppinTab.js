import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from '../Styles/style';
import getFeedData from './FeedComponents/GetFeedData';
import DataRow from './FeedComponents/DataRow';
import * as firebase from 'firebase';

class WhatsPoppin extends React.Component  {

    state = {
        isLoggedIn: firebase.auth().currentUser ? true : false,
        user: firebase.auth().currentUser,
        query: null,
        feedData: null
    }

    componentDidMount () {
        this.grabFeedData()
    }

    grabFeedData = () => {
        if(this.state.isLoggedIn) {
            let provider = this.state.user.providerData[0].providerId;
            let query = this.state.query
            getFeedData(provider, query, (dataObj) => {
                console.log(dataObj.data)
                this.setState({feedData: dataObj.data});
            });
        }
    }

    render() {
        return (
            this.state.isLoggedIn ? 
                this.state.feedData ? 
                    <ScrollView style={styles.dataRowScrollView}
                    >
                        {this.state.feedData.map(data => (
                            <DataRow 
                                name={data.name}
                                link={data.link}
                                city={data.location.city}
                                street={data.location.street}
                                state={data.location.state}
                                zip={data.location.zip}
                                lat={data.location.latitude}
                                long={data.location.longitude}
                                about={data.about}
                                description={data.description}
                                website={data.website}
                            />
                        ))}
                        <View style={{ height:120}} />
                    </ScrollView>
                : 
                <View>
                    <Text>No current feed data</Text>
                </View>
            : 
            <View style={styles.viewDark}>
                <Text style={styles.titleVice}>Please login or sign up to see your feed!</Text>
                <TouchableOpacity style={styles.navigateLoginBtn} onPress={() => this.props.navigation.navigate('Settings')}><Text>Login/Sign Up</Text></TouchableOpacity>
            </View>
        )
    }
}

export default WhatsPoppin;