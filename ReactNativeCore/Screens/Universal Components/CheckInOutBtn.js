import React  from "react";
import {
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet
} from "react-native";
import Util from '../../scripts/Util';
import theme from '../../Styles/theme';

export default class CheckInOutButtons extends React.Component  {
    state = {
        checkedIn: "",
        loading:  false
    }

    closeModal = () => {
        this.setState({isVisible: false});
    }

    async componentDidMount() {
      await this.IsUserCheckedInLocal();
    }
    
    IsUserCheckedInLocal = async () => {
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
                    <View> 
                        <TouchableOpacity
                        onPress={async () => { 
                            this.setState({loading: true});
                            let email = this.props.email;
                            Util.user.CheckOut(email, (boolean) => {
                                this.setState({checkedIn: boolean});
                                this.setState({loading: false});
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
                            Util.location.GetUserLocation((userLocation) => {
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
                                    privacy: "Public"
                                }
                                withinRadius = Util.location.IsWithinRadius(checkInObj, userLocation, true);
                                if(checkInObj.closed == "No" && withinRadius) {
                                    Util.user.CheckIn(checkInObj, (boolean) => {
                                        this.setState({checkedIn: boolean});
                                        this.setState({loading: false});
                                    });
                                    
                                }
                                else if (checkInObj.closed == "Yes") {
                                    alert('This bar seems to be closed!');
                                }
                                else {
                                    alert('You must be within 1 mile to check in!');
                                }
                            });
                        }}
                        style={localStyles.descCont}
                        >
                        <Text style={localStyles.modalText}>Check in publicly</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={() => {
                            this.setState({loading: true});
                            Util.location.GetUserLocation((userLocation) => {
                                let checkInObj = {
                                    email: this.props.email,
                                    buisnessUID: this.props.buisnessUID,
                                    latAndLong: this.props.latitude + ',' + this.props.longitude,
                                    barName: this.props.barName,
                                    address: this.props.address,
                                    phone: this.props.phone,
                                    image: this.props.source,
                                    closed: this.props.closed == true ? "Yes" : "No",
                                    privacy: "Friends Only"
                                }
                                withinRadius = Util.location.IsWithinRadius(checkInObj, userLocation, true);
                                if(checkInObj.closed == "No" && withinRadius) {
                                    Util.user.CheckIn(checkInObj, (boolean) => {
                                        this.setState({checkedIn: boolean});
                                        this.setState({loading: false});
                                    });
                                }
                                else if (checkInObj.closed == "Yes") {
                                    alert('This bar seems to be closed!');
                                }
                                else {
                                    alert('You must be within 1 mile to check in!');
                                }
                            });
                        }}
                        style={localStyles.descCont}
                        >
                        <Text style={localStyles.modalText}>Check in w/friends</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={() => {
                            Util.location.GetUserLocation((userLocation) => {
                                this.setState({loading: true});
                                let checkInObj = {
                                    email: this.props.email,
                                    buisnessUID: this.props.buisnessUID,
                                    latAndLong: this.props.latitude + ',' + this.props.longitude,
                                    barName: this.props.barName,
                                    address: this.props.address,
                                    phone: this.props.phone,
                                    image: this.props.source,
                                    closed: this.props.closed == true ? "Yes" : "No",
                                    privacy: "Private"
                                }
                                withinRadius = Util.location.IsWithinRadius(checkInObj, userLocation, true);
                                if(checkInObj.closed == "No" && withinRadius) {
                                    Util.user.CheckIn(checkInObj, (boolean) => {
                                        this.setState({checkedIn: boolean});
                                        this.setState({loading: false});
                                    });
                                }
                                else if (checkInObj.closed == "Yes") {
                                    alert('This bar seems to be closed!');
                                }
                                else {
                                    alert('You must be within 1 mile to check in!');
                                }
                            });
                        }}
                        style={localStyles.descCont}
                        >
                        <Text style={localStyles.modalText}>Check in privatly</Text>
                        </TouchableOpacity>
                    </View> 
            :
            <View style={localStyles.activityIndicator}>
                <ActivityIndicator 
                    size={'large'}
                    color={theme.LIGHT_PINK}
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
      backgroundColor: theme.DARK
    },
    descCont: {
      width: '33%',
      borderRadius: 20,
      padding: '1%',
      borderColor: "black",
      borderWidth: 1,
      justifyContent: 'center', 
      alignItems: 'center' ,
      backgroundColor:"#BEB2C8",
      textAlign:"center",
      margin:"1%",
    },
    modalText:{
      width: '100%',
      color: "#20232a",
      padding: 5,
      fontWeight:"bold",
      justifyContent: 'center', 
      alignItems: 'center' ,
      textAlign:"center",
      fontSize: 12
    },
    checkInContainer: {
        flexDirection:"row",
        width:"90%",
        textAlign:"center",
        alignItems:"center"
    }
  });