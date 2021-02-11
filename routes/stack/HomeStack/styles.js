import {StyleSheet, Dimensions} from 'react-native';
import Color from '../../../src/constants/Colors';

const {width} = Dimensions.get('window');

export default StyleSheet.create({
    containerTabBarOptions: {
        backgroundColor: Color.main,
    },
    containerChildTabBarOptions: {
        width: width/3,
    },
    tabBarOptionsLabel: {
        textAlign: 'center',
        fontSize: 10,
        fontWeight: 'bold',
    },
    tabBarOptionsIndicator: {
        borderBottomColor: Color.white,
        borderBottomWidth: 3,
    },
});