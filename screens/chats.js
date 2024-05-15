import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, Button, Text, TextInput, ActivityIndicator, Modal, Portal, List,  FAB} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Chats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newChatName: '',
      chats:[],
      isModalVisible: false,
      errorMessage: '',
      isLoading: false,
    }
  }

  async componentDidMount() {
    await this.handleGetChat();
    this.intervalId = setInterval(this.handleGetChat.bind(this), 10000);
    this.checkLoggedIn();
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  handleNewChatNameInput = (newChatName) => {
    this.setState({newChatName});
  };

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('sessionToken');
    if (value == null) {
      AsyncStorage.removeItem('sessionToken'); 
      const {navigation} = this.props;
      navigation.navigate('Login');
    }
  };

  handleCreateChat = async () => {
    const sessionToken = await AsyncStorage.getItem('sessionToken');
    const { newChatName } = this.state;

    if (!newChatName) {
      this.setState({ errorMessage: 'Please enter a chat name' });
      return;
    }
    const body = {
      name: newChatName,
    };

    fetch('http://localhost:3333/api/1.0.0/chat', {
      method: 'POST',
      headers: {
        'X-Authorization': sessionToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    .then(async (response) => {
      if (response.status === 201) {
        const data = await response.json();
        console.log(data);
        const chats = await this.handleGetChat();
        if (chats) {
          this.setState({ chats, newChatName: '' });
        }
      } else if (response.status === 401) {
        const { navigation } = this.props;
        console.log('Unauthorized');
        navigation.navigate('Login');
        return null;
      } else if (response.status === 400) {
        throw new Error('Bad Request');
      } else {
        throw new Error('Something went wrong');
      }
      return null;
    })
    .catch((error) => {
      console.error(error);
      this.setState({ errorMessage: error.message });
    });
  };

  handleGetChat = async () => {
    const sessionToken = await AsyncStorage.getItem('sessionToken');
    const response = await fetch('http://localhost:3333/api/1.0.0/chat', {
      method: 'GET',
      headers: {
        'X-Authorization': sessionToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      this.setState({ chats: data });
      console.log(this.state.chats);
    } else if (response.status === 401) {
      const { navigation } = this.props;
      console.log('Unauthorized');
      navigation.navigate('Login');
    } else if (response.status === 500) {
      throw new Error('Server Error');
    } else {
      throw new Error('Something went wrong');
    }
  }

  openModal = () => this.setState({ isModalVisible: true });

  closeModal = () => this.setState({ isModalVisible: false });

  render() {
    const {navigation} = this.props;
    const containerStyle = {backgroundColor: 'white', padding: 20};

    const { newChatName, errorMessage, chats, isLoading } = this.state;

    if (isLoading) {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <ActivityIndicator animating={true} color={'#25D366'} />
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Appbar.Header style={styles.appbarHeader}>
          <Appbar.Content color="white" title="WhatsThat?" />
        </Appbar.Header>

        <ScrollView  contentContainerStyle={styles.content}>
          <Text variant="headlineLarge">Chats:</Text>

          {
            chats.length === 0 && 
            <Text style={{padding: 16, textAlign: 'center'}}>
              No chats available. Start a conversation now!
            </Text>
          }
          {
            chats.map((chat, index) => (
              <View key={chat.chat_id} style={styles.listItemStyle}>
                <List.Item
                  title={chat.name}
                  description={chat.last_message.content} 
                  left={props => <List.Icon {...props} icon="message" />}
                  onPress={() => navigation.navigate('ViewChat', {
                    data: chat.chat_id,
                    title: chat.name,
                    getChats: this.handleGetChat.bind(this),
                  })}
                />
              </View>
            ))
          }
          
          <Portal>
            <Modal style={styles.modalContainer} visible={this.state.isModalVisible} onDismiss={this.closeModal} contentContainerStyle={containerStyle}>
              <Text style={styles.modalTitle} variant="headlineMedium">Start Conversation:</Text>
              <Text style={styles.modalContent} variant="bodyLarge">Enter a chat name to start a conversation!</Text>
              <TextInput  style={styles.modalContent} label="Chat Name" value={newChatName} onChangeText={this.handleNewChatNameInput}/>
              {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
              <Button  style={styles.modalContent} mode="contained"  onPress={this.handleCreateChat}>Create Chat</Button>
            </Modal>
          </Portal>

        </ScrollView>

        <FAB
          style={styles.fab}
          color="white"
          icon="plus"
          onPress={this.openModal}
        />
      </View>
    );
  }
}

export default Chats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent:'flex-start',
    padding: 20,
  },
  appbarHeader:{
    backgroundColor: '#075E54',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#d9001c',
  },
  listItemStyle: {
    borderBottomWidth: 1, 
    borderBottomColor: 'black'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    textAlign: "center"
  },
  modalContent: {
    marginTop: 10,
  },
});