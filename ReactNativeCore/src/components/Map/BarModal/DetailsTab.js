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
            !props.checkedIn === "" || props.checkedIn === 0 ?
                props.checkedIn === 1 ?
                    <Text style={barStyles.ratingText}>
                        There is {props.checkedIn} person here!
                    </Text>
                    :
                    <Text style={barStyles.ratingText}>
                        There are {props.checkedIn} people here!
                    </Text>
                :
                <View style={barStyles.activityIndicator}>
                    <ActivityIndicator
                        size={"large"}
                        color={theme.loadingIcon.color}
                    />
                </View>
        }
        {/*{!props.userData.isBusiness ?*/}
        {/*    <View style={barStyles.panelButton}>*/}
        {/*        <CheckInOutButtons*/}
        {/*            email={props.userData.email}*/}
        {/*            barName={props.barName}*/}
        {/*            buisnessUID={props.buisnessUID}*/}
        {/*            latitude={props.latitude}*/}
        {/*            longitude={props.longitude}*/}
        {/*            address={props.address}*/}
        {/*            phone={props.phone}*/}
        {/*            source={props.source}*/}
        {/*            closed={props.closed}*/}
        {/*        />*/}
        {/*    </View*/}
        {/*    > : null}*/}
    </View>;
}