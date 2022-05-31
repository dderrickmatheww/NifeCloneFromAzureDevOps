import React, {Component} from "react";
import {TouchableOpacity, View} from "react-native";
import {localStyles} from "./style";
import {Caption, Title} from "react-native-paper";
import {Ionicons} from "@expo/vector-icons";
import theme from "../../../styles/theme";

export class ProfileStatus extends Component {
    state = {
        status: null
    }
    getLatestStatus(){
        let posts = this.props.userData.user_posts
         posts = posts.sort((a,b) =>{
            return new Date(b.created) - new Date(a.created);
        });
        this.setState({status: posts[0]})
    }
    componentDidMount() {
        this.getLatestStatus();
    }

    render() {
        return <View style={localStyles.profRow}>
            <View style={{flexDirection: "row"}}>
                <Title style={localStyles.descTitle}>
                    Status:
                </Title>
                {/*{*/}

                {/*    this.props.currentUser ?*/}
                {/*        <TouchableOpacity style={localStyles.editStatus}*/}
                {/*                          onPress={this.props.onPress}*/}
                {/*        >*/}
                {/*            <Ionicons size={25} color={theme.icons.color}*/}
                {/*                      name="ios-add-circle"/>*/}
                {/*        </TouchableOpacity>*/}
                {/*        :*/}
                {/*        null*/}
                {/*}*/}
            </View>
            <Caption
                style={localStyles.caption}>{this.state.status ? this.state.status.description : "None"}</Caption>
        </View>;
    }
}