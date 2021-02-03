import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import toArray from 'lodash/toArray';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import Card from '../components/Card';
import Search from '../components/Search';

const TEXT = {
    allFriendsLocation: 'Show all friends location',
};

const Friends = (props) => {
    const [friends, setFriends] = useState([]);
    const [filteredFriends, setFilteredFriends] = useState(null);

    useEffect(() => {
        getFriends();
    }, [])

    const getFriends = () => {
        const currentUserUid = auth().currentUser?.uid;

        if (!currentUserUid) {
            return;
        }
        
        database().ref('users').on('value', users => {
            let friends = toArray(users.val()).filter(user => user.uid !== currentUserUid);
            setFriends(friends);
        });
    }

    const filterPersons = (query) => {
        const filteredFriends = friends.filter(person => (person.name).toLowerCase().includes(query.toLowerCase()));
        setFilteredFriends(filteredFriends);
    }

    const navigateToMapScreen = () => {
        props.navigation.navigate('Map', {show: 'all'});
    }

    return (
        <SafeAreaView style={Styles.container}>
            <Search onSearch={filterPersons} />
            <TouchableOpacity onPress={navigateToMapScreen}>
                <Text style={Styles.showAllFriendsText}>
                    {TEXT.allFriendsLocation}
                </Text>
            </TouchableOpacity>
            <FlatList 
                keyExtractor={item => item.uid}
                data={filteredFriends ?? friends}
                renderItem={friend => friend?.item && (
                    <Card 
                        item={friend.item} 
                        screen='friends' 
                        navigation={props.navigation}/>
                )}
            />
        </SafeAreaView>
    );
}

const Styles = StyleSheet.create({
    container: {
        flex: 1
    },
    showAllFriendsText: {
        color: '#F15249', 
        textAlign: 'right', 
        fontWeight: 'bold',
        marginHorizontal: 20
    }
});

export default Friends;