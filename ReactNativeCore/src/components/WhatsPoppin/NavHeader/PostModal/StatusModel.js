import React from "react";
import {
    StyleSheet, Platform,
    View,
    ActivityIndicator,
    Keyboard
} from "react-native";
import Util from '../../scripts/Util';
import { Button, TextInput, Text } from 'react-native-paper';
import { createPost, getPostsPaginated } from '../../../../utils/api/posts';
import theme from '../../styles/theme';
import { connect } from "react-redux";

class StatusModel extends React.Component {

    state = {
      userData: this.props.userData,
      feedData: this.props.feedData,
      description: null,
      saving: false,
      image: null
    };

    onSaveStatus = () => {
        this.setState({ saving: true });
        const { userData, image } = this.state;
        const { modalType } = this.props;
        const { businessId, latitude, longitude, id: userId } = userData;
        const postObj =  {
            description,
            created: new Date(),
            type: modalType,
            image,
            businessId,
            latitude,
            longitude,
            userId
        }
        await createPost(postObj);
        const feedData = await getPostsPaginated({ userId, take: 50, skip: 0 });
        this.props.refresh(userData, feedData);
        this.setState({ saving: false });
    }

    uploadImageStatus = () => {
        this.setState({ saving: true });
        const { email } = this.state.userData;
        const image = await uploadImage(email);
        this.setState({
            saving: false,
            image
        });
    }

    render() {     
        return( 
            <View style={localStyles.viewDark}>
                <TextInput
                    mode={"outlined"}
                    label=""
                    selectionColor={Platform.select({
                        ios: theme.generalLayout.textColor,
                        android:'black'
                    })}
                    outlineColor={theme.generalLayout.backgroundColor}
                    placeholder={Platform.select({
                        ios: 'Type here...',
                        android:''
                    })}
                    placeholderTextColor={Platform.select({
                        ios: theme.generalLayout.textColor,
                        android:'black'
                    })}
                    onChangeText={text => this.setState({ description: text })}
                    style={localStyles.textInput}
                    value={this.state.description}
                    multiline={true}
                    returnKeyType={'done'}
                    onKeyPress={(e) => {
                        if (e.nativeEvent.key == "Enter") {
                            Keyboard.dismiss();
                        }
                    }}
                    theme={{ colors: { primary: theme.generalLayout.secondaryColor, placeholder: theme.generalLayout.textColor, underlineColor: 'transparent' } }}
                /> 
                {
                    this.state.saving ? 
                        <ActivityIndicator style={{ marginVertical: 5 }} color={theme.loadingIcon.color} size="large"/>
                    : 
                        <Button
                            labelStyle={{ color: theme.generalLayout.textColor }}
                            style={localStyles.button}
                            mode="contained"
                            onPress={this.uploadImageStatus}
                            disabled={!this.state.image ? false : true}
                        >
                            <Text style={{
                                color: theme.generalLayout.textColor,
                                fontFamily: theme.generalLayout.font
                            }}>
                                {!this.state.image ? "Upload a Picture!" : "Picture Added!"}
                            </Text>
                        </Button> 
                }
                <Button 
                    labelStyle={{color: theme.generalLayout.textColor}} 
                    style={localStyles.button} 
                    icon={"check"}
                    mode="contained" 
                    onPress={this.onSaveStatus}
                >
                    <Text 
                        style={{color: theme.generalLayout.textColor, fontFamily: theme.generalLayout.font}}
                    >
                        { `Post ${this.props.modalType === "EVENT" ? "Event" : this.props.modalType === "SPECIAL" ? "Special" : ""}`}
                    </Text>
                </Button>
            </View> 
        )
    }
}

function mapStateToProps(state){
    return {
        ...state
    }
}

function mapDispatchToProps(dispatch){
    return {
        refresh: (userData, feedData) => dispatch({ type:'REFRESH', data: userData, feed: feedData }),
        yelpDataRefresh: (data) => dispatch({ type:'YELPDATA', data: data }),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusModel);

const localStyles = StyleSheet.create({
  textInput:{
    flex: 1,
    ...Platform.select({
      ios: {
        backgroundColor: theme.generalLayout.backgroundColor,
        color: theme.generalLayout.textColor,
      },
      android:{
        backgroundColor: 'white',
        color: 'black',
      }
    }),
    width:"90%", 
    height:"80%", 
    alignSelf:"center", 
    borderRadius: 5,
    marginTop:5,
    fontFamily: theme.generalLayout.font,
  },
  button: {
    borderColor: theme.generalLayout.secondaryColor,
    borderRadius:10,
    borderWidth:1,
    width:"50%",
    marginBottom: 20
  },
  viewDark:{
    flex: 1,
    backgroundColor: theme.generalLayout.backgroundColor,
    flexDirection:"column",
    justifyContent:"center",
    alignContent:"center",
    alignItems:"center",
    color: theme.generalLayout.textColor,
    borderRadius: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: theme.generalLayout.secondaryColor
  }
});
