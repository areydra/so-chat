import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, FlatList, Text, TouchableOpacity, Dimensions } from 'react-native';
import firebase from 'firebase'
import _ from 'lodash'

import Search from '../components/Search'
import Card from '../components/Card'

const { width } = Dimensions.get('window')


class Friends extends Component {
    state = { 
        users : [],
        filtered: [],
        statusFilter: false
     }

     componentDidMount = () => {
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

     componentWillMount = () => {
         firebase.database().ref('users').on('child_added', users => {})
     }

     card = user => {
         return(
             <Card item={user.item} screen='friends' />
         )
     }

    handleSearch = async (searched) => {
        let filtered = _.filter(this.state.users, obj => {
            return _.startsWith(obj.name, searched)
        })
        await this.setState({ filtered, statusFilter: true })
    }


    render() { 
        let myUid = firebase.auth().currentUser
        let friends = []
        if(this.state.statusFilter){
            friends = this.state.filtered.filter(user => user.uid !== myUid.uid)
        }else{
            friends = this.state.users.filter(user => user.uid !== myUid.uid)
        }

        return (
            <SafeAreaView style={styles.container}>
                <Search onSearch={this.handleSearch} />

                <TouchableOpacity onPress={ () => this.props.navigation.navigate('Map', { show: 'all' }) }>
                    <Text style={{ textAlign: 'right', marginHorizontal: width / 30, color: '#F15249', fontWeight: 'bold' }}>Show all friends location</Text>
                </TouchableOpacity>
                <FlatList 
                    keyExtractor={item => item.uid}
                    data={friends}
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
});

export default Friends;
