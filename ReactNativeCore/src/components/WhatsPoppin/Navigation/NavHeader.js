import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {
    Text,
    Headline
} from 'react-native-paper';
import theme from '../../../styles/theme';
import { connect } from "react-redux";
import DrawerButton from "../../Drawer/DrawerButton";


class NavHeader extends React.Component {

    state = {
        isBusiness: this.props.userData.businessId != null
    }

    render() {
        return (
            <View style={localStyles.navHeader}>
                <View style={localStyles.navHeaderColOne}>
                    <DrawerButton
                        userPhoto={this.props.userData.photoSource}
                        drawerButtonColor={theme.generalLayout.secondaryColor}
                        onPress={this.props.navigation.openDrawer}
                    />
                </View>
                <View  style={localStyles.navHeaderColTwo}>
                    <Headline style={{
                        color: theme.generalLayout.textColor,
                        fontFamily: theme.generalLayout.fontBold,
                        width: '150%'
                    }}>
                       { this.props.type === "My Feed" ? "My Feed": "What's Poppin'" }
                    </Headline>
                </View>
                { 
                    this.props.type === "My Feed" ? 
                        <View  style={localStyles.navHeaderColTwo}>
                            <TouchableOpacity 
                                onPress={() => this.props.modalTrigger({ postModal: true })}
                                style={localStyles.StatusOverlay}
                                disabled={ this.state.isBusiness && !!this.props.businessData.verified ? true : false }
                            >
                                <Text 
                                    style={localStyles.statusButton}
                                >
                                    { this.state.isBusiness ? 'Update...' : 'Update Status' }
                                </Text>
                            </TouchableOpacity>
                        </View>
                    : 
                        null 
                }
            </View>
        )
    }
}

const localStyles = StyleSheet.create({
    navHeaderColOne: {
        width: "10.0%", 
        padding: '4%',
        margin: '3%'
    },
    navHeaderColTwo: {
        width: "37.5%", 
        padding: '2%',
        margin: '3%'
    },
    StatusOverlay: {
        position: "relative",
        backgroundColor: theme.generalLayout.backgroundColor,
        borderWidth: .5,
        borderColor: theme.generalLayout.secondaryColor,
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 8
    },
    statusButton: {
        color: theme.generalLayout.textColor,
        fontSize: 13,
        textAlign: 'center',
        fontFamily: theme.generalLayout.font
    },
    navHeader: {
        flexDirection: "row",
        borderBottomColor: theme.generalLayout.secondaryColor,
        borderBottomWidth: 1,
        width: "100%",
        textAlign: "center",
        alignItems: "center",
    },
    textInput:{
        flex: 1,
        ...Platform.select({
          ios: {
            backgroundColor: theme.generalLayout.backgroundColor,
            color: theme.generalLayout.textColor,
          },
          android:{
            backgroundColor: 'white',
            color: 'black',
          }
        }),
        width:"90%", 
        height:"80%", 
        alignSelf:"center", 
        borderRadius: 5,
        marginTop:5,
        fontFamily: theme.generalLayout.font,
      },
      buttonText:{
        color: theme.generalLayout.textColor,
        alignSelf:"center",
        paddingHorizontal: 5,
        fontFamily: theme.generalLayout.font
      },
      button:{
        borderColor: theme.generalLayout.secondaryColor,
        borderRadius:10,
        borderWidth:1,
        width:"50%",
        marginBottom: 20
      },
      viewDark:{
        flex: 1,
        height: '60%',
        backgroundColor: theme.generalLayout.backgroundColor,
        flexDirection:"column",
        justifyContent:"center",
        alignContent:"center",
        alignItems:"center",
        color: theme.generalLayout.textColor,
        borderRadius: 15,
        padding: 10,
        borderWidth: 1,
        borderColor: theme.generalLayout.secondaryColor
      },
      modalButton: {
        backgroundColor: theme.generalLayout.backgroundColor,
        borderWidth: 1,
        borderColor: theme.generalLayout.secondaryColor,
        borderRadius: 5,
        ...Platform.select({
            ios: {
                paddingVertical: 10,
                paddingHorizontal: 5,
                marginVertical: 10,
            },
            android: {
                paddingVertical: 2,
                paddingHorizontal: 5,
                marginVertical: 5,
            }
        }),
        textAlign: "center",
        color: theme.generalLayout.textColor,
        width: 200,
        fontFamily:theme.generalLayout.font
      },
      modalButtonText: {
          color: theme.generalLayout.textColor,
          fontSize: 20,
          textAlign: "center",
          fontFamily: theme.generalLayout.font
      },
      viewDark: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.generalLayout.backgroundColor,
        paddingBottom: 10
      },
});

function mapStateToProps(state){
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

export default connect(mapStateToProps, mapDispatchToProps)(NavHeader);
