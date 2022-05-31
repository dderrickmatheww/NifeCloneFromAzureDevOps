import * as React from "react";
import {
    StyleSheet, 
    Platform,
    View,
    Keyboard
} from "react-native";
import { Button, TextInput } from 'react-native-paper';
import { createPost, getPostsPaginated, getPosts } from '../../../utils/api/posts';
import { uploadImage } from '../../../utils/api/users';
import theme from '../../../styles/theme';
import { connect } from "react-redux";

class StatusModel extends React.Component {

    state = {
      description: null,
      saving: false,
      image: null,
      skip: 0,
      take: 50
    };

    onSaveStatus = async () => {
        this.setState({ saving: true });
        let { image, description, skip, take } = this.state;
        const { modalType: type, userData } = this.props;
        const { businessId, latitude, longitude, id: userId } = userData;
        await createPost(description, type, image, businessId, latitude, longitude, userId);
        const feedData = await getPosts(userId);
        this.props.refresh({ feedData });
        this.setState({ saving: false });
        this.props.onDismiss();
    }

    uploadImageStatus = async () => {
        this.setState({ saving: true });
        const { email } = this.props.userData;
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
                    disabled={false}
                    selectionColor={Platform.select({
                        ios: theme.generalLayout.textColor,
                        android:'black'
                    })}
                    outlineColor={theme.generalLayout.textColor}
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
                    theme={{ 
                        colors: { 
                            primary: theme.generalLayout.secondaryColor, 
                            placeholder: theme.generalLayout.textColor, 
                            underlineColor: 'transparent',
                            text: theme.generalLayout.textColor
                        } 
                    }}
                /> 
                <Button
                    labelStyle={{ color: theme.generalLayout.textColor }}
                    style={localStyles.button}
                    contentStyle={{ width: '100%'}}
                    icon="camera"
                    loading={this.state.saving}
                    mode="contained"
                    onPress={this.uploadImageStatus}
                    disabled={!this.state.image ? false : true}
                >
                    {!this.state.image ? "Upload a Picture!" : "Picture Added!"}
                </Button> 
                <Button 
                    labelStyle={{color: theme.generalLayout.textColor}} 
                    style={localStyles.button}
                    icon={"check"}
                    mode="contained" 
                    onPress={this.onSaveStatus}
                >
                        { `Post ${this.props.modalType === "EVENT" ? "Event" : this.props.modalType === "SPECIAL" ? "Special" : ""}`}
                </Button>
            </View> 
        )
    }
}

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
    color: theme.generalLayout.textColor,
    borderColor: theme.generalLayout.secondaryColor,
    marginTop: 5,
    fontFamily: theme.generalLayout.font
  },
  buttonContainer: {
    width: "75%",
    alignContent: "center",
    justifyContent: "center",
    marginTop: '100%'
  },
  button: {
    marginBottom: '7%',
    width: '75%',
    alignSelf: "center"
  },
  viewDark:{
    width: '100%',
    height: '100%',
    backgroundColor: theme.generalLayout.backgroundColor,
    alignItems:"center",
    color: theme.generalLayout.textColor,
    borderRadius: 15,
    padding: 10,
    borderColor: theme.generalLayout.secondaryColor
  }
});

function mapStateToProps(state){
    return {
        ...state
    }
}

function mapDispatchToProps(dispatch) {
    return {
        refresh: ({ userData, feedData }) => dispatch({ 
            type:'REFRESH', 
            data: {
                userData,
                feedData 
            }
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusModel);