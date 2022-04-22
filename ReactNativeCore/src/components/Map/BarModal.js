import React from "react";
import {
    Image,
    Text,
    View,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import theme from "../../../src/styles/theme";
import Util from "../../utils/util";
// import PopUpModal from "../Universal/PopUpModal";
import {connect} from "react-redux";
import {barStyles} from "./style";
import CheckInOutButtons from "../CheckInOutBtn/CheckInOutBtn";
import {distanceBetween} from "../../utils/location";
import {getBusiness, getBusinessCheckIns} from "../../utils/api/businesses";


class BarModal extends React.Component {

    state = {
        userData: this.props.user,
        isVisible: this.props.isVisible ? true : false,
        distance: null,
        checkedIn: "",
        DetailsTab: true,
        EventsTab: false,
        SpecialsTab: false,
        businessData: null,
        loadingBusiness: false,
        navModal: false,
        distanceBetween: 0.0
    }

    toggleModal = (boolean) => {
        this.props.toggleModal(boolean);
    }

    toggleNavModal = (boolean) => {
        this.setState({navModal: boolean});
    }

    async componentDidMount() {
        let distance = distanceBetween(this.props.latitude, this.props.longitude, this.props.userLocation).toFixed(1)
        this.setState({loadingBusiness: true});
        let checkIns = await getBusinessCheckIns(this.props.buisnessUID);
        let businessData = await getBusiness(this.props.buisnessUID)
        this.setState({
            distanceBetween: distance,
            businessData,
            checkedIn: checkIns.length,
            loadingBusiness: false
        });
    }

    favoriteABar = async (buisnessUID, boolean, buisnessName) => {
        let updatedUserData = this.props.user;
        await Util.user.setFavorite(updatedUserData, buisnessUID, boolean, buisnessName, (boolean, boolean2) => {
            if (boolean2) {
                this.setState({navModal: true});
            } else {
                if (typeof updatedUserData['favoritePlaces'] !== 'undefined') {
                    updatedUserData['favoritePlaces'][buisnessUID] = {
                        favorited: boolean,
                        name: buisnessName
                    };
                    this.props.refresh(updatedUserData);
                }
            }
        });
    }

    toggleTab = (tabstate) => {
        if (tabstate.details) {
            if (!this.state.DetailsTab) {
                this.setState({DetailsTab: true});
            }
            if (this.state.EventsTab) {
                this.setState({EventsTab: false});
            }
            if (this.state.SpecialsTab) {
                this.setState({SpecialsTab: false});
            }
        }
        if (tabstate.events) {
            if (!this.state.EventsTab) {
                this.setState({EventsTab: true});
            }
            if (this.state.DetailsTab) {
                this.setState({DetailsTab: false});
            }
            if (this.state.SpecialsTab) {
                this.setState({SpecialsTab: false});
            }
        }
        if (tabstate.specials) {
            if (!this.state.SpecialsTab) {
                this.setState({SpecialsTab: true});
            }
            if (this.state.EventsTab) {
                this.setState({EventsTab: false});
            }
            if (this.state.DetailsTab) {
                this.setState({DetailsTab: false});
            }
        }
    }

    renderInner = () => (
        <View style={{flex: 1, height: 700, width: '100%'}}>
            <View style={barStyles.panel}>
                <View style={barStyles.titleHeader}>
                    <View style={{flexGrow: 1, width: 0, flexDirection: "column", justifyContent: "center"}}>
                        <Text style={barStyles.panelTitle}>{this.props.barName}</Text>
                    </View>

                    <View style={{position: "relative"}}>
                        <Favorite
                            favoriteTrigg={(buisnessUID, bool, buisnessName) => this.favoriteABar(buisnessUID, bool, buisnessName)}
                            user={this.props.user} buisnessUID={this.props.buisnessUID}
                            buisnessName={this.props.barName}/>
                    </View>

                </View>
                <Text style={barStyles.panelText}>
                    {this.state.distanceBetween} miles away
                </Text>
                <Text style={barStyles.panelText}>
                    {this.props.address}
                </Text>
                <View style={barStyles.tabCont}>
                    <TouchableOpacity style={[styles.tab]} onPress={() => this.toggleTab({details: true})}>
                        <Text style={!this.state.DetailsTab ? styles.tabOn : styles.tabOff}>
                            Details
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.toggleTab({events: true})} style={[styles.tab, {
                        borderRightWidth: 1,
                        borderLeftWidth: 1,
                        borderRightColor: !this.state.SpecialsTab ? theme.generalLayout.secondaryColor : "gray",
                        borderLeftColor: !this.state.DetailsTab ? theme.generalLayout.secondaryColor : "gray"
                    }]}>
                        <Text style={this.state.EventsTab ? styles.tabOff : styles.tabOn}>
                            Events
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.toggleTab({specials: true})} style={[styles.tab]}>
                        <Text style={this.state.SpecialsTab ? styles.tabOff : styles.tabOn}>
                            Specials
                        </Text>
                    </TouchableOpacity>
                </View>
                {
                    this.state.EventsTab ?
                        <View style={{flex: 1}}>
                            <ScrollView style={{flex: 1}} contentContainerStyle={{
                                flex: 1,
                                justifyContent: "flex-start",
                                alignItems: 'center'
                            }}>
                                {
                                    this.state.businessData ?
                                        this.state.businessData.events.length > 0 ?
                                            this.state.businessData.events.map((event, i) => (
                                                <View key={i} style={barStyles.eventCont}>
                                                    <Text style={barStyles.eventText}>
                                                        {event.text}
                                                    </Text>
                                                </View>
                                            ))
                                            :
                                            <View style={barStyles.noEventsCont}>
                                                <Text style={barStyles.noEventsText}>No events planned yet!</Text>
                                            </View>
                                        :
                                        this.state.loadingBusiness ?
                                            <ActivityIndicator color={theme.loadingIcon.color}
                                                               size="large"></ActivityIndicator> :
                                            <View style={barStyles.noEventsCont}>
                                                <Text style={barStyles.noEventsText}>This business has not registered
                                                    for Nife yet, let them know!</Text>
                                            </View>
                                }
                            </ScrollView></View>
                        : null
                }
                {
                    this.state.SpecialsTab ?
                        <ScrollView style={{flex: 1}} contentContainerStyle={{
                            flex: 1,
                            justifyContent: "flex-start",
                            alignItems: 'center',
                        }}>
                            {
                                this.state.businessData ?
                                    this.state.businessData.specials.length > 0 ?
                                        this.state.businessData.specials.map((special, i) => (
                                            <View key={i} style={barStyles.eventCont}>
                                                <Text style={barStyles.eventText}>
                                                    {special.text}
                                                </Text>
                                            </View>
                                        ))
                                        :
                                        <View style={barStyles.noEventsCont}>
                                            <Text style={barStyles.noEventsText}>No specials out yet!</Text>
                                        </View>
                                    :
                                    this.state.loadingBusiness ?
                                        <ActivityIndicator color={theme.loadingIcon.color}
                                                           size="large"></ActivityIndicator> :
                                        <View style={barStyles.noEventsCont}>
                                            <Text style={barStyles.noEventsText}>This business has not registered for
                                                Nife yet, let them know!</Text>
                                        </View>
                            }
                        </ScrollView>
                        : null
                }
                {
                    this.state.DetailsTab ?
                        <View>
                            <Image
                                style={barStyles.photo}
                                source={{uri: this.props.source.uri}}
                            />

                            {/* <AirbnbRating
                starContainerstyle={barStyles.ratingSystem}
                defaultRating={this.props.rating}
                showRating={false}
                isDisabled={true}
                reviewSize={20}
                selectedColor={theme.LIGHT_PINK}
              /> */}
                            {/* <Text style={barStyles.ratingText}> in {this.props.reviewCount} reviews.</Text> */}
                            {
                                !this.state.checkedIn == "" || this.state.checkedIn == 0 ?
                                    this.state.checkedIn == 1 ?
                                        <Text style={barStyles.ratingText}>
                                            There is {this.state.checkedIn} person here!
                                        </Text>
                                        :
                                        <Text style={barStyles.ratingText}>
                                            There are {this.state.checkedIn} people here!
                                        </Text>
                                    :
                                    <View style={barStyles.activityIndicator}>
                                        <ActivityIndicator
                                            size={'large'}
                                            color={theme.loadingIcon.color}
                                        />
                                    </View>
                            }
                            {!this.state.userData.isBusiness ? <View style={barStyles.panelButton}>
                                <CheckInOutButtons
                                    email={this.state.userData.email}
                                    barName={this.props.barName}
                                    buisnessUID={this.props.buisnessUID}
                                    latitude={this.props.latitude}
                                    longitude={this.props.longitude}
                                    address={this.props.address}
                                    phone={this.props.phone}
                                    source={this.props.source}
                                    closed={this.props.closed}
                                />
                            </View> : null}
                        </View>
                        : null
                }
                {/*<PopUpModal */}
                {/*  toggleModal={(boolean) => {this.toggleNavModal(boolean)}} */}
                {/*  isVisible={this.state.navModal} */}
                {/*  navigation={this.props.navigation} */}
                {/*  route={'Profile'}*/}
                {/*  userData={this.props.user}*/}
                {/*  friendData={this.props.friends}*/}
                {/*/>*/}
            </View>
        </View>
    )

    renderHeader = () => (
        <View style={barStyles.header}>
            <View style={barStyles.panelHeader}>
                <View style={barStyles.panelHandle}/>
            </View>
        </View>
    )

    bs = React.createRef()

    render() {
        return (
            this.state.isVisible ?
                <BottomSheet
                    ref={this.bs}
                    snapPoints={['75%', '50%', '25%', '0%']}
                    renderContent={this.renderInner}
                    renderHeader={this.renderHeader}
                    enabledInnerScrolling={false}
                    enabledBottomClamp={true}
                    onCloseEnd={() => {
                        this.toggleModal(false)
                    }}
                />
                :
                null
        )
    }
}


function mapStateToProps(state) {
    return {
        user: state.userData,
        friendRequests: state.friendRequests,
        friends: state.friendData,
        businessData: state.businessData,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        refresh: (userData) => dispatch({type: 'REFRESH', data: userData})
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(BarModal);