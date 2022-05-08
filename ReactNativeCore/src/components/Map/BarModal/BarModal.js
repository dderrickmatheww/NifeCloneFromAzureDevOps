import React from "react";
import {
    Text,
    View,
} from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import Util from "../../../utils/util";
import {connect} from "react-redux";
import {barStyles} from "../style";
import {getBusiness, getBusinessCheckIns} from "../../../utils/api/businesses";
import Favorite from "../../FavoriteButton/FavoriteButton";
import {EventsTab} from "./EventsTab";
import {SpecialsTab} from "./SpecialsTab";
import {DetailsTab} from "./DetailsTab";

const TouchableOpacity = Util.basicUtil.TouchableOpacity();

const tabState = Object.freeze({
    DETAILS: 'details',
    EVENTS: 'events',
    SPECIALS: 'specials',
})


class BarModal extends React.Component {

    state = {
        userData: this.props.userData,
        isVisible: !!this.props.isVisible,
        distance: null,
        checkedIn: "",
        tabState: tabState.DETAILS,
        businessData: null,
        loadingBusiness: false,
        navModal: false,
        distanceBetween: 0.0,
        events: null,
        specials: null,
    }

    toggleModal = (boolean) => {
        this.props.toggleModal(boolean);
    }

    getEventsAndSpecials = async (businessData) => {
        if(businessData){
            const events = businessData.business_events.filter(event => event.eventtype === 'Event')
            const specials = businessData.business_events.filter(event => event.eventtype === 'Special')
            this.setState({events, specials})
        }
    }

    handleCheckIns = async () => {
        let checkIns = await getBusinessCheckIns(this.props.buisnessUID);
        this.setState({
            checkedIn: checkIns.length,
        });
    }

    async componentDidMount() {
        this.setState({loadingBusiness: true});
        let businessData = await getBusiness(this.props.buisnessUID)
        await this.handleCheckIns();
        await this.getEventsAndSpecials(businessData)
        this.setState({
            businessData,
            loadingBusiness: false
        });
    }


    renderTabState = () => {
        switch(this.state.tabState){
            case "details":
                return (
                    <DetailsTab business={this.props.business} source={this.props.source} checkIns={this.state.checkedIn}
                                userCheckIns={this.props.userData.user_check_ins}
                                userData={this.props.userData} barName={this.props.barName}
                                businessUID={this.props.buisnessUID} latitude={this.props.latitude}
                                longitude={this.props.longitude} address={this.props.address}
                                phone={this.props.phone} closed={this.props.closed}
                                handleCheckIns={this.handleCheckIns}
                    />
                )
            case "events":
                return (
                    <EventsTab events={this.state.events} businessData={this.state.businessData}/>
                )
            case "specials":
                return (
                    <SpecialsTab specials={this.state.specials} businessData={this.state.businessData}/>
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
                            userData={this.props.userData} buisnessUID={this.props.buisnessUID}
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
        ...state
    }
}

function mapDispatchToProps(dispatch) {
    return {
        refresh: ({ userData, feedData }) => dispatch({ 
            type:'REFRESH', 
            data: {
                userData,
                feedData 
            }
        })
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(BarModal);