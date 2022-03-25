import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions, 
    Platform
} from 'react-native';
import { 
    Headline,
    Avatar,
    Snackbar
} from 'react-native-paper';
import theme from '../../../src/styles/theme';
import Util from '../../scripts/Util';
import StatusModal from '../Profile/Status Modal';
import Feed from '../Universal/Feed';
import { connect } from "react-redux";
import * as ImagePicker from 'expo-image-picker';
const defPhoto = { uri: Util.basicUtil.defaultPhotoUrl };
const TouchableOpacity = Util.basicUtil.TouchableOpacity();
const screen = Dimensions.get("window");

 class FriendsFeed extends React.Component  {
    state = {
        modalVisable: false,
        userData: null,
        friendData: null,
        feedData: null,
        snackBarVisable: false,
        refresh: false,
    }
    componentDidMount() {
        this.setState({
            userData: this.props.user,
            friendData: this.props.friends
        });
    }
    onSave = (updated) => {
        let { status, events, specials} = updated;
        this.setState({
            modalVisable: false, 
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
    onDismiss = () => {
        this.setState({
            modalVisable: false
        });
    }
    onDismissSnackBar = () => {
        this.setState({
            snackBarVisable: false
        });
    }
    refresh = async (userData) => {
        await this.props.refresh(userData, this.props.feedData);
        this.setState({ refresh: false });
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
                            Util.basicUtil.alert('Function HomeScreen/handleUploadImage - Error message:', error.message, null);
                            Util.basicUtil.logger('HomeScreen/handleUploadImage', false);
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
                                uri:  this.state.userData.photoSource  
                            } : defPhoto}
                            size={35}
                        />
                    </TouchableOpacity> 
                    <View style={{width:"100%"}}>
                        <Headline style={{ color: theme.generalLayout.textColor, fontFamily: theme.generalLayout.fontBold, marginLeft: '5%', marginBottom: '2%'}}>Friend's Feed</Headline>
                    </View>
                    <TouchableOpacity onPress={() => this.setState({ modalVisable: true })} style={localStyles.StatusOverlay}>
                        <Text style={localStyles.statusButton}>Update Status</Text>
                    </TouchableOpacity> 
                </View>
                <Feed 
                    isFriendFeed={false}
                    favorites={this.props.favorites}
                    business={this.props.business}
                />
               {
                   this.state.modalVisable ?
                    <StatusModal
                        isVisible={this.state.modalVisable}
                        user={this.state.userData}
                        refresh={this.refresh}
                        onDismiss={this.onDismiss}
                        onSave={() => this.onSave({ status: true })}
                    />
                  :
                    null
               }
               <Snackbar
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
                    Updated your status!
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
        borderWidth: 1,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginVertical: 2,
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
    },
});

function mapStateToProps(state){
    return{
        user: state.userData,
        friendRequests: state.friendRequests,
        friends: state.friendData,
        business: state.businessData,
    }
}

function mapDispatchToProps(dispatch){
    return {
        refresh: (userData, feedData) => dispatch({ type:'REFRESH', data: userData, feed: feedData })
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(FriendsFeed);

  