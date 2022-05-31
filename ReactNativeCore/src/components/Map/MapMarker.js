import {Callout, Marker} from "react-native-maps";
import theme from "../../styles/theme";
import * as React from "react";
import VisitedByCallout from "./VisitedByCallout";


export function MapMarker(props) {
    return (<Marker
        coordinate={{latitude: props.marker.coordinates.latitude, longitude: props.marker.coordinates.longitude}}
        pinColor={props.isNifeBusiness ? theme.icons.color : theme.generalLayout.secondaryColor}
    >
        <Callout
            tooltip={true}
            onPress={props.onPress}
            style={{justifyContent: "center", alignContent: "center"}}
        >
            <VisitedByCallout
                marker={props.marker}
                friendCheckIns={props.friendCheckIns}
                friendLastVisited={props.friendLastVisited}
                business={props.marker.id}
            />
        </Callout>
    </ Marker>);
}