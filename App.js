import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert,TouchableOpacity } from 'react-native';

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
    this.setState({email: email})
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
    
      <View>
        <TextInput placeholder='Email...' onChangeText={this.handleEmailInput} value ={this.state.email} />
        <TextInput placeholder='Password...' secureTextEntry={true} onChangeText={this.handlePasswordInput} value ={this.state.password} />
        
        <TouchableOpacity onPress={this.login}>
          <Text>Login!</Text>
        </TouchableOpacity>
      
        
      </View>

    );
  }

  

}

export default App;

