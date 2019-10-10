import React, { useState } from 'react';
import { Image, TouchableOpacity, StyleSheet, View, TextInput, Dimensions } from 'react-native';

const { width } = Dimensions.get('window')

const SearchComponent = props => {
    const [text, setText] = useState('')

    return (
        <View style={styles.containerSearch} >
            <TouchableOpacity style={{ justifyContent: 'center' }} onPress={() => {
                props.onSearch(text)
                setText('')
                }}>
                <Image source={require('../assets/icons/Search.png')} style={styles.iconSearch} />
            </TouchableOpacity>
            <TextInput style={styles.search} placeholder='Search here...' returnKeyType='go' onChangeText={text => setText(text)} onSubmitEditing={() => {
                props.onSearch(text)
                setText('')
                }} />
        </View>
    );
};

const styles = StyleSheet.create({
    containerSearch: {
        marginVertical: width / 18,
        marginHorizontal: width / 25,
        borderWidth: 1,
        borderRadius: 25,
        borderColor: '#E3E3E3',
        position: 'relative',
        flexDirection: 'row'
    },
    iconSearch: {
        width: 35,
        height: 35,
        marginLeft: 5
    },
    search: {
        marginLeft: 10,
        width: width / 1.5
    }
});

export default SearchComponent;
