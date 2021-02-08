import React, {useEffect, useState} from 'react';
import {
    Image,
    TouchableOpacity,
    View,
    TextInput,
} from 'react-native';

import styles from './styles';
import Icon from '../../assets/icons';

const Search = props => {
    const [text, setText] = useState(null);

    useEffect(() => {
        if (text === null) {
            return;
        }

        onSearch();
    }, [text])
    
    const onSearch = () => {
        props.onSearch(text);
    }

    return (
        <View style={styles.containerSearch}>
            <TextInput 
                style={styles.search} 
                returnKeyType='search' 
                placeholder='Search here...' 
                onSubmitEditing={onSearch}
                onChangeText={text => setText(text)}/>
            <TouchableOpacity 
                style={styles.containerIconSearch} 
                onPress={onSearch}>
                <Image 
                    source={Icon.search} 
                    style={styles.iconSearch}/>
            </TouchableOpacity>
        </View>
    );
};

export default Search;
