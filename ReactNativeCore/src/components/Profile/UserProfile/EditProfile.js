import React, {Component} from 'react';
import {View, Text, ActivityIndicator, StyleSheet, ScrollView, Platform, Picker, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
    TextInput,
    Surface,
    Chip
} from 'react-native-paper';
import {connect} from "react-redux";
import theme from "../../../styles/theme";
import {styles} from "../../../styles/style";
import DrawerButton from "../../Drawer/DrawerButton";
import {addFavoriteDrink, removeFavoriteDrink, updateOrDeleteFavorites, updateUser} from "../../../utils/api/users";
import Clipboard from "../../Clipboard/Clipboard";
import {Loading} from "../../Loading";


class EditProfile extends Component {

    state = {
        dateOfBirth: this.props.userData.dateOfBirth,
        maxDateValue: null,
        gender: this.props.userData.gender ? this.props.userData.gender : 'Other',
        sexualOrientation: this.props.userData.sexualOrientation ? this.props.userData.sexualOrientation : 'Other',
        bio: this.props.userData.bio ? this.props.userData.bio : "This user has no bio!",
        favoriteDrinks: this.props.userData.favoriteDrinks && this.props.userData.favoriteDrinks > 0 ? this.props.userData.favoriteDrinks : [],
        showDatePicker: false,
        doneLoading: false,
        favoriteBars: null,
        faveCount: 0,
        dropdownTextColor: null,
        user_favorite_places: null,
        user_favorite_drinks: null,
        drinksLoading:false,
    }

    setMaxDate = () => {
        let maxDateValue = new Date();
        maxDateValue = maxDateValue.setFullYear(maxDateValue.getFullYear() - 18);
        maxDateValue = new Date(maxDateValue);
        return maxDateValue
    }


    getDropdownColor = () => {
        this.setState({
            dropdownTextColor: {
                ...Platform.select({
                    ios: 'white',
                    android: 'black'
                })
            }
        })
    }


    onDOBChange = (event, dateOfBirth) => {
        this.setState({dateOfBirth, showDatePicker: false});
    }

    onGenderChange = (gender) => {
        this.setState({gender});
    }

    onSexualOrientationChange = (sexualOrientation) => {
        this.setState({sexualOrientation});
    }

    onNameChange = (displayName) => {
        this.setState({displayName});
    }

    onBioChange = (bio) => {
        this.setState({bio});
    }

    onFavoriteDrinkChange = (drinks) => {
    }

    deleteFavBar = async (favorite) => {
        await updateOrDeleteFavorites(
            favorite.user,
            favorite.business,
            favorite.businessName,
            false,
            favorite.id,
        )
        const user_favorite_places = this.state.user_favorite_places.filter(place => place.id !== favorite.id);
        this.setState({user_favorite_places})
    }

    onSave = async () => {
        const {dateOfBirth, gender, sexualOrientation, bio, displayName} = this.state;
        await updateUser({
            email: this.props.userData.email,
            dateOfBirth,
            gender,
            sexualOrientation,
            bio,
            displayName
        })
        this.props.navigation.navigate("Profile", {screen: "UserProfile"});
    }

    onCancel = async () => {
        this.props.navigation.navigate("Profile", {screen: "UserProfile"});
    }

    deleteFavoriteDrink = async (id) => {
        this.setState({drinksLoading: true})
        await removeFavoriteDrink(id)
        const user_favorite_drinks = this.state.user_favorite_drinks.filter(drink => drink.id !== id)
        this.setState({user_favorite_drinks, drinksLoading: false})
    }

    addFavoriteDrink = async (newDrink) => {
        this.setState({drinksLoading: true})
        const {drink} = await addFavoriteDrink(newDrink)
        const user_favorite_drinks = this.state.user_favorite_drinks
        user_favorite_drinks.push(drink);
        this.setState({user_favorite_drinks, drinksLoading: false})
    }

    //gets user and friend data
    async componentDidMount() {
        await this.setMaxDate();
        this.setState({doneLoading: true, ...this.props.userData})
    }

    render() {
        return (
            this.state.doneLoading ?
                <View style={localStyles.loggedInContainer}>
                    <ScrollView contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}}
                                style={localStyles.mainCont}>
                        {/* Input Area */}
                        <Text style={{
                            fontSize: 16,
                            color: theme.generalLayout.textColor,
                            marginBottom: 15,
                            fontFamily: theme.generalLayout.font
                        }}>
                            All information is optional and can be hidden via privacy settings!
                        </Text>
                        {/* Display name */}
                        <View style={localStyles.fieldCont}>
                            <Text style={localStyles.fieldLabel}>
                                Display Name:
                            </Text>
                            <TextInput theme={{colors: {text: theme.generalLayout.textColor}}} numberOfLines={2}
                                       mode={"flat"}
                                       label=""
                                       placeholder={"What should we call you?"}
                                       onChangeText={text => this.onNameChange(text)}
                                       placeholderTextColor={theme.generalLayout.textColor}
                                       value={this.state.displayName}
                                       style={{
                                           backgroundColor: theme.generalLayout.backgroundColor,
                                           color: theme.generalLayout.textColor,
                                           width: "100%",
                                           alignSelf: "center",
                                           textAlign: "left",
                                           paddingHorizontal: 10,
                                           paddingVertical: 5,
                                           borderRadius: 5,
                                           borderColor: theme.generalLayout.secondaryColor,
                                           borderWidth: 1
                                       }}>
                            </TextInput>
                        </View>

                        {/* DOB */}
                        <View style={localStyles.fieldCont}>
                            <View style={{flexDirection: "row", width: "100%", alignItems: 'center'}}>
                                <Text style={localStyles.fieldLabel}>
                                    Date of Birth:
                                </Text>
                                <Text style={{
                                    color: theme.generalLayout.textColor,
                                    fontFamily: theme.generalLayout.font,
                                    fontSize: 14,
                                    marginBottom: 5,
                                    marginLeft: '15.5%'
                                }}>
                                    {this.state.dateOfBirth ? new Date(this.state.dateOfBirth).toLocaleDateString() : "None given."}
                                </Text>
                                <TouchableOpacity style={{alignSelf: "flex-end", marginLeft: '16.5%', paddingBottom: 5}}
                                                  onPress={() => this.state.showDatePicker ? this.setState({showDatePicker: false}) : this.setState({showDatePicker: true})}
                                >
                                    <Ionicons name="md-calendar" size={24} color={theme.icons.color}/>
                                </TouchableOpacity>
                            </View>

                            {
                                this.state.showDatePicker && (
                                    <View style={[localStyles.fieldCont, {alignContent: 'center'}]}>
                                        <Text style={{
                                            fontSize: 12,
                                            color: theme.GOLD,
                                            marginBottom: 15,
                                            fontFamily: theme.generalLayout.font
                                        }}>
                                            Click the date again to dismiss!
                                        </Text>
                                        <DateTimePicker
                                            mode={"date"}
                                            textColor={theme.generalLayout.textColor}
                                            value={this.state.dateOfBirth ? new Date(this.state.dateOfBirth) : new Date()}
                                            maximumDate={this.setMaxDate()}
                                            display={"spinner"}
                                            onChange={(event, selectedDate) => this.onDOBChange(event, selectedDate)}
                                        />
                                    </View>
                                )
                            }
                        </View>
                        {/*Gender*/}
                        <View style={localStyles.fieldCont}>
                            <Text style={localStyles.fieldLabel}>
                                Gender:
                            </Text>
                            <Surface style={localStyles.surface}>
                                <Picker
                                    mode={"dropdown"}
                                    style={localStyles.dropdown}
                                    selectedValue={this.state.gender ? this.state.gender : "Other"}
                                    onValueChange={(value) => this.onGenderChange(value)}
                                    itemStyle={{color: 'black', backgroundColor: theme.generalLayout.backgroundColor,}}
                                >
                                    <Picker.Item color={Platform.select({
                                        ios: theme.generalLayout.textColor,
                                        android: 'black'
                                    })}
                                                 style={{color: 'black'}} label="Male" value="male"
                                    />
                                    <Picker.Item color={Platform.select({
                                        ios: theme.generalLayout.textColor,
                                        android: 'black'
                                    })} label="Female" value="female"/>
                                    <Picker.Item color={Platform.select({
                                        ios: theme.generalLayout.textColor,
                                        android: 'black'
                                    })} label="Other" value="other"/>
                                </Picker>
                            </Surface>

                        </View>
                        {/*Orientation*/}
                        <View style={localStyles.fieldCont}>
                            <Text style={localStyles.fieldLabel}>
                                Sexual Orientation:
                            </Text>
                            <Surface style={localStyles.surface}>
                                <Picker
                                    mode={"dropdown"}
                                    selectedValue={this.state.sexualOrientation ? this.state.sexualOrientation : "Other"}
                                    style={localStyles.dropdown}
                                    onValueChange={(value) => this.onSexualOrientationChange(value)}
                                    itemStyle={{backgroundColor: theme.DARK}}
                                >
                                    <Picker.Item color={Platform.select({
                                        ios: theme.generalLayout.textColor,
                                        android: 'black'
                                    })} style={{backgroundColor: theme.DARK}} label="Straight" value="straight"/>
                                    <Picker.Item color={Platform.select({
                                        ios: theme.generalLayout.textColor,
                                        android: 'black'
                                    })} label="Homosexual/Gay/Lesbian" value="homosexual"/>
                                    <Picker.Item color={Platform.select({
                                        ios: theme.generalLayout.textColor,
                                        android: 'black'
                                    })} label="Bi-sexual/Fluid" value="bi-sexual"/>
                                    <Picker.Item color={Platform.select({
                                        ios: theme.generalLayout.textColor,
                                        android: 'black'
                                    })} label="Other" value="other"/>
                                </Picker>
                            </Surface>
                        </View>
                        {/*Bio*/}
                        <View style={localStyles.fieldCont}>
                            <Text style={localStyles.fieldLabel}>
                                Bio:
                            </Text>
                            <TextInput theme={{colors: {text: theme.generalLayout.textColor}}} numberOfLines={2}
                                       mode={"flat"}
                                       label=""
                                       placeholder={"Tell us about yourself"}
                                       onChangeText={text => this.onBioChange(text)}
                                       value={this.state.bio ? this.state.bio : ''}
                                       style={{
                                           backgroundColor: theme.generalLayout.backgroundColor,
                                           color: theme.generalLayout.textColor,
                                           fontFamily: theme.generalLayout.font,
                                           width: "100%",
                                           alignSelf: "center",
                                           textAlign: "left",
                                           paddingHorizontal: 10,
                                           paddingVertical: 5,
                                           borderRadius: 5,
                                           borderColor: theme.generalLayout.secondaryColor,
                                           borderWidth: 1
                                       }}>
                            </TextInput>
                        </View>
                        {/*Drinks*/}
                        <View style={localStyles.fieldCont}>
                            <Text style={localStyles.fieldLabel}>
                                Favorite Drinks:
                            </Text>
                            {/* index one to on change */}
                            {!this.state.drinksLoading ?
                                <Clipboard
                                    data={this.state.user_favorite_drinks}
                                    editable={true}
                                    onDelete={this.deleteFavoriteDrink}
                                    onAdd={this.addFavoriteDrink}
                                /> : <Loading />}

                        </View>
                    </ScrollView>
                    {/* buttons at the top */}
                    <TouchableOpacity style={localStyles.SaveOverlay}
                                      onPress={() => this.onSave()}
                    >
                        <Ionicons name="ios-checkmark-circle-outline" size={30} color={theme.icons.color}/>
                    </TouchableOpacity>

                    <TouchableOpacity style={localStyles.CancelOverlay}
                                      onPress={() => this.onCancel()}
                    >
                        <Ionicons name="ios-close-circle-outline" size={30} color={theme.icons.color}/>
                    </TouchableOpacity>
                    <DrawerButton userPhoto={this.props.userData.photoSource} drawerButtonColor={theme.icons.color}
                                  onPress={this.props.onDrawerPress}/>
                </View>
                :
                ///////////////////////////////////////////
                <View style={styles.viewDark}>
                    <ActivityIndicator size="large" color={theme.loadingIcon.color}/>
                    <DrawerButton userPhoto={this.props.userData.photoSource} drawerButtonColor={theme.icons.color}
                                  onPress={this.props.onDrawerPress}/>
                </View>

        );
    }
}

function mapStateToProps(state) {
    return {
        userData: state.userData,
        requests: state.friendRequests,
        friends: state.friendData,
        businessData: state.businessData,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        refresh: (userData) => dispatch({type: 'REFRESH', data: userData})
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);


const localStyles = StyleSheet.create({
    dropdown: {
        ...Platform.select({
            ios: {backgroundColor: theme.generalLayout.backgroundColor, width: "100%", alignSelf: "center"},
            android: {backgroundColor: 'white', width: "100%", alignSelf: "center"}
        })
    },
    fieldLabel: {
        fontSize: 18,
        color: theme.TEXT_COLOR,
        marginBottom: 5,
        fontWeight: "bold",
        fontFamily: theme.generalLayout.font
    },
    surface: {
        width: "auto",
        elevation: 10,
        borderColor: theme.generalLayout.secondaryColor,
        borderWidth: 1,
        borderRadius: 3
    },
    fieldCont: {
        width: '100%',
        margin: '5%'
    },
    mainCont: {
        width: "95%",
        marginTop: '30%',
        marginBottom: '10%'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: theme.generalLayout.backgroundColor,
        elevation: 4
    },
    SaveOverlay: {
        position: 'absolute',
        top: "6%",
        left: "90.5%",
        backgroundColor: theme.generalLayout.backgroundColor,
        borderRadius: 10,
        paddingVertical: 0,
    },
    CancelOverlay: {
        position: 'absolute',
        top: "6%",
        left: "80%",
        backgroundColor: theme.generalLayout.backgroundColor,
        borderRadius: 10,
        paddingVertical: 0,
    },
    AddFriendOverlay: {
        position: 'absolute',
        top: "6%",
        left: "70%",
        opacity: 0.75,
        backgroundColor: theme.generalLayout.backgroundColor,
        borderRadius: 10,
        paddingVertical: 0,
    },

    LocAndFriends: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "stretch",
        width: "90%"
    },
    loggedInContainer: {
        backgroundColor: theme.generalLayout.backgroundColor,
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    loggedInSubView: {
        flex: 1,
        backgroundColor: theme.generalLayout.backgroundColor,
        width: "100%",
        justifyContent: "center",
        marginBottom: "10%",
        alignItems: "center",
    },
    HeaderCont: {
        flex: 1,
        backgroundColor: theme.generalLayout.backgroundColor,
        width: "100%",
        maxHeight: "12%",
        justifyContent: "flex-end",
        alignItems: "center",
        borderBottomColor: theme.generalLayout.secondaryColor,
        borderBottomWidth: 2,

    },
    profilePic: {
        width: 75,
        height: 75,
        borderRadius: 50,
        marginBottom: "5%"
    },
    friendPic: {
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    friendCont: {
        flexDirection: "row",
        borderBottomColor: theme.generalLayout.secondaryColor,
        borderBottomWidth: 1,
    },
    name: {
        fontSize: 18,
        color: theme.generalLayout.textColor,
        fontFamily: theme.generalLayout.font,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: '.5%',
        marginLeft: '2.5%',
        width: "100%"
    },
    FriendCount: {
        fontSize: 15,
        marginTop: "2%",
        marginBottom: "1%",
        color: theme.generalLayout.textColor,
        fontFamily: theme.generalLayout.font,
        justifyContent: 'center',
        alignItems: 'center'
    },
    Header: {
        fontSize: 20,
        fontWeight: "bold",
        color: theme.generalLayout.textColor,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: theme.generalLayout.font
    },
    ScrollView: {
        flex: 1,
        width: "100%",
        borderLeftWidth: 2,
        borderLeftColor: theme.generalLayout.secondaryColor,
        borderRightWidth: 2,
        borderRightColor: theme.generalLayout.secondaryColor,
        paddingHorizontal: "5%",
        paddingBottom: "1%"
    }
});