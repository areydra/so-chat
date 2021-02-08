import {StyleSheet} from 'react-native';

import Color from '../../constants/Colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cardContainer: {
        height: 80,
        borderBottomWidth: 1,
        borderBottomColor: Color.grey,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 14,
        marginBottom: 14,
    },
    cardContainerImage: {
        height: 65,
        width: 65,
        backgroundColor: Color.white,
        borderRadius: 65,
        overflow: 'hidden',
    },
    cardImage: {
        width: '100%', 
        height: '100%', 
    },
    cardContainerContent: {
        marginLeft: 15,
        flex: 1,
    },
    cardName: {
        fontSize: 18,
        marginBottom: 5,
    },
    cardContainerMessage: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardIcon:{
        height: 15,
        width: 15,
        marginLeft: 10,
    },
    cardTime: {
        textAlign: 'right',
    },
    cardContainerMessageText: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default styles;
