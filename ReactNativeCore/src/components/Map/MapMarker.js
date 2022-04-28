import {Callout, Marker} from "react-native-maps";
import theme from "../../styles/theme";
import * as React from "react";
import VisitedByCallout from "./VisitedByCallout";

export function MapMarker(props) {
    return <Marker
        coordinate={{latitude: props.marker.coordinates.latitude, longitude: props.marker.coordinates.longitude}}

        pinColor={theme.generalLayout.secondaryColor} // this.state.nifeBusinesses.includes(marker.id) ? theme.icons.color :

        calloutOffset={{x: 2, y: 0.25}}
        calloutAnchor={{x: 2, y: 0.25}}
    >
        <Callout
            tooltip={true}
            onPress={props.onPress}
            style={{justifyContent: "center", alignContent: "center"}}
        >
            <VisitedByCallout marker={props.marker}/>
        </Callout>
    </ Marker>;
}