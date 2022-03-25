import React  from "react";
import {
    Text,
    View,
    ActivityIndicator,
    StyleSheet
} from "react-native";
import Util from '../../scripts/Util';
import theme from '../../../src/styles/theme';
const TouchableOpacity = Util.basicUtil.TouchableOpacity();
import { connect } from "react-redux";

class CheckInOutButtons extends React.Component  {
    state = {
        checkedIn: "",
        loading:  false
    }

    async componentDidMount() {
      await this.IsUserCheckedInLocal();
    }
    
    IsUserCheckedInLocal = async () => {
        this.setState({ loading: true });
        Util.user.IsUserCheckedIn(this.props.email, this.props.buisnessUID, (boolean) => {
          this.setState({ 
            checkedIn: boolean,
            loading: false
          });
        });
    }

    render(){     
        return(
            !this.state.checkedIn == "" && !this.state.loading ?
                this.state.checkedIn == 'true' ?
                    <View style={localStyles.checkOutContainer}> 
                        <TouchableOpacity
                        onPress={async () => { 
                            this.setState({loading: true});
                            let email = this.props.email;
                            Util.user.CheckOut(email, (boolean) => {
                                this.setState({
                                    checkedIn: boolean,
                                    loading: false
                                });
                            });
                        }}
                        style={localStyles.descCont}
                        >
                        <Text style={localStyles.modalText}>Check out</Text>
                        </TouchableOpacity>
                    </View>
                :
                    <View style={localStyles.checkInContainer}>
                        <TouchableOpacity
                        onPress={() => {
                            this.setState({loading: true});
                            Util.location.GetUserLocation(async (userLocation) => {
                                let withinRadius;
                                let checkInObj = {
                                    email: this.props.email,
                                    buisnessUID: this.props.buisnessUID,
                                    latAndLong: this.props.latitude + ',' + this.props.longitude,
                                    barName: this.props.barName,
                                    address: this.props.address,
                                    phone: this.props.phone,
                                    image: this.props.source.uri,
                                    closed: this.props.closed == true ? "Yes" : "No",
                                    privacy: "Public",
                                    displayName: this.props.userData.displayName,
                                    userImage: this.props.userData.photoSource
                                }
                                withinRadius = Util.location.IsWithinRadius(checkInObj, userLocation, true);
                                if(checkInObj.closed == "No" && withinRadius) {
                                    Util.user.CheckIn(checkInObj, (boolean) => {
                                        this.setState({
                                            checkedIn: boolean,
                                            loading: false
                                        });
                                    });
                                    
                                }
                                else if (checkInObj.closed == "Yes") {
                                    Util.basicUtil.alert('Nife Message', 'This bar seems to be closed!', () => {});
                                    this.setState({
                                        loading: false
                                    });
                                }
                                else {
                                    Util.basicUtil.alert('Nife Message', 'You must be within 1 mile to check in!', () => {});
                                    this.setState({
                                        loading: false
                                    });
                                }
                            });
                        }}
                        style={localStyles.descCont}
                        >
                        <Text style={localStyles.modalText}>Public Check In</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={() => {
                            this.setState({loading: true});
                            Util.location.GetUserLocation((userLocation) => {
                                let withinRadius;
                                let checkInObj = {
                                    email: this.props.email,
                                    buisnessUID: this.props.buisnessUID,
                                    latAndLong: this.props.latitude + ',' + this.props.longitude,
                                    barName: this.props.barName,
                                    address: this.props.address,
                                    phone: this.props.phone,
                                    image: this.props.source,
                                    closed: this.props.closed == true ? "Yes" : "No",
                                    privacy: "Private",
                                    displayName: this.props.userData.displayName,
                                    userImage: this.props.userData.photoSource
                                }
                                withinRadius = Util.location.IsWithinRadius(checkInObj, userLocation, true);
                                if(checkInObj.closed == "No" && withinRadius) {
                                    Util.user.CheckIn(checkInObj, (boolean) => {
                                        this.setState({
                                            checkedIn: boolean,
                                            loading: false
                                        });
                                    });
                                }
                                else if (checkInObj.closed == "Yes") {
                                    Util.basicUtil.alert('Nife Message', 'This bar seems to be closed!', () => {});
                                    this.setState({
                                        loading: false
                                    });
                                }
                                else {
                                    Util.basicUtil.alert('Nife Message', 'You must be within 1 mile to check in!', () => {});
                                    this.setState({
                                        loading: false
                                    });
                                }
                            });
                        }}
                        style={localStyles.descCont}
                        >
                        <Text style={localStyles.modalText}>Private Check In</Text>
                        </TouchableOpacity>
                    </View> 
            :
            <View style={localStyles.checkOutContainer}>
                <ActivityIndicator 
                    size={'large'}
                    color={theme.loadingIcon.color}
                />
            </View>
        )
    }
}

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
        justifyContent:"center",
        textAlign:"center",
        alignItems:"center"
    }
  });

  function mapStateToProps(state) {
    return {
        userData: state.userData,
        feedData: state.feedData
    }
}

function mapDispatchToProps(dispatch) {
    return {
        globalRefresh: (userData, feedData) => dispatch({type: 'REFRESH', data: userData, feed: feedData})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckInOutButtons);