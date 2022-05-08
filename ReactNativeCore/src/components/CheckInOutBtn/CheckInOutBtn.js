import theme from "../../styles/theme";
import {connect} from "react-redux";
import {View, Text, StyleSheet} from 'react-native'
import Util, {alert} from "../../utils/util";
const TouchableOpacity = Util.basicUtil.TouchableOpacity()
import React from "react";
import {createCheckIn, deleteCheckIn, getUser} from "../../utils/api/users";
import {distanceBetween, getUserLocation} from "../../utils/location";

class CheckInOutButtons extends React.Component  {
    state = {
        checkedIn: null,
        loading:  false,
        checkIn: null,
        checkedInSomewhereElse: null,
    }
    async componentDidMount() {
        await this.isUserCheckedIn();
    }

    isUserCheckedIn = async () => {
        this.setState({ loading: true });
        const userCheckIn = this.props.userData.user_check_ins
        if(userCheckIn) {
            const isCheckedIn = userCheckIn.business === this.props.businessUID;
            const checkIn = this.props.userData.user_check_ins;
            const checkedInSomewhereElse = !isCheckedIn && this.props.userData.user_check_ins
            this.setState({loading: false, checkedIn: isCheckedIn, checkIn, checkedInSomewhereElse})
        }
        this.setState({loading: false})
    }

    refreshUser = async () => {
        const user = await getUser(this.props.userData.email)
        this.props.refresh(user, []);
    }

    handleCheckOuts = async () => {
        this.setState({ loading: true });
        await deleteCheckIn(this.state.checkIn.id);
        this.setState({loading:false, checkIn: null})
        await this.refreshUser()
        await this.props.handleCheckIns();
    }

    handleCheckIn = async (isPrivate) => {
        const HUNDRED_FT_IN_MILES = 0.0189394
        this.setState({ loading: true });
        const {latitude, longitude} = await getUserLocation()
        const distance = await distanceBetween(
            this.props.business.coordinates.latitude,
            this.props.business.coordinates.longitude,
            {latitude, longitude}
        )
        if(distance <= HUNDRED_FT_IN_MILES){
            if(this.state.checkedInSomewhereElse){
                await deleteCheckIn(this.state.checkIn.id);
            }
            const checkIn = await createCheckIn(this.props.userData.id, this.props.businessUID, isPrivate);
            this.setState({loading:false, checkIn})
            await this.refreshUser()
            await this.props.handleCheckIns();

        } else {
            alert('Check In Error!', 'Must be within 100ft to check in.')
            this.setState({ loading: false });
        }

    }

    render(){
        return(
            !this.state.loading ?
                this.state.checkIn && !this.state.checkedInSomewhereElse ?
                    <View style={localStyles.checkOutContainer}>
                        <TouchableOpacity
                            onPress={this.handleCheckOuts}
                            style={localStyles.descCont}
                        >
                            <Text style={localStyles.modalText}>Check out</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={localStyles.checkOutContainer}>
                        <TouchableOpacity
                            onPress={async () => this.handleCheckIn(false)}
                            style={localStyles.descCont}
                        >
                            <Text style={localStyles.modalText}>Check In</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={async () => this.handleCheckIn(true)}
                            style={localStyles.descCont}
                        >
                            <Text style={localStyles.modalText}>Private Check In</Text>
                        </TouchableOpacity>
                    </View>
                    : null
        )
    }

}

function mapStateToProps(state) {
    return {
        userData: state.userData,
        feedData: state.feedData
    }
}

function mapDispatchToProps(dispatch) {
    return {
        refresh: (userData, feedData) => dispatch({type: 'REFRESH', data: userData, feed: feedData})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckInOutButtons);

const localStyles = StyleSheet.create({
    activityIndicator: {
        margin: 50,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center' ,
        backgroundColor: theme.generalLayout.backgroundColor
    },
    descCont: {
        borderRadius: 10,
        padding: '1%',
        borderColor: theme.generalLayout.secondaryColor,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center' ,
        alignContent:"center",
        backgroundColor: theme.generalLayout.backgroundColor,
        paddingHorizontal:5,
        paddingVertical:5,
        minWidth: 125,
        maxWidth: 125
    },
    modalText:{
        width: '100%',
        color: theme.generalLayout.textColor,
        paddingBottom:2.5,
        fontWeight:"bold",
        justifyContent: 'center',
        alignSelf:"center",
        alignItems: 'center' ,
        textAlign:"center",
        fontSize: 12,
        paddingHorizontal:5,
        fontFamily: theme.generalLayout.font
    },
    checkInContainer: {
        flexDirection:"row",
        width:"90%",
        justifyContent:"space-between",
        textAlign:"center",
        alignItems:"center"
    },
    checkOutContainer: {
        flexDirection:"row",
        width:"90%",
        justifyContent:"space-evenly",
        alignSelf:"center"
    }
});

