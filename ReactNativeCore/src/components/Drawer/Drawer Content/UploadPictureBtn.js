import {ActivityIndicator, View, TouchableOpacity} from "react-native";
import theme from "../../../styles/theme";
import {Avatar} from "react-native-paper";
import React from "react";
import {styles} from "./style";
import {defaultPhotoUrl} from "../../../utils/util";

export function UploadPictureBtn(props) {
    return <TouchableOpacity style={styles.NoAvatarButton}
                             onPress={props.onPress}
    >
        {
            props.uploading ?
                <View style={{alignItems: "center", padding: "2%"}}>
                    <ActivityIndicator color={theme.loadingIcon.color} size={"large"}/>
                </View>
                :
                <View style={{alignItems: "center"}}>
                    <Avatar.Image
                        source={{uri: defaultPhotoUrl}}
                        size={100}
                    />
                </View>
        }
    </TouchableOpacity>;
}
