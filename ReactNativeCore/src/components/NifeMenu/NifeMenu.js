import React, { useState } from 'react';
import {
    StyleSheet,
    View
} from 'react-native';
import { 
    Button,
    Menu,
    Text
} from 'react-native-paper';
import theme from '../../styles/theme';

export const NifeMenu = (props) => {
    const [visible, setVisible] = useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    return (
        <View style={ localStyles.btnContainer }>
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                    <Button onPress={openMenu}>
                        <Text style={{ color: theme.generalLayout.textColor }}>...</Text>
                    </Button>
                }
            >
                {
                    props.options.map((item, index) => {
                        const { onPress, title, icon, id } = item;
                        const key = index.toString();
                        return <Menu.Item icon={icon} key={key} onPress={() => { onPress(id); closeMenu(); }} title={title} />
                    })
                }
            </Menu>
        </View>          
    )
}

const localStyles = StyleSheet.create({
    btnContainer: {
        position: 'absolute',
        width: '10%',
        textAlign: 'center',
        left: '87%',
        top: '5%'
    }
});
