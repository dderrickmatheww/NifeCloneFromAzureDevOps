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
    Paragraph,
} from 'react-native-paper';
import theme from '../../../../styles/theme';
import Util from '../../../../utils/util';
import { getPosts } from '../../../../utils/api/posts';
import { getWhatsPoppinFeed } from '../../../../utils/api/whatsPoppin';
import DataRow from './DataRow';
const defPhoto = { uri: Util.basicUtil.defaultPhotoUrl };

class Feed extends React.Component {

    state = {
        type: this.props.type,
        refresh: false,
        take: 50,
        skip: 0
    }

    onRefresh = async () => {
        this.setState({ refresh: true });
        const { userData, type } = this.props;
        const { id: userId } = userData;
        if (type == "My Feed") {
            const feedData = await getPosts(userId);
            this.props.refresh({ feedData });
        }
        else {
            const whatsPoppinData = await getWhatsPoppinFeed(userId);
            this.props.refresh({ whatsPoppinData });
        }
        this.setState({ refresh: false });
    }

    componentDidMount() {
        this.onRefresh();
    }

    render() {
        return (
            <SafeAreaView style={ localStyles.containerGallery }>
                <FlatList
                    numColumns={ 1 }
                    horizontal={ false }
                    data={ this.props.type == "My Feed" ? this.props.feedData : this.props.whatsPoppinData }
                    keyExtractor={ () => uuid.v4() }
                    refreshing={ this.state.refresh }
                    refreshControl={
                        <RefreshControl
                            refreshing={ this.state.refresh }
                            onRefresh={ this.onRefresh }
                            size={ 22 }
                            title="Loading.."
                            tintColor={ theme.loadingIcon.color }
                            titleColor={ theme.generalLayout.textColor }
                        />
                    }
                    renderItem={({ item }) => (
                        this.props.type == "My Feed" ?
                            <View style={ localStyles.feedDataRow }>
                                <Avatar.Image source={ item.photoSource ? { uri: item.photoSource } : defPhoto } size={50}/>
                                <Text style={ localStyles.displayName }>
                                    { item.displayName ? item.displayName : null }
                                    { item.name }
                                    {
                                        //Instead of using business address use coords to create a calculation of how far away the bar is from the user
                                        //Will be coming from the checkin table
                                        this.props.userData && this.props.userData.businessId != null ?
                                            <Caption
                                                style={ localStyles.feedType }>{ this.props.businessData.address }
                                            </Caption> 
                                        : 
                                            null
                                    }
                                </Text>
                                <Caption style={ localStyles.feedType }>
                                    {item.type === "LASTVISITED" ? `Took a visit to ${ item.businessName }` : 
                                    item.type === "CHECKIN" ? `Checked into ${ item.businessName }` : 
                                    item.type === "EVENT" ? "Booked an event" : 
                                    item.type === "SPECIALS" ? "Has a new special" : 
                                    "Status update"}
                                </Caption>
                                <Paragraph style={ localStyles.Paragraph }>{ item.description }</Paragraph>
                                {
                                    item.image ?
                                        <Image
                                            resizeMethod="auto"
                                            resizeMode="contain"
                                            style={{ flex: 1, resizeMode: 'contain', aspectRatio: 1}}
                                            source={{ uri: item.image }}
                                        />
                                    : 
                                        null
                                }
                                <Caption style={localStyles.Caption}>{ Util.date.TimeSince(new Date(item.created).getTime()) } ago</Caption>
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
    Caption: {
        color: theme.generalLayout.textColor,
        opacity: 0.60,
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

function mapStateToProps(state){
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