import React  from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
// import { AirbnbRating } from 'react-native-ratings';
import CheckInOutButtons from '../../Universal Components/CheckInOutBtn';
import * as firebase from 'firebase';
import theme from "../../../Styles/theme";
import Util from "../../../scripts/Util";
import Favorite from "../../Universal Components/Favorite";
import PopUpModal from "../../Universal Components/PopUpModal";
import {TouchableOpacity} from 'react-native-gesture-handler';

class BarModal extends React.Component  {

  state = {
    userData: firebase.auth().currentUser ? firebase.auth().currentUser : null,
    isVisible: this.props.isVisible ? true : false,
    distance: null,
    checkedIn: "",
    DetailsTab: true,
    EventsTab: false,
    SpecialsTab: false,
    businessData: null,
    loadingBusiness: false,
    navModal: false
  }

  toggleModal = (boolean) => {
    this.props.toggleModal(boolean);
  }

  toggleNavModal = (boolean) => {
    this.setState({navModal: boolean});
  }

  componentDidMount() {
    this.setState({userData: this.props.user});
    Util.location.DistanceBetween(this.props.latitude, this.props.longitude, this.props.userLocation, (distance) => {
      distance = distance.toFixed(1);
      this.setState({
        distanceBetween: distance
      });
    });
    Util.location.checkUserCheckInCount(this.props.buisnessUID, this.props.userLocation, (dataObj) => {
      this.setState({
        checkedIn: dataObj.length
      });
    });
    this.setState({loadingBusiness: true});
    Util.business.GetBusinessByUID(this.props.buisnessUID, (data)=>{
      // //console.log("business - " + JSON.stringify(data))
      this.setState({businessData: data});
      this.setState({loadingBusiness: false});
    });
  }

  favoriteABar = async (buisnessUID, boolean, buisnessName) => {
    let updatedUserData = this.props.user;
    await Util.user.setFavorite(updatedUserData, buisnessUID, boolean, buisnessName, (boolean, boolean2) => {
      if(boolean2) {
        this.setState({navModal: true});
      }
      else {
        if(typeof updatedUserData['favoritePlaces'] !== 'undefined') {
          updatedUserData['favoritePlaces'][buisnessUID] = {
            favorited: boolean,
            name: buisnessName
          };
          this.props.refresh(updatedUserData, null, null, null);
        }
      }
    });
  }

  toggleTab = (tabstate) => {
    if(tabstate.details){
      if(!this.state.DetailsTab)
      {
        this.setState({DetailsTab: true});
      }
      if(this.state.EventsTab){
        this.setState({EventsTab: false});
      }
      if(this.state.SpecialsTab){
        this.setState({SpecialsTab: false});
      }
    }
    if(tabstate.events){
      if(!this.state.EventsTab)
      {
        this.setState({EventsTab: true});
      }
      if(this.state.DetailsTab){
        this.setState({DetailsTab: false});
      }
      if(this.state.SpecialsTab){
        this.setState({SpecialsTab: false});
      }
    }
    if(tabstate.specials){
      if(!this.state.SpecialsTab)
      {
        this.setState({SpecialsTab: true});
      }
      if(this.state.EventsTab){
        this.setState({EventsTab: false});
      }
      if(this.state.DetailsTab){
        this.setState({DetailsTab: false});
      }
    }
  }

  renderInner = () => (
    <View style={{flex: 1, height:600}}>
      <View style={styles.panel}>
        <View style={styles.titleHeader}>
          <Text style={styles.panelTitle}>{this.props.barName}</Text>  
          <View style={{position: "absolute", top: 0, right: 10}}>
            <Favorite favoriteTrigg={(buisnessUID, bool, buisnessName) => this.favoriteABar(buisnessUID, bool, buisnessName)} user={this.props.user} buisnessUID={this.props.buisnessUID} buisnessName={this.props.barName} />
          </View>
          
        </View>
        <Text style={styles.panelText}>
          {this.state.distanceBetween} miles away
        </Text>
        <Text style={styles.panelText}>
          {this.props.address}
        </Text>
        <View style={styles.tabCont}>
          <TouchableOpacity style={[styles.tab]} onPress={ () => this.toggleTab({details:true}) }>
            <Text style={this.state.DetailsTab ? styles.tabOff : styles.tabOn}>
              Details
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.toggleTab({events:true}) } style={[styles.tab, {borderRightWidth:1, borderLeftWidth:1, borderRightColor: !this.state.SpecialsTab ? theme.LIGHT_PINK : "gray", borderLeftColor:!this.state.DetailsTab ? theme.LIGHT_PINK : "gray"}]}>
            <Text style={this.state.EventsTab ? styles.tabOff : styles.tabOn}>
              Events
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={ () => this.toggleTab({specials:true}) } style={[styles.tab]}>
            <Text style={this.state.SpecialsTab ? styles.tabOff : styles.tabOn}>
              Specials
            </Text>
          </TouchableOpacity>
        </View>    
            {
              this.state.EventsTab?
              <View style={{flex:1}}>
              <ScrollView style={{flex:1}} contentContainerStyle={{flex:1,justifyContent:"flex-start",alignItems:'center'}}>
                {
                  this.state.businessData ? 
                      this.state.businessData.events.length > 0 ?
                        this.state.businessData.events.map((event, i)=>(
                          <View  key={i} style={styles.eventCont}>
                            <Text  style={styles.eventText}>
                              {event.event}
                            </Text>
                          </View>
                        ))
                        :
                        <View style={styles.noEventsCont}>
                          <Text style={styles.noEventsText}>No events planned yet!</Text>
                        </View>
                  :
                  this.state.loadingBusiness ?
                  <ActivityIndicator color={theme.LIGHT_PINK} size="large"></ActivityIndicator> : 
                  <View style={styles.noEventsCont}>
                    <Text style={styles.noEventsText}>This business has not registered for Nife yet, let them know!</Text>
                  </View>
                }
              </ScrollView></View>
              :null
            }
            {
              this.state.SpecialsTab ?
              <ScrollView style={{flex:1}} contentContainerStyle={{flex:1,justifyContent:"flex-start",alignItems:'center',}}>
                {
                  this.state.businessData ? 
                      this.state.businessData.specials.length > 0 ?
                        this.state.businessData.specials.map((special, i)=>(
                          <View key={i} style={styles.eventCont}>
                            <Text  style={styles.eventText}>
                              {special.special}
                            </Text>
                          </View>
                        ))
                        :
                        <View style={styles.noEventsCont}>
                          <Text style={styles.noEventsText}>No specials out yet!</Text>
                        </View>
                  :
                  this.state.loadingBusiness ?
                  <ActivityIndicator color={theme.LIGHT_PINK} size="large"></ActivityIndicator> : 
                  <View style={styles.noEventsCont}>
                    <Text style={styles.noEventsText}>This business has not registered for Nife yet, let them know!</Text>
                  </View>
                }
              </ScrollView>
              :null
            }
            {
            this.state.DetailsTab ?
            <View>
              <Image
                style={styles.photo}
                source={{uri: this.props.source.uri}}
              />
              
                {/* <AirbnbRating 
                starContainerStyle={styles.ratingSystem}
                defaultRating={this.props.rating}
                showRating={false}
                isDisabled={true}
                reviewSize={20}
                selectedColor={theme.LIGHT_PINK}
              /> */}
              {/* <Text style={styles.ratingText}> in {this.props.reviewCount} reviews.</Text> */}
              { 
              !this.state.checkedIn == "" || this.state.checkedIn == 0 ?
                  this.state.checkedIn == 1 ?
                    <Text style={styles.ratingText}>
                      There is {this.state.checkedIn} person here!
                    </Text>
                  : 
                    <Text style={styles.ratingText}>
                      There are {this.state.checkedIn} people here!
                    </Text>
                :
                <View style={styles.activityIndicator}>
                  <ActivityIndicator 
                      size={'large'}
                      color={theme.LIGHT_PINK}
                  />
                </View>
              }
              {!this.state.userData.isBusiness ? <View style={styles.panelButton}>
                <CheckInOutButtons 
                  email={this.state.userData.email}
                  barName={this.props.barName}
                  buisnessUID={this.props.buisnessUID}
                  latitude={this.props.latitude}
                  longitude={this.props.longitude}
                  address={this.props.address}
                  phone={this.props.phone}
                  source={this.props.source}
                  closed={this.props.closed}
                />
              </View> : null}
            </View>
          : null
        }
        <PopUpModal 
          toggleModal={(boolean) => {this.toggleNavModal(boolean)}} 
          isVisible={this.state.navModal} 
          navigation={this.props.navigation} 
          route={'Profile'}
          userData={this.props.user}
          friendData={this.props.friends}
        />
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
      this.state.isVisible ?
          <BottomSheet
            ref={this.bs}
            snapPoints={['75%', '50%', '25%', '0%']}
            renderContent={this.renderInner}
            renderHeader={this.renderHeader}
            enabledInnerScrolling={false}
            enabledBottomClamp={true}
            onCloseEnd={()=>{this.toggleModal(false)}}
          />
      :
      null
    )
  }
}

const IMAGE_SIZE = 200

const styles = StyleSheet.create({
  panelTitle: {
    fontSize: 25,
    height: 35,
    color: theme.LIGHT_PINK,
    textAlign:"center",
    fontWeight:"bold",
    marginRight:10,
    marginLeft:15
  },
  titleHeader:{
    marginTop:-20,
    flexDirection:"row",
    justifyContent:"center",
  },
  eventText:{
    color:theme.LIGHT_PINK,
    paddingVertical:10,
    paddingHorizontal:10,
    width:"90%",
    textAlign:"left"
  },
  noEventsText:{
    color:theme.LIGHT_PINK,
  },
  eventCont:{
    justifyContent:"center",
    borderRadius:5,
    borderWidth:1,
    borderColor:theme.LIGHT_PINK,
    marginVertical:5,
    paddingHorizontal:10,
    width:"95%",
  },
  noEventsCont:{
    height:"100%",
    marginVertical:5,
    marginHorizontal:5,
    paddingBottom:150,
    paddingHorizontal:5
  },
  tab:{
    width:"100%",
    borderColor:theme.LIGHT_PINK,
    marginVertical:5
  },
  tabOff:{
    width:"100%",
    color:"gray",
    paddingHorizontal:30
  },
  tabOn:{
    width:"100%",
    color:theme.LIGHT_PINK,
    paddingHorizontal:30
  },
  tabCont:{
    borderTopWidth:1,
    borderBottomWidth:1,
    borderColor:theme.LIGHT_PINK,
    width:"100%",
    flexDirection:"row",
    justifyContent:"space-evenly",
    marginTop:5,
    marginBottom:10
  },
  container: {
    flex: 1,
    backgroundColor: theme.DARK,
    textAlign:"center",
    alignItems:"center",
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
  activityIndicator: {
    marginTop: 10,
    justifyContent: 'center', 
    alignItems: 'center' ,
    backgroundColor: '#20232a'
  },
  rating:{
    marginTop:"2%",
    marginBottom:"1%",
    backgroundColor: theme.DARK
  },
  ratingText: {
    color: 'grey',
    padding: 5,
    fontWeight:"bold",
    textAlign:"center"
  },
  panel: {
    flex:1,
    padding: 20,
    backgroundColor: theme.DARK,
    height: '100%',
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderRightColor: theme.LIGHT_PINK,
    borderLeftColor: theme.LIGHT_PINK,
  },
  header: {
    backgroundColor: theme.DARK,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderLeftWidth: 2,
    borderRightColor: theme.LIGHT_PINK,
    borderLeftColor: theme.LIGHT_PINK,
    borderTopColor: theme.LIGHT_PINK
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    marginBottom: 10,
    backgroundColor: theme.LIGHT_PINK
  },
  
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10
  },
  panelText: {
    fontSize: 12,
    color: 'gray',
    textAlign:"center",
    alignItems:"center",
  },
  panelButton: {
    padding: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  photo: {
    width: '100%',
    height: 225,
    marginTop: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: theme.LIGHT_PINK,
    borderRadius: 20
  },
  map: {
    height: '100%',
    width: '100%',
  },
  ratingSystem: {
    borderColor: theme.LIGHT_PINK,
    backgroundColor: theme.DARK,
  },

})
    
  
  export default BarModal;