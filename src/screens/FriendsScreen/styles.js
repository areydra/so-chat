import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    showAllFriendsText: {
        color: '#F15249', 
        textAlign: 'right', 
        fontWeight: 'bold',
        marginHorizontal: 20
    },
    cardContainer: {
        height: 80,
        borderBottomWidth: 1,
        borderBottomColor: '#E3E3E3',
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 14,
        marginBottom: 14,
    },
    cardContainerAvatar: {
        height: 65,
        width: 65,
        backgroundColor: 'white',
        borderRadius: 65,
        overflow: 'hidden',
    },
    cardAvatar: {
        width: '100%',
        height: '100%',
    },
    cardContainerContent: {
        marginLeft: 15,
        flex: 1,
    },
    cardTextName: {
        fontSize: 18,
        marginBottom: 5,
    },
    cardContainerTextAbout: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardContainerIconMarker:{
        width: 30,
        alignItems: 'flex-end',
    },
    cardIconMarker: {
        height: 25,
        width: 25,
        marginLeft: 38,
    },
});

export default styles;