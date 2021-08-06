import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { styles } from '../../../src/styles/style';
import theme from '../../../src/styles/theme';
import {
    Headline
} from 'react-native-paper';
import Favorite from '../Universal/Favorite';
import Util from '../../scripts/Util';
const TouchableOpacity = Util.basicUtil.TouchableOpacity();

export default class DataRow extends React.Component  {
    state = {
        modalVisable: false,
        refresh: false,
        DetailsTab: true,
        EventsTab: false,
        SpecialsTab: false,
        loadingBusiness:false,
        businessData:null
    }

    componentDidMount(){
        this.setState({loadingBusiness: true});
        Util.business.GetBusinessByUID(this.props.buisnessUID, (data)=>{
          this.setState({businessData: data});
          this.setState({loadingBusiness: false});
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

    render() {
        return (
            <View style={styles.dataRowContainer}>
                <View style={localStyles.navHeader}>
                        <Image
                            style={localStyles.LogoData}
                            source={{uri: this.props.barImage }}
                        />
                        <View style={{width:"45%", textAlign:"center", alignSelf:"center", margin: '2%'}}>
                            <Headline style={{color:theme.generalLayout.textColor, fontFamily: theme.generalLayout.font, fontSize: 14 }}>{this.props.name}</Headline>
                        </View>
                        <View style={localStyles.DrawerOverlay}>
                            <Favorite favoriteTrigg={(buisnessUID, boolean, buisnessName) => {this.props.favoriteABar(buisnessUID, boolean, buisnessName)}} user={this.props.user} buisnessUID={this.props.buisnessUID} buisnessName={this.props.name}/>
                        </View>
                </View>
                <View style={localStyles.tabCont}>
                    <TouchableOpacity style={[styles.tab]} onPress={ () => this.toggleTab({details:true}) }>
                        <Text style={this.state.DetailsTab ? localStyles.tabOff : localStyles.tabOn}>
                        Details
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.toggleTab({events:true}) } style={[styles.tab, {borderRightWidth:1, borderLeftWidth:1, borderRightColor: theme.LIGHT_PINK , borderLeftColor: theme.LIGHT_PINK }]}>
                        <Text style={this.state.EventsTab ? localStyles.tabOff : localStyles.tabOn}>
                        Events
                        </Text>

                    </TouchableOpacity>
                    <TouchableOpacity onPress={ () => this.toggleTab({specials:true}) } style={[styles.tab]}>
                        <Text style={this.state.SpecialsTab ? localStyles.tabOff : localStyles.tabOn}>
                        Specials
                        </Text>
                    </TouchableOpacity>
                </View> 
                { this.state.DetailsTab ?
                    <View>
                    {
                        this.props.address && typeof this.props.address[0] !== 'undefined' ?
                            <Text style={styles.facebookDataText}>
                                {this.props.address[0]} {"\n"}
                                {this.props.address[1] + ', ' + this.props.address[2]} {"\n"}
                                Phone #: {this.props.phone} {"\n"}
                            </Text>
                        :
                        <Text style={styles.facebookDataText}>
                            No address available!
                        </Text>
                    }
                    { 
                        this.props.usersCheckedIn > 1 ? 
                            <Text style={styles.checkedInDataText}>
                                There are {this.props.usersCheckedIn} people currently here!
                            </Text>
                        : 
                            <Text style={styles.checkedInDataText}>
                                There is {this.props.usersCheckedIn} person currently here! 
                            </Text>
                    }
                    </View>  : null
                } 
                { this.state.EventsTab ?
                    <View style={{flex:1}}>
                        <ScrollView style={{flex:1,width:"100%", zIndex:100}} contentContainerStyle={{flex:1,justifyContent:"flex-start",alignItems:'center'}}>
                        {
                            this.state.businessData ? 
                                this.state.businessData.events.length > 0 ?
                                this.state.businessData.events.map((event, i)=>(
                                    <View  key={i} style={localStyles.eventCont}>
                                    <Text  style={localStyles.eventText}>
                                        {event.event}
                                    </Text>
                                    </View>
                                ))
                                :
                                <View style={localStyles.noEventsCont}>
                                    <Text style={localStyles.noEventsText}>No events planned yet!</Text>
                                </View>
                            :
                            this.state.loadingBusiness ?
                              <ActivityIndicator color={theme.loadingIcon.color} size="large"></ActivityIndicator> 
                            : 
                              <View style={localStyles.noEventsCont}>
                                  <Text style={localStyles.noEventsText}>This business has not registered for Nife yet, let them know!</Text>
                              </View>
                        }
                        </ScrollView>
                    </View>
                    :null  
                } 
                { this.state.SpecialsTab ?
                    <View style={{flex:1}}>
                        <ScrollView style={{flex:1,width:"100%"}} contentContainerStyle={{flex:1,justifyContent:"center",alignItems:'center'}}>
                        {
                            this.state.businessData ? 
                                this.state.businessData.specials.length > 0 ?
                                this.state.businessData.specials.map((special, i)=>(
                                    <View key={i} style={localStyles.specialsCont}>
                                      <Text  style={localStyles.eventText}>
                                        {special.special}
                                      </Text>
                                    </View>
                                  ))
                                :
                                <View style={localStyles.noEventsCont}>
                                    <Text style={localStyles.noEventsText}>No events planned yet!</Text>
                                </View>
                            :
                            this.state.loadingBusiness ?
                              <ActivityIndicator color={theme.loadingIcon.color} size="large"></ActivityIndicator> 
                            : 
                              <View style={localStyles.noEventsCont}>
                                  <Text style={localStyles.noEventsText}>This business has not registered for Nife yet, let them know!</Text>
                              </View>
                        }
                        </ScrollView>
                    </View>
                    :null
                } 
                
            </View>
        )
    }
}

const localStyles = StyleSheet.create({ 
    eventCont:{
        justifyContent:"center",
        borderRadius:5,
        borderWidth:1,
        borderColor:theme.generalLayout.secondaryColor,
        marginVertical:5,
        marginHorizontal:5,
        paddingHorizontal:10,
        width:"95%",
        minWidth:"75%",
      },
      specialsCont:{
        justifyContent:"center",
        borderRadius:5,
        borderWidth:1,
        borderColor:theme.generalLayout.secondaryColor,
        marginVertical:5,
        marginHorizontal:5,
        paddingHorizontal:10,
        width:"95%",
        minWidth:"75%",
      },
    eventText:{
        color:theme.generalLayout.textColor,
        paddingVertical:10,
        paddingHorizontal:10,
        width:"90%",
        textAlign:"left",
        fontFamily: theme.generalLayout.font
      },
      noEventsText:{
        color:theme.generalLayout.textColor,
        fontFamily: theme.generalLayout.font
      },
    tabOff:{
        width:"100%",
        paddingHorizontal:30,
        color: theme.icons.color,
        fontFamily: theme.generalLayout.font
      },
      tabOn:{
        width:"100%",
        color: theme.generalLayout.textColor,
        paddingHorizontal:30,
        fontFamily: theme.generalLayout.font
      },
    tabCont:{
        borderTopWidth:1,
        borderBottomWidth:1,
        borderColor:theme.generalLayout.secondaryColor,
        width:"100%",
        flexDirection:"row",
        justifyContent:"space-evenly",
        marginTop:5,
        marginBottom:10,
      },
    navHeader: {
        flexDirection:"row",
        paddingBottom: 10,
        width:"100%",
        textAlign:"center",
        alignItems:"center",
        overflow: 'hidden',
        justifyContent:"space-between"
    },
    DrawerOverlay: {
        backgroundColor: theme.generalLayout.backgroundColor,
        borderRadius: 10,
        width: '5%',
        textAlign:"center",
        alignItems:"center",
        margin: '2%',
    },
    LogoData: {
        width: '33%',
        height: 90,
        borderColor: "#fff",
        borderWidth: 1,
        borderRadius: 5,
        marginVertical:5,
        alignItems:"center",
      },
})