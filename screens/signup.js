import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import validator from 'email-validator';
import { Appbar, Button, TextInput, Text} from 'react-native-paper';
import styles from '../styles/loginsignup';

class Signup extends Component {
  
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

  handleSignup = () => {
    const { firstName, lastName, email, password } = this.state;
    
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
        errorMessage: "Please enter a stronger password. \n(8 or more characters including at least one uppercase letter, one number, and one special character: !@#$%^&*()_+-=[]{};:'\"\\|,.<>/?)"
      });
      return;
    }

    fetch('http://localhost:3333/api/1.0.0/user', {
      method: 'post',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password, }),
    })
    .then((response) => {
      if (response.status === 201) {
        console.log('User created :', response.json());
        navigation.navigate('Login');
      } else if (response.status === 400) {
        throw new Error('Email already exists');
      } else if (response.status === 500) {
        this.setState({ errorMessage: 'Server error' });
        throw new Error('Server error')
      }else {
        console.log('Error');
        throw new Error('Error');
      }
    })
    .catch((error) => {
      console.error(error);
      this.setState({ errorMessage: error.message });
    });
  };

  render() {
    const { email, password, firstName, lastName, errorMessage, successMessage } = this.state;
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <Appbar.Header style={styles.appbarHeader}>
          <Appbar.BackAction color='white' onPress={() => navigation.navigate('Login')} />
          <Appbar.Content color='white' title="Back to Login" />
        </Appbar.Header>
        <View style={styles.content}>
          <Text variant="displayMedium" >Sign Up</Text>
          <Text variant="bodyLarge" style={styles.text}>Please enter your details below:</Text>
          <TextInput
            label="First Name"
            value={firstName}
            onChangeText={this.handleFirstNameInput}
          />
          <TextInput
            label="Last Name"
            value={lastName}
            onChangeText={this.handleLastNameInput}
            style={styles.TextInput}
          />
          <TextInput
            label="Email"
            value={email}
            onChangeText={this.handleEmailInput}
            style={styles.TextInput}
          />  
          <TextInput
            label="Password"
            value={password}
            onChangeText={this.handlePasswordInput}
            style={styles.TextInput}
          />
          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
          <Button mode="contained" style={styles.button} onPress={this.handleSignup}>Sign Up</Button>
          {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}
        </View>
      </View>
    );
  }
}

export default Signup;