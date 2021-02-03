import React, { useState } from 'react';
import { Image, TouchableOpacity, StyleSheet, View, TextInput, Dimensions } from 'react-native';

const SearchComponent = props => {
    const [text, setText] = useState('')

    const onSearch = () => {
        props.onSearch(text);
    }

    return (
        <View style={Styles.containerSearch}>
            <TextInput 
                style={Styles.search} 
                returnKeyType='search' 
                placeholder='Search here...' 
                onSubmitEditing={onSearch}
                onChangeText={text => setText(text)} 
            />
            <TouchableOpacity style={Styles.containerIconSearch} onPress={onSearch}>
                <Image source={require('../assets/icons/Search.png')} style={Styles.iconSearch} />
            </TouchableOpacity>
        </View>
    );
};

const Styles = StyleSheet.create({
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

export default SearchComponent;
