import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert,TouchableOpacity, StyleSheet } from 'react-native';
import * as EmailValidator from 'email-validator'

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      email: "",
      password: "",
      error: ""

    }
  }

  handleEmailInput = (email) => {
    //Validation here
    if (EmailValidator.validate(email) == true) {
      this.setState({email: email})
    } 
    else{
      console.log("Login Pressed!")
    }
    
  }

  handlePasswordInput = (password) => {
    //Validation here
    this.setState({password: password})
  }
  
  

  login = () => {
    console.log("Login Pressed!")
  }

  


  render() {
    return (
    
      <View style={styles.container}>
        <TextInput placeholder='Email...' onChangeText={this.handleEmailInput} value ={this.state.email} />
        <TextInput placeholder='Password...' secureTextEntry={true} onChangeText={this.handlePasswordInput} value ={this.state.password} />
        
        <TouchableOpacity onPress={this.login}>
          <Text>Login!</Text>
        </TouchableOpacity>
      
        
      </View>

    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#eaeaea',
  },
  title: {
    marginTop: 16,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: '#20232a',
    borderRadius: 6,
    backgroundColor: '#61dafb',
    color: '#20232a',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default App;

