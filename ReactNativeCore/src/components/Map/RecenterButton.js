import {TouchableOpacity} from "react-native";
import {localStyles} from "./style";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import theme from "../../styles/theme";
import * as React from "react";

export function RecenterButton(props) {
    return <TouchableOpacity onPress={props.onPress} style={localStyles.center_overlay}>
        <MaterialCommunityIcons
            name="navigation"
            color={theme.GOLD}
            size={35}
        />
    </TouchableOpacity>;
}
