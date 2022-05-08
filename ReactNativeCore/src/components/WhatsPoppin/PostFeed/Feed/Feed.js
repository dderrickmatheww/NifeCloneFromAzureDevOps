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
import { 
    Avatar,
    Caption,
    Paragraph,
} from 'react-native-paper';
import theme from '../../../../styles/theme';
import Util from '../../../../utils/util';
import { getPostsPaginated } from '../../../../utils/api/posts';
const defPhoto = { uri: Util.basicUtil.defaultPhotoUrl };

class Feed extends React.Component {

    state = {
        feedData: this.props.feedData,
        userData: this.props.userData,
        businessData : this.props.buisnessData,
        refresh: false,
        take: 50,
        skip: 0
    }

    onRefresh = async () => {
        this.setState({ refresh: true });
        const { userData, skip, take } = this.state;
        const { id } = userData;
        skip += 50;
        const postObj = {
            skip,
            take,
            userId: id
        };
        const feedData = await getPostsPaginated(postObj);
        this.props.feedData(feedData);
        this.setState({
            refresh: false
        });
    }

    render() {
        return (
            <SafeAreaView style={ localStyles.containerGallery }>
                <FlatList
                    numColumns={ 1 }
                    style={ localStyles.feed }
                    horizontal={ false }
                    data={ this.state.userData.user_posts }
                    keyExtractor={ item => item.id }
                    refreshing={ this.state.refresh }
                    onEndReached={ this.onRefresh }
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
                        <View style={ localStyles.feedDataRow }>
                            <Avatar.Image source={ item.photoSource ? { uri: item.photoSource } : defPhoto } size={50}/>
                            <Text style={ localStyles.displayName }>
                                { item.displayName ? item.displayName : null }
                                { item.name }
                                {
                                    this.state.userData && this.state.userData.businessId != null ?
                                        <Caption
                                            style={ localStyles.feedType }>{ this.state.businessData.address }
                                        </Caption> 
                                    : 
                                        null
                                }
                            </Text>
                            <Caption style={ localStyles.feedType }>
                                {item.type === "LASTVISIT" ? "Took a visit" : 
                                item.type === "CHECKIN" ? "Checked in" : 
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

function mapDispatchToProps(dispatch){
    return {
        userData: userData => dispatch({ type:'USERDATA', data: userData }),
        feedData: feedData => dispatch({ type: 'FEEDDATA', data: feedData }),
        yelpDataRefresh: data => dispatch({ type:'YELPDATA', data: data }),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed);