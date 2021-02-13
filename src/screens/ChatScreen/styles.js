import {StyleSheet, Dimensions} from 'react-native';
import Color from '../../constants/Colors';

const {width} = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    messageContainer: {
        flex: 1,
        marginHorizontal: 10
    },
    messageLists: {
        flexGrow: 1
    },
    messageUserContainer: {
        backgroundColor: Color.lightGrey, 
        paddingVertical: 5, 
        paddingHorizontal: 40, 
        marginVertical: 5,
        color: Color.black,
        alignSelf: 'flex-end',
        borderRadius: 25
    },
    messageUser: {
        color: Color.black,
        marginLeft: -25
    },
    messageUserTime: {
        fontSize: 10, 
        marginTop: -3, 
        marginRight: -25, 
        textAlign: 'right',
        color: Color.black
    },
    messageFriendContainer: {
        backgroundColor: Color.main,
        paddingVertical: 5,
        paddingHorizontal: 40,
        marginVertical: 5,
        color: Color.white,
        alignSelf: 'flex-start',
        borderRadius: 25
    },
    messageFriend: {
        color: Color.white, 
        marginLeft: -25
    },
    messageFriendTime: {
        fontSize: 10, 
        marginTop: -3, 
        marginRight: -25, 
        textAlign: 'right', 
        color: Color.white 
    },
    textInputContainer: {
        borderWidth: 1,
        borderRadius: 25,
        borderColor: Color.grey,
        color: Color.grey,
        marginBottom: 10,
        marginHorizontal: width / 20,
        position: 'relative'
    },
    textInput: {
        paddingLeft: 20,
        width: '85%'
    },
    send: {
        position: 'absolute',
        marginTop: 5,
        alignSelf: 'flex-end',
        right: 10
    }
});

export default styles;
