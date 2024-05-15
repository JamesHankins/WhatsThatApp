import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import {Button, Text, TextInput, Appbar} from 'react-native-paper';

class UpdateProfile extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { navigation } = this.props;
        return (
            <View style={styles.container}>
                <Appbar.Header style={styles.appbarHeader}>
                    <Appbar.BackAction color='white' onPress={() => navigation.navigate('Profile')} />
                    <Appbar.Content color='white' title={'Back to Profile'} />
                </Appbar.Header>
                <View style={styles.content}>
                    <Text variant="titleLarge" >Take a Profile Picture</Text>  
                </View>
            </View>
        );
    }
}

export default UpdateProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    appbarHeader:{
        backgroundColor: '#075E54',
    },
});