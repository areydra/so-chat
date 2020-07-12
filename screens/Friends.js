import firebase from 'firebase';
import _, { toArray } from 'lodash';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';

import Card from '../components/Card';
import Search from '../components/Search';

const Friends = ({... props}) => {
    const [query, setQuery] = useState('');
    const [persons, setPersons] = useState([]);
    const [personsHasFiltered, setPersonsHasFiltered] = useState([]);

    const user = firebase.auth().currentUser;

    useEffect(() => {
        getPersons();
    }, [])

    useEffect(() => {
        filterPersons();
    }, [query])

    const getPersons = () => {
        firebase.database().ref('users').on('value', persons => {
            persons = toArray(persons.val()).filter(person => person.uid !== user.uid);
            setPersons(persons);
        });
    }

    const filterPersons = () => {
        const personsHasFiltered = persons.filter(person => (person.name).toLowerCase().includes(query.toLowerCase()) && person.uid !== user.uid);
        setPersonsHasFiltered(personsHasFiltered);
    }

    return (
        <SafeAreaView style={Styles.container}>
            <Search onSearch={setQuery} />
            <TouchableOpacity onPress={ () => props.navigation.navigate('Map', { show: 'all' }) }>
                <Text style={ Styles.showAllFriendsText }>Show all friends location</Text>
            </TouchableOpacity>
            <FlatList 
                keyExtractor={item => item.uid}
                data={(personsHasFiltered.length || query.length) ? personsHasFiltered : persons}
                renderItem={user => (
                    <Card item={user.item} screen='friends' navigation={props.navigation}/>
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