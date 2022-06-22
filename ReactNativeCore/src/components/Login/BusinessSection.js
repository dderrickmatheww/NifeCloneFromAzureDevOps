import React, {Component} from "react";
import {Image, Text, View, TouchableOpacity} from "react-native";
import * as PropTypes from "prop-types";
import {localStyles} from "./style";
import Util, {defaultPhotoUrl} from "../../utils/util";
const defPhoto = { uri: defaultPhotoUrl };

export class BusinessSection extends Component {
    render() {
        return <>
            <View style={localStyles.subHeaderContainer}>
                <Text style={localStyles.subHeaderText}>
                    Businesses
                </Text>
            </View>
            <View style={localStyles.nifeBuisButtonContainer}>
                <TouchableOpacity style={localStyles.nifeBusLoginBtn} onPress={this.props.onPress}>
                    <Text style={localStyles.loggedOutText}>Login/Sign-up with Nife</Text>
                    <Image
                        style={localStyles.Logo}
                        source={defPhoto}
                    />
                </TouchableOpacity>
            </View>
        </>;
    }
}

BusinessSection.propTypes = {onPress: PropTypes.func};