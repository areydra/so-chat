import _ from 'lodash'
import firebase from 'firebase'
import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, FlatList, Text, TouchableOpacity, Dimensions } from 'react-native';

import Card from '../components/Card'
import Search from '../components/Search'

const { width } = Dimensions.get('window')

class Friends extends Component {
    state = { 
        users : [],
        friends : [],
        search : []
     }

     componentDidMount = async () => {
        await this.getUser() 
     }

     getUser = () => {
        firebase.database().ref('users').on('child_added', users => {
            let key = Object.keys(users.val())
            let data = users.val()
            let dataUsers = data[key]

            this.setState(prevState => {
                return {
                    users : [...prevState.users, dataUsers]
                }
            })
        })
     }

    handleSearch = async (searched) => {
        let search = _.filter(this.state.users, obj => _.startsWith(obj.name, searched) )
        await this.setState({ search })
    }

     card = user => {
         return(
             <Card item={user.item} screen='friends' />
         )
     }

    render() { 
        const { search, users } = this.state
        const user     = firebase.auth().currentUser
        const filtered = (search.length) ? search.filter(person => person.uid !== user.uid) : users.filter(person => person.uid !== user.uid)

        return (
            <SafeAreaView style={styles.container}>
                <Search onSearch={this.handleSearch} />

                <TouchableOpacity onPress={ () => this.props.navigation.navigate('Map', { show: 'all' }) }>
                    <Text style={ styles.showAllFriendsText }>Show all friends location</Text>
                </TouchableOpacity>
                <FlatList 
                    keyExtractor={item => item.uid}
                    data={filtered}
                    renderItem={this.card}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    showAllFriendsText: {
        color: '#F15249', 
        textAlign: 'right', 
        fontWeight: 'bold',
        marginHorizontal: width / 30
    }
});

export default Friends;
