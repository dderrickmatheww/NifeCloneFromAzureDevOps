import React from 'react';
import { StyleSheet, View, Text, FlatList, Animated} from 'react-native';
import theme from '../../Styles/theme';

class ExpandableArea extends React.Component  {
    render(){

        return(
           
                <FlatList
                    data={this.props.data}
                    renderItem={this.props.renderItem}
                    keyExtractor={this.props.keyExtractor}
                    style={{flex:1}}
                    horizontal={true}
                />
        );
    }
    
}


const styles = StyleSheet.create({

});

export default ExpandableArea;