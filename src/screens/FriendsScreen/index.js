import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    FlatList,
    Text,
    TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import FirebaseFirestore from '@react-native-firebase/firestore';

import Card from './components/Card';
import Search from '../../components/Search';

import styles from './styles';

const TEXT = {
    allFriendsLocation: 'Show all friends location',
};

const FriendsScreen = (props) => {
    const [friends, setFriends] = useState([]);
    const [filteredFriends, setFilteredFriends] = useState(null);

    useEffect(() => {
        getFriends();
        return getFriends();
    }, [])

    const getFriends = () => {
        const currentUserUid = auth().currentUser?.uid;

        if (!currentUserUid) {
            return;
        }
        
        FirebaseFirestore().collection('users').onSnapshot(users => {
            const friends = [];

            users.forEach(user => {
                if (user.id == auth().currentUser.uid) {
                    return;
                }

                friends.push({
                    id: user.id,
                    ...user.data(),
                });
            });

            setFriends(friends);
        });
    }

    const searchFriend = (query) => {
        const filteredFriends = friends.filter(person => (person.name).toLowerCase().includes(query.toLowerCase()));
        setFilteredFriends(filteredFriends);
    }

    const navigateToMapScreen = (person) => {
        if (!person) {
            props.navigation.navigate('Map', {show: 'all'});
        }

        props.navigation.navigate('Map', {person});
    }

    const navigateToChatScreen = (item) => {
        props.navigation.navigate('Chat', {item});
    }

    return (
        <SafeAreaView style={styles.container}>
            <Search onSearch={searchFriend} />
            <TouchableOpacity onPress={navigateToMapScreen}>
                <Text style={styles.showAllFriendsText}>
                    {TEXT.allFriendsLocation}
                </Text>
            </TouchableOpacity>
            <FlatList 
                keyExtractor={(_, index) => index.toString()}
                data={filteredFriends ?? friends}
                renderItem={({item}) => (
                    <Card 
                        photo={item.photo}
                        name={item.name}
                        about={item.about}
                        location={item.location}
                        navigateToChatScreen={() => navigateToChatScreen(item)}
                        navigateToMapScreen={() => navigateToMapScreen(item)}/>
                )}
            />
        </SafeAreaView>
    );
}

export default FriendsScreen;