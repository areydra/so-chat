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
    iconArrowBack: {
        width:20,
        height: 20,
        marginHorizontal: 8,
    },
    chatScreenHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Color.main,
        paddingVertical: 8,
    },
    chatScreenTitlePhoto: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Color.white,
    },
    chatScreenTitleTextContainer: {
        marginLeft: 16,
    },
    chatScreenTitleTextName: {
        fontSize: 18,
        color: Color.white,
    },
    chatScreenTitleTextStatus: {
        fontSize: 12,
        color: Color.white
    },
    mapScreenHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        backgroundColor: Color.main,
    },
    mapScreenTitleStyle: {
        flex: 1,
        paddingRight: 44,
        textAlign: 'center',
        color: Color.white,
    },
});