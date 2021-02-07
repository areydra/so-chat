import { StyleSheet, Dimensions, } from 'react-native';
import Color from '../../constants/Colors';

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    containerVerificationBox: {
        flexDirection: 'row', 
        alignItems: 'center',
    },
    title: {
        textAlign: 'center',
        fontSize: width / 6,
        color: Color.main,
        marginBottom: 32,
    },
    containerInput: {
        flex: 1,
    },
    input: {
        fontSize: 18,
        marginRight: 4,
        textAlign: 'center',
        borderWidth: 2,
        borderRadius: 4,
        borderColor: Color.main,
    },
    inputError: {
        borderColor: Color.red,
    },
    containerButton: {
        borderTopRightRadius: 50,
        borderBottomRightRadius: 50,
        justifyContent: 'center',
        backgroundColor: Color.main,
        width: 50,
        height: 50,
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
    containerTextWrongPhoneNumber: {
        marginTop: width / 15,
        alignSelf: 'center',
        flexDirection: 'row'
    },
    textWrongPhoneNumber: {
        color: '#2FAEB2',
        marginLeft: 3
    }
});

export default styles;
