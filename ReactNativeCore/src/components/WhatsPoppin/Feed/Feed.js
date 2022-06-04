import React from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView,
    Text,
    Image,
    FlatList,
    RefreshControl
} from 'react-native';
import { connect } from 'react-redux';
import uuid from 'react-native-uuid';
import { 
    Avatar,
    Caption,
    Paragraph
} from 'react-native-paper';
import theme from '../../../styles/theme';
import Util from '../../../utils/util';
import { getPosts, updatePostById } from '../../../utils/api/posts';
import { getWhatsPoppinFeed } from '../../../utils/api/whatsPoppin';
import { getUser } from '../../../utils/api/users';
import { withinRadius } from '../../../utils/location';
import { NifeMenu } from '../../NifeMenu/NifeMenu';
import DataRow from './DataRow';
import { getBusiness } from '../../../utils/api/businesses';
const defPhoto = { uri: Util.basicUtil.defaultPhotoUrl };

class Feed extends React.Component {

    state = {
        type: this.props.type,
        refresh: false,
        take: 50,
        skip: 0,
        menuVisability: false
    }

    onRefresh = async () => {
        this.setState({ refresh: true });
        const { userData, type } = this.props;
        const { id: userId, latitude, longitude, email } = userData;
        const userLocation = {
            userLat: parseFloat(latitude),
            userLong: parseFloat(longitude)
        };
        if (type == "My Feed") {
            const feedData = await getPosts(userId);
            this.props.refresh({ feedData });
        }
        else {
            let whatsPoppinData = await getWhatsPoppinFeed({ ...userLocation });
            console.log(whatsPoppinData)
            //whatsPoppinData = whatsPoppinData.filter(obj => withinRadius({ ...userLocation, busLat: parseFloat(obj.latitude), busLong: parseFloat(obj.longitude) }));
            const userData = await getUser(email);
            this.props.refresh({ userData, whatsPoppinData });
        }
        this.setState({ refresh: false });
    }

    componentDidMount() {
        this.onRefresh();
    }

    handleReport = (id) => {
        const posts = this.props.type == "My Feed" ? this.props.feedData : this.props.whatsPoppinData;
        const post = posts.find(obj => obj.id === id);
        const { id: postId, image, description } = post;
        const isFlagged = '1';
        updatePostById(postId, description, image, isFlagged);
    }

    render() {
        return (
            <SafeAreaView style={localStyles.containerGallery}>
                <FlatList
                    numColumns={ 1 }
                    horizontal={ false }
                    data={ this.props.type == "My Feed" ? this.props.feedData : this.props.whatsPoppinData }
                    keyExtractor={ () => uuid.v4() }
                    refreshing={ this.state.refresh }
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refresh}
                            onRefresh={this.onRefresh}
                            size={22}
                            title="Loading.."
                            tintColor={theme.loadingIcon.color}
                            titleColor={theme.generalLayout.textColor}
                        />
                    }
                    renderItem={({ item }) => (
                        this.props.type == "My Feed" ?
                            <View style={ localStyles.feedDataRow }>
                                <Avatar.Image source={ item.photoSource ? { uri: item.photoSource } : defPhoto } size={50}/>
                                <Text style={ localStyles.displayName }>
                                    { this.props.businessData.displayName ? this.props.businessData.displayName : item.displayName ? item.displayName : null }
                                </Text>
                                    {
                                        //Instead of using business address use coords to create a calculation of how far away the bar is from the user
                                        //Will be coming from the checkin table
                                        this.props.userData && this.props.userData.businessId != null ?
                                            <Caption style={ localStyles.address }>
                                                { 
                                                    `${this.props.businessData.street}, ${ this.props.businessData.city } ${ this.props.businessData.zip }` 
                                                }
                                            </Caption> 
                                        : 
                                            null
                                    }
                                
                                <Caption style={ localStyles.feedType }>
                                    {
                                        item.type === "LASTVISITED" ? `Took a visit to ${ item.businessName }` : 
                                        item.type === "CHECKIN" ? `Checked into ${ item.businessName }` : 
                                        item.type === "EVENT" ? "Booked an event" : 
                                        item.type === "SPECIAL" ? "Has a new special" : 
                                        "Status update"
                                    }
                                </Caption>
                                <Paragraph style={ localStyles.Paragraph }>{ item.description }</Paragraph>
                                {
                                    item.image ?
                                        <Image
                                            resizeMode="contain"
                                            style={{ 
                                                flex: 1, 
                                                aspectRatio: 1, 
                                                marginTop: '5%',
                                                marginBottom: '5%',
                                                width: '100%'
                                            }}
                                            source={{ uri: item.image }}
                                        />
                                    : 
                                        null
                                }
                                <Caption style={localStyles.Caption}>{ Util.date.TimeSince(new Date(item.created).getTime()) } ago</Caption>
                                <NifeMenu options={[{ title: "Report", onPress: this.handleReport, icon: "account-alert", id: item.id }]} />
                            </View>
                        :
                            <DataRow 
                                key={ item.uuid }
                                buisnessUID={ item.uuid }
                                phone={ item.phoneNumber }
                                name={ item.displayName }
                                barImage={ item.photoSource }
                                address={ `${ item.street } ${ item.city }, ${ item.state }, ${ item.zip }` }
                                lat={ item.latitude }
                                long={ item.longitude }
                                usersCheckedIn={ item.userCheckIn._count.user }
                                email={ item.email }
                                events={ item.business_events }
                            />
                    )}
                />
            </SafeAreaView>
        )
    }
}

const localStyles = StyleSheet.create({
    feed: {
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 5,
    },
    Caption: {
        color: theme.generalLayout.textColor,
        opacity: 0.60,
        fontFamily: theme.generalLayout.font
    },
    Paragraph: {
        color: 'white',
        paddingLeft: '1%',
        top: 0,
        fontSize: 12,
        fontFamily: theme.generalLayout.font
    },
    displayName: {
        color: 'white',
        left: 60,
        top: -45,
        position: "relative",
        fontSize: 15,
        fontWeight: "bold",
        fontFamily: theme.generalLayout.fontBold,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    },
    reportBtn: {
        flex: 1,
        color: 'white',
        left: '82.5%',
        width: 0,
        top: -80,
        position: "relative",
        fontWeight: "bold",
        fontFamily: theme.generalLayout.fontBold,
    },
    address: {
        color: 'white',
        left: 60,
        top: -40,
        position: "relative",
        fontSize: 12,
        opacity: 0.60,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    },
    feedType: {
        color: theme.icons.color,
        left: 60,
        top: -40,
        position: "relative",
        fontSize: 16,
        opacity: 0.60,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    },
    feedDataRow: {
        flex: 1,
        backgroundColor: theme.generalLayout.backgroundColor,
        borderColor: theme.generalLayout.secondaryColor,
        color: theme.generalLayout.textColor,
        borderRadius: 10,
        borderWidth: .5,
        marginVertical: 5,
        paddingVertical: 10,
        paddingHorizontal: 10,
        width: "100%",
        height: '100%'
    },
    container: {
        flex: 1,
        marginBottom: '25%',
        height: '100%'
    },
    containerGallery: {
        flex: 1,
        height: '100%'
    },
    image: {
        flex: 1,
        aspectRatio: 1 / 1
    }
});

function mapStateToProps(state) {
    return {
        ...state
    }
}

function mapDispatchToProps(dispatch) {
    return {
        refresh: ({ userData, feedData, whatsPoppinData }) => dispatch({ 
            type:'REFRESH', 
            data: {
                userData,
                feedData,
                whatsPoppinData 
            }
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed);