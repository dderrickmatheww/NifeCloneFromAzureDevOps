import React, {Component} from "react";
import {View, ScrollView} from 'react-native';
import {localStyles} from "./style";
import {Chip, Title} from "react-native-paper";
import theme from "../../../styles/theme";

export class FavoriteDrinks extends Component {
    render(){
        return (
            <View style={localStyles.profRow}>
                <Title style={localStyles.descTitle}>
                    Favorite Drinks:
                </Title>

                <ScrollView horizontal={true} contentContainerStyle={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    paddingBottom: 10
                }}>
                    {
                        this.props.userData.user_favorite_drinks && this.props.userData.user_favorite_drinks.length !== 0 ?
                            this.props.userData.user_favorite_drinks.map((drink, i) => (

                                <Chip mode={"outlined"} key={i}
                                      style={{
                                          backgroundColor: theme.generalLayout.backgroundColor,
                                          borderColor: theme.generalLayout.secondaryColor,
                                          marginHorizontal: 2
                                      }}
                                      textStyle={{
                                          color: theme.generalLayout.textColor,
                                          fontFamily: theme.generalLayout.font
                                      }}>
                                    {drink.description}
                                </Chip>

                            ))
                            :
                            <Chip mode={"outlined"}
                                  style={{
                                      backgroundColor: theme.generalLayout.backgroundColor,
                                      borderColor: theme.generalLayout.secondaryColor,
                                      marginHorizontal: 2
                                  }}
                                  textStyle={{
                                      color: theme.generalLayout.textColor,
                                      fontFamily: theme.generalLayout.font
                                  }}>
                                None
                            </Chip>
                    }
                </ScrollView>
            </View>
        )
    }
}