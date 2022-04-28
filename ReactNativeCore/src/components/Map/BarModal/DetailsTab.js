import {ActivityIndicator, Image, Text, View} from "react-native";
import {barStyles} from "../style";
import theme from "../../../styles/theme";
import CheckInOutButtons from "../../CheckInOutBtn/CheckInOutBtn";
import React from "react";

export function DetailsTab(props) {
    return <View>
        <Image
            style={barStyles.photo}
            source={{uri: props.source.uri}}
        />

        {
                props.checkIns.length === 1 ?
                    <Text style={barStyles.ratingText}>
                        There is {props.checkIns.length} person here!
                    </Text>
                    :
                    <Text style={barStyles.ratingText}>
                        There are {props.checkIns.length} people here!
                    </Text>

        }
        {!props.userData.isBusiness ?
            <CheckInOutButtons business={props.business}  checkIns={props.checkIns}   businessUID={props.businessUID} />: null
        }
    </View>;
}