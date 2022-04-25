import {ActivityIndicator, ScrollView, Text, View} from "react-native";
import {barStyles} from "../style";
import theme from "../../../styles/theme";
import React from "react";

export function SpecialsTab(props) {
    return <ScrollView style={{flex: 1}} contentContainerStyle={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
    }}>
        {
            props.businessData ?
                props.businessData.specials && props.businessData.specials.length > 0 ?
                    props.businessData.specials.map((special, i) => (
                        <View key={i} style={barStyles.eventCont}>
                            <Text style={barStyles.eventText}>
                                {special.text}
                            </Text>
                        </View>
                    ))
                    :
                    <View style={barStyles.noEventsCont}>
                        <Text style={barStyles.noEventsText}>No specials out yet!</Text>
                    </View>
                :
                props.loadingBusiness ?
                    <ActivityIndicator color={theme.loadingIcon.color} size="large"/> :
                    <View style={barStyles.noEventsCont}>
                        <Text style={barStyles.noEventsText}>This business has not registered for
                            Nife yet, let them know!</Text>
                    </View>
        }
    </ScrollView>;
}