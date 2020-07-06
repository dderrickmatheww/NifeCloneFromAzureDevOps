import React  from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import BottomSheet from 'reanimated-bottom-sheet';
import CheckInOutButtons from '../../Universal Components/CheckInOutBtn';
import * as firebase from 'firebase';

class BarModal extends React.Component  {

  state = {
    isVisible: false,
    isLoggedin: firebase.auth().currentUser ? true : false,
    userData: firebase.auth().currentUser ? firebase.auth().currentUser : null,
  };

  componentDidMount() {
    this.setState({isVisible: this.props.isVisible})
  }

  renderInner = () => (
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>{this.props.barName}</Text>
        <Image
          style={styles.photo}
          source={{uri: this.props.source }}
        />
        <Text style={styles.panelSubtitle}>
          {this.props.barName} - 40 miles away
        </Text>
        <View style={styles.panelButton}>
        {
            this.state.isLoggedin ?
              <CheckInOutButtons 
                email={this.state.userData.email}
                source={this.props.source}
                barName={this.props.barName}
                phone={this.props.phone}
                closed={this.props.closed}
                address={this.props.address}
                buisnessUID={this.props.buisnessUID}
                latitude={this.props.latitude}
                longitude={this.props.longitude}
              />
            : 
            null
          }
        </View>
      </View>
  )

  renderHeader = () => (
      <View style={styles.header}>
        <View style={styles.panelHeader}>
          <View style={styles.panelHandle} />
        </View>
      </View>
  )

  bs = React.createRef()

  render() {
    return (
      <View style={styles.container}>
        <BottomSheet
          ref={this.bs}
          snapPoints={[500, 250, 0]}
          renderContent={this.state.isVisible ? this.renderInner() : ""}
          renderHeader={this.state.isVisible ? this.renderHeader() : ""}
          initialSnap={1}
        />
      </View>
    )
  }
}

const IMAGE_SIZE = 200

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    justifyContent: 'center', 
    alignItems: 'center' ,
  },
  box: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
  panelContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  panel: {
    height: 700,
    padding: 20,
    backgroundColor: '#f7f5eee8',
  },
  header: {
    backgroundColor: '#f7f5eee8',
    shadowColor: '#000000',
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#318bfb',
    alignItems: 'center',
    marginVertical: 10,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  photo: {
    width: '100%',
    height: 225,
    marginTop: 30,
  },
  map: {
    height: '100%',
    width: '100%',
  },
})
    
  
  export default BarModal;