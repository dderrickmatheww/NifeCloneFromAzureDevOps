import {ActivityIndicator, Image, Text, View} from "react-native";
import {barStyles} from "../style";
import theme from "../../../styles/theme";
import CheckInOutButtons from "../../CheckInOutBtn/CheckInOutBtn";
import React from "react";

export function DetailsTab(props) {

    const determineMessage = (checkIns) =>{
        if(checkIns === 1){
            return 'There is 1 person here!'
        } else {
            return `There are ${checkIns} people here!`
        }
    }
    return <View>
        <Image
            style={barStyles.photo}
            source={{uri: props.source.uri}}
        />

        <Text style={barStyles.ratingText}>
            {determineMessage(props.checkIns)}
        </Text>

        {!props.userData.isBusiness ?
            <CheckInOutButtons business={props.business} checkIns={props.userCheckIns}
                               businessUID={props.businessUID} handleCheckIns={props.handleCheckIns}/> : null
        }
    </View>;
}