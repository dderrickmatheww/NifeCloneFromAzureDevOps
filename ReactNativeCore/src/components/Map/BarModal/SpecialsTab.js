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
                props.specials && props.specials.length > 0 ?
                    props.specials.map((special, i) => (
                        <View key={i} style={barStyles.eventCont}>
                            <Text style={barStyles.eventText}>
                                {special.description}
                            </Text>
                        </View>
                    ))
                    :
                    <View style={barStyles.noEventsCont}>
                        <Text style={barStyles.noEventsText}>No specials out yet!</Text>
                    </View>
                :
                    <View style={barStyles.noEventsCont}>
                        <Text style={barStyles.noEventsText}>This business has not registered for
                            Nife yet, let them know!</Text>
                    </View>
        }
    </ScrollView>;
}