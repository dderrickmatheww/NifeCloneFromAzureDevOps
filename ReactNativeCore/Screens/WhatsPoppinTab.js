import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from '../Styles/style';
import getFeedData from './FeedComponents/GetFeedData';
import DataRow from './FeedComponents/DataRow';
import * as firebase from 'firebase';
import InputWithIcon from '../Screens/Components/InputWithIcon';
class WhatsPoppin extends React.Component  {

    state = {
        isLoggedIn: firebase.auth().currentUser ? true : false,
        user: firebase.auth().currentUser,
        query: null,
        feedData: null,
        DataRoWKey: 0,
        modalVisable: false
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
            let provider = this.state.user.providerData[0].providerId;
            let query = this.state.query;
            getFeedData(provider, query, (dataObj) => {
                console.log(dataObj.data);
                this.setState({ feedData: dataObj.data });
            });
        }
    }

    render() {
        return (
            this.state.isLoggedIn ? 
                this.state.feedData ? 
                    <ScrollView style={styles.dataRowScrollView}>
                        <InputWithIcon styles={styles.searchBar} name={'ios-mail'} color={'black'} size={12} placeHolderText={'Search...'} returnKey={'search'} secureText={false} onChangeText={(text, type) => this.onChangeText(text, type)} type={'name'} keyboardType={'default'} value={this.state.query} onSubmit={(text, eventCount, target) => this.OnSubmit(text, eventCount, target)}/>
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
                                key={this.state.DataRoWKey++}
                                onPress={() => this.onDataRowPress(boolean)}
                            />
                        ))}
                        <View style={{ height: 120 }} />
                        <Modal
                            visible={this.state.modalVisible}
                            animationType="slide"
                            transparent={true}
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                </View>
                            </View>
                        </Modal>
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