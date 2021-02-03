import {StyleSheet, Dimensions} from 'react-native';

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        height: 80,
        borderBottomWidth: 1,
        borderBottomColor: '#E3E3E3',
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: width / 30,
        marginBottom: width/30,
    },
    containerImage: {
        height: 65,
        width: 65,
        backgroundColor: 'white',
        borderRadius: 65,
        overflow: 'hidden',
    },
    image: {
        width: '100%', 
        height: '100%', 
        resizeMode: 'cover',
    },
    containerContent: {
        marginLeft: 15,
        flex: 1,
    },
    name: {
        fontSize: 18,
        marginBottom: 5,
    },
    containerMessage: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    icon:{
        height: 15,
        width: 15,
        marginLeft: 10,
    },
    time: {
        textAlign: 'right',
    },
    containerMessageText: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default styles;
