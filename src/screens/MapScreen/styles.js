import {StyleSheet, Dimensions} from 'react-native';

import Color from '../../constants/Colors'

const {width} = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    arrowBack: {
        height: 20,
        width: 20,
        marginLeft: 10,
        alignSelf: 'flex-start',
    },
    titleContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        height: width / 8,
        borderBottomWidth: 1,
        borderBottomColor: Color.grey,
    },
    title: {
        flex: 1,
        marginRight: 20,
        textAlign: 'center',
    },
    locationContainer: {
        flex: 1,
    },
});

export default styles;
