import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, TextInput, Appbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import validator from 'email-validator';

class UpdateProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            errorMessage: '',
            successMessage: '',
        };
    }

    passwordChecker = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
        return passwordRegex.test(password);
    };

    handleFirstNameInput = (firstName) => {
        this.setState({ firstName });
    };

    handleLastNameInput = (lastName) => {
        this.setState({ lastName });
    };

    handleEmailInput = (email) => {
        this.setState({ email });
    };

    handlePasswordInput = (password) => {
        this.setState({ password });
    };

    handleUpdate = async () => { 
        const { firstName, lastName, email, password } = this.state;
        const sessionToken = await AsyncStorage.getItem('sessionToken');
        const userId = await AsyncStorage.getItem('userId');

        if (!firstName || !lastName) {
            this.setState({ errorMessage: 'Please enter both first and last name' });
            return;
        }
  
        if (!validator.validate(email)) {
            this.setState({ errorMessage: 'Invalid email address' });
            return;
        }
  
        if (!this.passwordChecker(password)) {
            this.setState({
                errorMessage: "Please enter a strong password. \n(8 or more characters including at least one uppercase letter, one number, and one special character: !@#$%^&*()_+-=[]{};:'\"\\|,.<>/?)"
            });
            return;
        }
  
        fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
            method: 'PATCH',
            headers: {
                'X-Authorization': sessionToken,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: password,
            }),
        })
        .then((response) => {
            if (response.status === 200) {
                navigation.navigate('Profile');
            } else if (response.status === 400) {
                this.setState({ errorMessage: 'Bad Request' });
                throw new Error('Error: Bad Request');
            } 
            else if (response.status === 403) {
              this.setState({ errorMessage: 'Forbidden' });
              throw new Error('Error: Bad Request');
          } else {
                console.log('Error');
                throw new Error('Error');
            }
        })
        .catch((error) => {
            console.error(error);
            this.setState({ errorMessage: error.message });
        });
    }

    render() {
        const { email, password, firstName, lastName, errorMessage, successMessage } = this.state;
        const { navigation } = this.props;

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.appbarHeader}>
                <Appbar.BackAction color='white' onPress={() => navigation.navigate('Profile')} />
                <Appbar.Content color='white' title={'Back to Profile'} />
            </Appbar.Header>
  
            <View style={styles.content}>
                <Text variant="headlineMedium" style={styles.profileChangeTitle}>Change your details below:</Text>
                <TextInput 
                    style={styles.profileChangeContent}
                    label="First Name"
                    value={firstName}
                    onChangeText={this.handleFirstNameInput} 
                />
                <TextInput 
                    style={styles.profileChangeContent}
                    label="Last Name"
                    value={lastName}
                    onChangeText={this.handleLastNameInput} 
                />
                <TextInput 
                    style={styles.profileChangeContent}
                    label="Email"
                    value={email}
                    onChangeText={this.handleEmailInput}
                />
                <TextInput 
                    style={styles.profileChangeContent}
                    label="Password"
                    value={password}
                    onChangeText={this.handlePasswordInput}
                />
                {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
                <Button 
                    mode="contained" 
                    style={styles.profileChangeContent} 
                    onPress={this.handleUpdate}
                >
                    Update Details
                </Button>
                {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}
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
    appbarHeader: {
        backgroundColor: '#075E54',
    },
    profileChangeTitle: {
        textAlign: 'center',
        marginBottom: 10,
    },
    profileChangeContent: {
        marginBottom: 10,
    },
});