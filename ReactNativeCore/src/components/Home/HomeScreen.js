import React from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Platform,
    TouchableOpacity,
} from 'react-native';
import {
    Text,
    Headline,
    Avatar,
    Snackbar,
    Modal
} from 'react-native-paper';
import theme from '../../../src/styles/theme';
import Util from '../../scripts/Util';
import StatusModal from '../Profile/Status Modal';
// import AddressProof from '../Universal/AddressProof';
import EventsModal from '../Whats Poppin/UpdateEventsModal';
import SpecialsModal from '../Whats Poppin/UpdateSpecialsModal';
import Feed from '../Universal/Feed';
import * as ImagePicker from 'expo-image-picker';
import { connect } from "react-redux";
const defPhoto = {uri: Util.basicUtil.defaultPhotoUrl};
const win = Dimensions.get('window');

class FriendsFeed extends React.Component {
    state = {
        statusModalVisable: false,
        eventModalVisable: false,
        specialsModalVisable: false,
        modalVisible: false,
        userData: this.props.userData,
        feedData: this.props.feedData,
        businessData: this.props.business,
        snackBarVisable: false,
        menuVisable: false,
        snackBarText: "status",
        isVerified: false,
        refresh: false
    }
    componentDidMount() {
        this.setState({
            userData: this.props.userData,
            feedData: this.props.feedData,
            businessData: this.props.business,
            isVerified: this.props.user.isVerified ? this.props.user.isVerified : false
        });
    }
    onSave = (updated) => {
        let { status, events, specials} = updated;
        this.setState({
            statusModalVisable: false, 
            snackBarVisable: true
        });
        if (status) {
            this.setState({ snackBarText: "status" });
        }
        if (events) {
            this.setState({ snackBarText: "events" });
        }
        if (specials) {
            this.setState({ snackBarText: "specials" });
        }
    }
    refresh = async (userData = this.state.userData) => {
        await this.props.refresh(userData, this.props.feedData);
        this.setState({ refresh: false });
    }
    onDismiss = () => {
        this.setState({
            statusModalVisable: false,
            eventModalVisable: false,
            specialsModalVisable: false
        });
    }
    onDismissUpdate = () => {
        this.setState({ modalVisible: false });
    }
    onDismissSnackBar = () => {
        this.setState({ snackBarVisable: false });
    }
    handleUploadImage = () => {
        let userEmail = this.state.user.email;
        ImagePicker.getCameraRollPermissionsAsync()
            .then((result) => {
                if (result.status == "granted") {
                    this.setState({ uploading: true });
                    ImagePicker.launchImageLibraryAsync()
                        .then((image) => {
                            let uri = image.uri;
                            Util.business.UploadAddressProof(uri, userEmail, (resUri) => {
                                Util.business.SendProofEmail(userEmail, resUri);
                                Util.user.UpdateUser(userEmail, { isVerified: true });
                                let userData = this.state.userData;
                                userData.isVerified = true;
                                this.setState({
                                    userData: userData,
                                    isVerified: true
                                });
                                this.refresh({ userData });
                            }, true);
                        })
                        .catch((error) => {
                            Util.basicUtil.Alert('Function HomeScreen/handleUploadImage - Error message:', error.message, null);
                            Util.basicUtil.consoleLog('HomeScreen/handleUploadImage', false);
                        });
                } 
                else {
                    this.setState({
                        isVerified: false
                    });
                }
            });
    }
    render() {
        return (
            <View style={localStyles.safeAreaContainer}>
                <View style={localStyles.navHeader}>
                    <TouchableOpacity onPress={this.props.onDrawerPress} style={localStyles.drawerBtn}>
                        <Avatar.Image
                            source={this.state.userData && this.state.userData.photoSource !== 'Unknown' ? {
                                uri: this.state.userData.photoSource
                            } : defPhoto}
                            size={35}
                        />
                    </TouchableOpacity>
                    <View style={{width: "100%"}}>
                        <Headline style={{
                            color: theme.generalLayout.textColor,
                            fontFamily: theme.generalLayout.fontBold,
                            marginLeft: '5%',
                            marginBottom: '2%'
                        }}>Your Feed</Headline>
                    </View>
                    {
                        !this.state.userData.isBusiness ?
                            <TouchableOpacity onPress={() => this.setState({statusModalVisable: true})}
                                              style={localStyles.StatusOverlay}>
                                <Text style={localStyles.statusButton}>Update Status</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => this.setState({modalVisible: true})}
                                              style={localStyles.StatusOverlay}>
                                <Text style={localStyles.statusButton}>Update...</Text>
                            </TouchableOpacity>
                    }
                </View>
                <Feed 
                    isFriendFeed={true}
                    favorites={this.props.favorites}
                    business={this.props.business}
                />
                {
                    this.state.modalVisible ?
                        <Modal
                            contentContainerStyle={{
                                width: "50%",
                                height: "25%",
                                borderRadius: 10,
                                alignSelf: "center",
                                flexDirection: "column",
                                alignItems: "center",
                                backgroundColor: theme.generalLayout.backgroundColor
                            }}
                            visible={this.state.modalVisible}
                            dismissable={true}
                            onDismiss={() => this.onDismissUpdate()}
                        >
                            <View style={localStyles.viewDark}>
                                <TouchableOpacity onPress={() => this.setState({ statusModalVisable: true })}
                                                  style={localStyles.modalButton}>
                                    <Text style={localStyles.modalButtonText}>Update Status</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({ eventModalVisable: true })}
                                                  style={localStyles.modalButton}>
                                    <Text style={localStyles.modalButtonText}>Update Events</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({ specialsModalVisable: true })}
                                                  style={localStyles.modalButton}>
                                    <Text style={localStyles.modalButtonText}>Update Specials</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>
                    :
                        null
                }
                {/* Address model for the proof of address */}
                {/* {
                    !this.state.isVerified && this.state.userData.isBusiness ?
                        <AddressProof
                            isVisible={!this.state.userData.isVerified}
                            user={this.state.userData}
                            onDismiss={() => this.onDismiss()}
                            onSave={() => this.onSave({ status: true })}
                            refresh={this.refresh}
                            uploadImage={this.handleUploadImage}
                        >
                        </AddressProof>
                    :
                        null
                } */}
                {
                    this.state.statusModalVisable ?
                        <StatusModal
                            isVisible={this.state.statusModalVisable}
                            user={this.state.userData}
                            onDismiss={() => this.onDismiss()}
                            onSave={() => this.onSave({ status: true })}
                        >
                        </StatusModal>
                    :
                        null
                }
                {
                    this.state.eventModalVisable && this.state.businessData ?
                        <EventsModal
                            isVisible={this.state.eventModalVisable}
                            user={this.state.userData}
                            onDismiss={() => this.onDismiss()}
                            onSave={() => this.onSave({events: true})}
                            refresh={this.refresh}
                            business={this.state.businessData}
                        >
                        </EventsModal>
                    :
                        null
                }
                {
                    this.state.specialsModalVisable && this.state.businessData ?
                        <SpecialsModal
                            isVisible={this.state.specialsModalVisable}
                            user={this.state.userData}
                            onDismiss={() => this.onDismiss()}
                            onSave={() => this.onSave({specials: true})}
                            refresh={this.refresh}
                            business={this.state.businessData}
                        >
                        </SpecialsModal>
                    :
                        null
                }
                <Snackbar
                    style={{zIndex: 3, elevation: 100}}
                    visible={this.state.snackBarVisable} 
                    onDismiss={() => this.onDismissSnackBar()}
                    action={{
                        label: 'Close',
                        onPress: () => {
                            this.onDismissSnackBar()
                        },
                    }}
                    style={{position: 'absolute', bottom: 725}}
                >
                    Updated your {this.state.snackBarText}!
                </Snackbar>
            </View>
        )
    }
}

const localStyles = StyleSheet.create({
    scrollContent: {
        justifyContent: "center",
        alignItems: "center",
        width: "98%",
        ...Platform.select({
                ios: {
                    paddingBottom: 120,
                },
                android: {
                    paddingBottom: 120,
                },
        })
    },
    viewDark: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.generalLayout.backgroundColor,
        paddingBottom: 10
    },
    modalButton: {
        backgroundColor: theme.generalLayout.backgroundColor,
        borderWidth: 1,
        borderColor: theme.generalLayout.secondaryColor,
        borderRadius: 5,
        paddingVertical: 2,
        paddingHorizontal: 5,
        textAlign: "center",
        marginVertical: 5,
        fontFamily: theme.generalLayout.font
    },
    modalButtonText: {
        color: theme.generalLayout.secondaryColor,
        fontSize: 20,
        textAlign: "center",
        fontFamily: theme.generalLayout.font
    },
    StatusOverlay: {
        position: "relative",
        right: 150,
        backgroundColor: theme.generalLayout.backgroundColor,
        borderWidth: .5,
        borderColor: theme.generalLayout.secondaryColor,
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 8
    },
    Caption: {
        color: theme.generalLayout.textColor,
        opacity: 0.60,
        fontFamily: theme.generalLayout.font
    },
    statusButton: {
        color: theme.generalLayout.textColor,
        fontSize: 11,
        fontFamily: theme.generalLayout.font
    },
    Paragraph: {
        color: theme.generalLayout.textColor,
        fontSize: 12,
        marginTop: -10,
        marginBottom: 10,
        fontFamily: theme.generalLayout.font
    },
    displayName: {
        color: theme.generalLayout.textColor,
        left: 60,
        top: -45,
        fontSize: 15,
        fontWeight: "bold",
        fontFamily: theme.generalLayout.fontBold
    },
    feedType: {
        color: theme.generalLayout.textColor,
        left: 60,
        top: -50,
        fontSize: 12,
        opacity: 0.60
    },
    feedDataRow: {
        flex: 1,
        backgroundColor: theme.generalLayout.backgroundColor,
        borderColor: theme.generalLayout.secondaryColor,
        color: theme.generalLayout.textColor,
        borderRadius: 10,
        borderWidth: 1,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginVertical: 3,
        width: "100%",
    },
    emptyPoppinFeed: {
        color: theme.generalLayout.textColor,
        fontSize: 16,
        padding: 20,
        textAlign: "center",
        justifyContent: "center",
        fontFamily: theme.generalLayout.font
    },
    navHeader: {
        marginTop: 12.5,
        flexDirection: "row",
        borderBottomColor: theme.generalLayout.secondaryColor,
        borderBottomWidth: 1,
        width: "98%",
        textAlign: "center",
        alignItems: "center",
    },
    DrawerOverlay: {
        alignSelf: "flex-start",
        opacity: 0.75,
        backgroundColor: theme.generalLayout.backgroundColor,
        borderRadius: 10,
        paddingVertical: 0,
    },
    ScrollView: {
        flex: 1,
        width: "100%",
        paddingHorizontal: "5%",
        paddingBottom: 10,
        paddingTop: 10,
    },
    drawerBtn: {
        marginTop: '1%',
        marginLeft: '3%',
        marginBottom: '3%',
        borderRadius: 70
    },
    safeAreaContainer: {
        flex: 1,
        paddingTop: "7%",
        backgroundColor: theme.generalLayout.backgroundColor,
        width: '100%'
    },
});

function mapStateToProps(state){
    return {
      userData: state.userData,
      feedData: state.feedData,
      friendRequests: state.friendRequests,
      friendData: state.friendData,
      businessData: state.businessData,
    }
  }
  
  function mapDispatchToProps(dispatch){
    return {
      refresh: (userData) => dispatch({ type:'REFRESH', data: userData, feed: feed }),
      yelpDataRefresh: (data) => dispatch({type:'YELPDATA', data: data}),
    }
  }


export default connect(mapStateToProps, mapDispatchToProps)(FriendsFeed);
