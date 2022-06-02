import {View} from "react-native";
import {Avatar, Caption, Paragraph, Title} from "react-native-paper";
import theme from "../../../styles/theme";
import React from "react";
import Util, {defaultPhotoUrl} from "../../../utils/util";
import {UploadPictureBtn} from "./UploadPictureBtn";
import {styles} from "./style";
const TouchableOpacity = Util.basicUtil.TouchableOpacity();

export function UserInfoSection(props) {
    return <View style={styles.userInfoSection}>
        <View style={{flexDirection: "row", marginTop: 15}}>
            {
                props.user.photoSource ?
                    <Avatar.Image
                        source={{uri: props.user.photoSource}}
                        size={100}
                    />
                    :
                    <UploadPictureBtn onPress={props.onPress} uploading={props.uploading}/>
            }
            <View style={{marginLeft: 15, flexDirection: "column"}}>
                {/* display name */}
                <Title style={styles.title}>
                    {props.user.displayName}
                </Title>
                {/* status */}
                <Caption style={styles.statuscaption}>
                    Status: {props.user.status ? props.user.status.text ? props.user.status.text : "No Status" : "No Status"}
                </Caption>
            </View>

        </View>

        <View style={styles.row}>
            <View style={styles.section}>
                <Paragraph style={[styles.paragraph, styles.caption]}>
                    {props.friends ? props.friends.length : 0}
                </Paragraph>
                <Caption style={styles.caption}>{props.user.isBusiness ? "Followers" : "Drinking Buddies"}</Caption>
            </View>
            <View style={styles.section}>

            </View>
            {!props.user.isBusiness ?
                <View style={styles.section}>
                    <TouchableOpacity
                        onPress={ () =>  props.navigate('QRCode')  }
                        style={{
                            zIndex: 10,
                            alignSelf: "flex-end",
                            position: "relative",
                            width: "auto",
                            height: "auto"
                        }}
                    >
                        <Avatar.Icon
                            size={30}
                            icon="qrcode-scan"
                            color={theme.icons.color}
                            style={{position: "relative", backgroundColor: theme.generalLayout.backgroundColor}}/>
                    </TouchableOpacity>
                </View>
                : null}
        </View>
    </View>;
}
