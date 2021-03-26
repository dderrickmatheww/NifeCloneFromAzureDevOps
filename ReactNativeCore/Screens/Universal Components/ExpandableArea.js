import React from 'react';
import { StyleSheet, FlatList } from 'react-native';

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