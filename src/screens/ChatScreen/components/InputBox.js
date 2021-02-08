import React, {useState} from 'react';
import {Image, TouchableOpacity, View, TextInput} from 'react-native';

import styles from '../styles';
import Icon from '../../../assets/icons';

const TEXT = {
    placeholder: 'Tell me. U love me'
}

const InputBox = ({handleSendMessage}) => {
    const [message, setMessage] = useState('');

    const submit = () => {  
        setMessage('');      
        handleSendMessage(message);
    }

    return (
        <View style={styles.textInputContainer}>
            <TextInput 
                placeholder={TEXT.placeholder}
                style={styles.textInput}
                onChangeText={setMessage}
                value={message}
                returnKeyType='send' 
                onSubmitEditing={submit}/>
            <TouchableOpacity 
                onPress={submit}
                style={styles.send}>
                <Image source={Icon.send}/>
            </TouchableOpacity>
        </View>                 
    );
}

export default InputBox;
