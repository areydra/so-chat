import { StyleSheet, Dimensions, } from 'react-native';
import Color from '../../constants/Colors';

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    title: {
        textAlign: 'center',
        fontSize: width / 6,
        color: Color.main,
        marginBottom: 32,
    },
    containerInput: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 4,
        borderWidth: 2,
        borderRadius: 4,
        borderColor: Color.main,
    },
    containerInputError: {
        borderColor: Color.red,
    },
    icon: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
        marginHorizontal: 4,
    },
    input: {
        flex: 1,
        fontSize: 18,
    },
    containerButton: {
        borderTopRightRadius: 50,
        borderBottomRightRadius: 50,
        justifyContent: 'center',
        backgroundColor: Color.main,
        width: 50,
        height: 50,
        borderWidth: 2,
        borderColor: Color.main,
    },
    textButton: {
        color: Color.white,
        textAlign: 'center',
    },
    containerErrorMessage: {
        marginTop: 10,
        marginRight: 54,
        alignSelf: 'center',
    },
    textErrorMessage: {
        color: Color.red,
        textAlign: 'center',
    },
});

export default styles;
