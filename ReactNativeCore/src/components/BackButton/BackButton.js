import {localStyles} from "../Login/style";
import {Ionicons} from "@expo/vector-icons";
import theme from "../../styles/theme";
import {TouchableOpacity} from "react-native";
import React from "react";

export const BackButton = ({onPress}) => {
    return (
        <TouchableOpacity onPress={() => { onPress() }} style={localStyles.backButton}
        >
            <Ionicons
                name="chevron-back"
                color={theme.generalLayout.secondaryColor}
                size={20}
            />
        </TouchableOpacity>
    )
}