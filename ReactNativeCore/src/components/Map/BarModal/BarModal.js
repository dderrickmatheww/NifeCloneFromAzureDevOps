import React from "react";
import {
    Text,
    View,
} from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import theme from "../../../styles/theme";
import Util from "../../../utils/util";
import {connect} from "react-redux";
import {barStyles} from "../style";
import {distanceBetween} from "../../../utils/location";
import {getBusiness, getBusinessCheckIns} from "../../../utils/api/businesses";
import Favorite from "../../FavoriteButton/FavoriteButton";
import {EventsTab} from "./EventsTab";
import {SpecialsTab} from "./SpecialsTab";
import {DetailsTab} from "./DetailsTab";
import {updateOrDeleteFavorites} from "../../../utils/api/users";

const TouchableOpacity = Util.basicUtil.TouchableOpacity();

const tabState = Object.freeze({
    DETAILS: 'details',
    EVENTS: 'events',
    SPECIALS: 'specials',
})


class BarModal extends React.Component {

    state = {
        userData: this.props.user,
        isVisible: !!this.props.isVisible,
        distance: null,
        checkedIn: "",
        tabState: tabState.DETAILS,
        businessData: null,
        loadingBusiness: false,
        navModal: false,
        distanceBetween: 0.0
    }

    toggleModal = (boolean) => {
        this.props.toggleModal(boolean);
    }

    async componentDidMount() {
        this.setState({loadingBusiness: true});
        let checkIns = await getBusinessCheckIns(this.props.buisnessUID);
        let businessData = await getBusiness(this.props.buisnessUID)
        this.setState({
            businessData,
            checkedIn: checkIns.length,
            loadingBusiness: false
        });
    }

    favoriteABar = async (user, business, bool) => {
        await updateOrDeleteFavorites(user, business, bool);
    }

    renderTabState = () => {
        switch(this.state.tabState){
            case "details":
                return (
                    <DetailsTab source={this.props.source} checkedIn={this.state.checkedIn}
                                userData={this.state.userData} barName={this.props.barName}
                                buisnessUID={this.props.buisnessUID} latitude={this.props.latitude}
                                longitude={this.props.longitude} address={this.props.address}
                                phone={this.props.phone} closed={this.props.closed}/>
                )
            case "events":
                return (
                    <EventsTab businessData={this.state.businessData} loadingBusiness={this.state.loadingBusiness}/>
                )
            case "specials":
                return (
                    <SpecialsTab businessData={this.state.businessData} loadingBusiness={this.state.loadingBusiness}/>
                )
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
                            favoriteTrigg={(user, business, bool) => this.favoriteABar(user, business, bool)}
                            user={this.props.user} buisnessUID={this.props.buisnessUID}
                            buisnessName={this.props.barName}/>
                    </View>

                </View>
                <Text style={barStyles.panelText}>
                    {this.props.distance} miles away
                </Text>
                <Text style={barStyles.panelText}>
                    {this.props.address}
                </Text>
                <View style={barStyles.tabCont}>
                    <TouchableOpacity style={[barStyles.tab]} onPress={() => this.setState({tabState: tabState.DETAILS})}>
                        <Text style={this.state.tabState === tabState.DETAILS ? barStyles.tabOff : barStyles.tabOn}>
                            Details
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({tabState: tabState.EVENTS})} style={[barStyles.tab, barStyles.middleTab]}>
                        <Text style={this.state.tabState === tabState.EVENTS  ? barStyles.tabOff : barStyles.tabOn}>
                            Events
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({tabState: tabState.SPECIALS})} style={[barStyles.tab]}>
                        <Text style={this.state.tabState === tabState.SPECIALS ? barStyles.tabOff : barStyles.tabOn}>
                            Specials
                        </Text>
                    </TouchableOpacity>
                </View>
                {
                    this.renderTabState()
                }
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