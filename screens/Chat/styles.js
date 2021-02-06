import {StyleSheet, Dimensions} from 'react-native';

const { width } = Dimensions.get('window')
 
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flexDirection: 'row',
        height: width / 5.5,
        backgroundColor: '#2FAEB2',
        alignItems: 'center',
    },
    arrowBack: {
        height: 20,
        width: 20,
        marginLeft: 10,
    },
    containerImage: {
        width: 55,
        height: 55,
        borderRadius: 55,
        marginHorizontal: 15,
        overflow: 'hidden',
        backgroundColor: 'white',
    },
    image: {
        width: '100%', 
        height: '100%', 
        resizeMode: 'cover'
    },
    headerNameContainer: {
        marginLeft: 5,
        width: '55%'
    },
    headerName: {
        fontSize: 20,
    },
    more: {
        marginLeft: 10,
        width: 25,
        height: 25
    },
    messageContainer: {
        flex: 1,
        marginHorizontal: 10
    },
    messageLists: {
        flexGrow: 1
    },
    messageUserContainer: {
        backgroundColor: '#E5E5E5', 
        paddingVertical: 5, 
        paddingHorizontal: 40, 
        marginVertical: 5,
        color: 'black',
        alignSelf: 'flex-end',
        borderRadius: 25
    },
    messageUser: {
        marginLeft: -25
    },
    messageUserTime: {
        fontSize: 10, 
        marginTop: -3, 
        marginRight: -25, 
        textAlign: 'right'
    },
    messageFriendContainer: {
        backgroundColor: '#2FAEB2',
        paddingVertical: 5,
        paddingHorizontal: 40,
        marginVertical: 5,
        color: 'white',
        alignSelf: 'flex-start',
        borderRadius: 25
    },
    messageFriend: {
        color: 'white', 
        marginLeft: -25
    },
    messageFriendTime: {
        fontSize: 10, 
        marginTop: -3, 
        marginRight: -25, 
        textAlign: 'right', 
        color: 'white' 
    },
    textInputContainer: {
        borderWidth: 1,
        borderRadius: 25,
        borderColor: '#E3E3E3',
        color: '#E3E3E3',
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
