import React, { Component , useState} from 'react';
import { Text, TextInput, View, Button, Alert,TouchableOpacity, StyleSheet  } from 'react-native';
import * as EmailValidator from 'email-validator';
import PasswordChecklist from "react-password-checklist";

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      email: "",
      password: "",
      error: ""
    }
  }
  isPasswordStrong = () => {

  }

  handleEmailInput = (email) => {
    this.setState({email: email})
  }

  handlePasswordInput = (password) => {
    if(password.length() < 8){

    }
    this.setState({password: password})
  }

  
  
  handleLogin = () => {
    
      this.setState({error:""})
      
      if (!EmailValidator.validate(this.state.email)) {
        this.setState({error:"Invalid Email"})
        console.log("Invalid Email");
        return;
      }
      else{
        this.setState({error:""})
        console.log("Loggin In");
      }



      
    
  }
  
render() {
  return (
    
      <View>
        <TextInput placeholder='Email...' onChangeText={this.handleEmailInput} value ={this.state.email} />
        <TextInput placeholder='Password...' secureTextEntry={true} onChangeText={this.handlePasswordInput} value ={this.state.password} />
        
        <TouchableOpacity onPress={this.handleLogin}>
          <Text>Login!</Text>
        </TouchableOpacity>

        
        
        {this.state.error ? <Text>{this.state.error }</Text>: null}

      </View>

    )
  }

}


export default App;

