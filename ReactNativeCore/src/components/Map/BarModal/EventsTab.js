import {ActivityIndicator, ScrollView, Text, View} from "react-native";
import {barStyles} from "../style";
import theme from "../../../styles/theme";
import React from "react";

export function EventsTab(props) {
    return <View style={{flex: 1}}>
        <ScrollView style={{flex: 1}} contentContainerStyle={{
            flex: 1,
            justifyContent: "flex-start",
            alignItems: "center"
        }}>
            {
                props.businessData ?
                    props.events && props.events.length > 0?
                        props.events.map((event, i) => (
                            <View key={i} style={barStyles.eventCont}>
                                <Text style={barStyles.eventText}>
                                    {event.description}
                                </Text>
                            </View>
                        ))
                        :
                        <View style={barStyles.noEventsCont}>
                            <Text style={barStyles.noEventsText}>No events planned yet!</Text>
                        </View>
                    :
                        <View style={barStyles.noEventsCont}>
                            <Text style={barStyles.noEventsText}>This business has not registered
                                for Nife yet, let them know!</Text>
                        </View>
            }
        </ScrollView>
    </View>;
}