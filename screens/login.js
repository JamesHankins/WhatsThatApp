import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import validator from 'email-validator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appbar, Button, TextInput, Text} from 'react-native-paper';
import styles from '../styles/loginsignup';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errorMessage: '',
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const { navigation } = this.props;
    const value = await AsyncStorage.getItem('sessionToken');
    if (value != null) {
      navigation.navigate('HomeNavigation');
    }
  }

  handleEmailInput = (email) => {
    this.setState({ email });
  };

  handlePasswordInput = (password) => {
    this.setState({ password });
  };

  handleSignupClick = () => {
    this.props.navigation.navigate('Signup');
  };

  handleLogin = () => {
    const { email, password } = this.state;

    if (!validator.validate(email)) {
      this.setState({ errorMessage: 'Invalid email address' });
      return;
    }

    fetch('http://localhost:3333/api/1.0.0/login', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        else if (response.status === 400) {
          throw new Error('Invalid details: Username or password');
        }
        else {
          throw new Error('Something went wrong');
        }
      })
      .then(async (responseJson) => {
        console.log(responseJson);
        try {
          const { navigation } = this.props;
          await AsyncStorage.setItem('sessionToken', responseJson.token);
          await AsyncStorage.setItem('userId', responseJson.id);
          navigation.navigate('HomeNavigation');
       
        } catch {
          throw new Error('Something wrong');
        }
      })
      .catch((error) => {
        this.setState({ errorMessage: error.message });
      });
  };

  render() {
    const { email, password, errorMessage } = this.state;
    return (
      <View style={styles.container}>
        <Appbar.Header style={styles.appbarHeader}>
          <Appbar.Content color="white" title="WhatsThat?" />
        </Appbar.Header>
        <View style={styles.content}>
          <Text variant="displayMedium">Login:</Text>
          <Text variant="bodyLarge">Please enter your login details:</Text>
          <TextInput
            label="Email"
            value={email}
            style={styles.TextInput}
            onChangeText={this.handleEmailInput}
          />
          <TextInput
            label="Password"
            secureTextEntry
            value={password}
            style={styles.TextInput}
            onChangeText={this.handlePasswordInput}
          />
          <Button mode="contained" style={styles.button} onPress={this.handleLogin}>
            Login
          </Button>
          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
          <TouchableOpacity onPress={this.handleSignupClick}>
            <Text variant="bodyLarge" style={styles.signupLink}>Don't have an account? Click here to sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
export default Login;