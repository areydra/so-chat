import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    containerSearch: {
        marginVertical: 12,
        marginHorizontal: 12,
        paddingLeft: 16,
        paddingRight: 4,
        borderWidth: 1,
        borderRadius: 25,
        borderColor: '#E3E3E3',
        position: 'relative',
        flexDirection: 'row',
    },
    containerIconSearch: {
        justifyContent: 'center'
    },
    iconSearch: {
        width: 35,
        height: 35,
        marginLeft: 5
    },
    search: {
       flex: 1
    }
});

export default styles;
