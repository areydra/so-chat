import {StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2FAEB2'
    },
    brand: {
        fontSize: width / 4.5,
        fontWeight: 'bold',
        color: 'white'
    },
    line: {
        height: 1,
        width: width / 3.6,
        backgroundColor: 'white'
    }
});

export default styles;