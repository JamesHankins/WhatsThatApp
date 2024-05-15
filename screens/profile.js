import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, Avatar, Button, Text, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Profile extends Component {

  constructor(props) {
  super(props);
  this.state = {
    userInfo: {
      first_name: "",
      last_name: "",
      email: "",
      user_id: "",
    },
    isLoading: true,
  }
  }

  async componentDidMount() {
    try {
      const { navigation } = this.props;
      const userInfo = await this.getUserInfo();
      this.unsubscribe = navigation.addListener('focus', () => {
        this.checkLoggedIn();
        this.updateUserDetails();
      });
      if (userInfo) {
        this.setState({ userInfo, isLoading: false });
      } 
    } catch (error) {
      console.log('Error');
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  async getUserInfo() {
    const sessionToken = await AsyncStorage.getItem('sessionToken');
    const userId = await AsyncStorage.getItem('userId');

    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
      method: 'GET',
      headers: {
        'X-Authorization': sessionToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        if (response.status === 200) {
          const data = await response.json();
          this.setState({isLoading: false,});
          return data;
        }
        if (response.status === 401) {
          console.log('Error: Unauthorized access');
          navigation.navigate('Login');
          return null;
        }
        if (response.status === 404) {
          throw new Error('Error: Page Not Found');
        } 
        else if (response.status === 500) {
          throw new Error('Error: Server Error');
        } 
        else {
          throw new Error('Error: Unknown Error');
        }
      })
      .catch((error) => {
        console.error(error);
        
      });
  }

  //Code from lecture slides: doesnt return as picture taking didnt work
  get_profile_image = async () => {
    try {
      const sessionToken = await AsyncStorage.getItem('sessionToken');
      fetch(`http://localhost:3333/api/1.0.0/user/20/photo`, {
        method: 'GET',
        headers: {
          'X-Authorization': sessionToken,
        }
      })
      .then ((res) => {
        return res.blob();
      })
      .then((resBlob) => {
        let data = URL.createObjectURL(resBlob);
        this.setState({
          photo: data,
        });
      })
    } catch(error) {
      console.log("Error: ", error);
    }
  };

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('sessionToken');
    const {navigation} = this.props;
    if (value == null) {
      navigation.navigate('Login');
    }
  };

  updateUserDetails = async () => {
    const userInfo = await this.getUserInfo();
    if (userInfo) {
      this.setState({ userInfo });
    } else {
      console.log("Error");
    }
  };

  async logout() {
    return fetch('http://localhost:3333/api/1.0.0/logout', {
      method: 'POST',
      headers: {
        'X-Authorization': await AsyncStorage.getItem('sessionToken'),
      },
    })
      .then(async (response) => {
        if (response.status === 200) {
          await AsyncStorage.removeItem('sessionToken');
          await AsyncStorage.removeItem('userId');
          this.checkLoggedIn();
        } 
        else if (response.status === 401) {
          console.log('Unauthorised');
          await AsyncStorage.removeItem('sessionToken');
          await AsyncStorage.removeItem('userId');
          this.checkLoggedIn();
        } 
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  }

  render() {

    const {navigation} = this.props;

    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator animating={true} color={'#25D366'} />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Appbar.Header style={styles.appbarHeader}>
          <Appbar.Content color="white" title="WhatsThat?" />
        </Appbar.Header>
        <View style={styles.content}>
          <Avatar.Image size={50} source={require('../images/profile.png')} />

          <Text variant="titleSmall" style={styles.profilePicture}>Profile Picture:</Text>

          <Text variant="headlineSmall">{this.state.userInfo.first_name} {this.state.userInfo.last_name}</Text>

          <Text variant="titleMedium">{this.state.email}</Text>

          <Text variant="titleMedium">Email: {this.state.userInfo.email}</Text>
          
          <Text variant="titleMedium">User ID:{this.state.userInfo.user_id}</Text>

          <Button  style={styles.link} mode="text" icon="camera" onPress={() => navigation.navigate('TakePicture')}>Update Profile Picture</Button>

          <Button  style={styles.link} mode="text" onPress={() => navigation.navigate('UpdateProfile')}>Update User Info</Button>

          <Button mode="contained" onPress={() => {this.logout();}}>Logout</Button>

        </View>
      </View>
    );
  }
}

export default Profile;

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
  link:{
    textDecorationLine: 'underline'
  },
  profilePicture:{
    marginTop: 10,
  },
});