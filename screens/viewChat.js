//Import react, react naviagation components and email validator
import React, { Component } from 'react';
import { View, StyleSheet, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



import { Appbar, Button, TextInput, Text, Modal, Portal, List, ActivityIndicator} from 'react-native-paper';
import { ScrollView } from 'react-native-web';


class ViewChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatId: this.props.route.params.data,
      chatTitle: this.props.route.params.title, 
      messageToSend:'',
      userId: '',
      messages: [],
      members: [],
      userToAdd: '',        
      userToRemove: '',     
      updatedChatName: '',
      messageToEdit: '',
      isLoading: true,
      errorMessage:'',

    };
  }

  async componentDidMount() {
    await this.handleViewChat();
  }

  

  handleMessageToSendInput = (messageToSend) => {
    this.setState({messageToSend});
  };

  handleMessageToEdit = async () => {
      this.setState({messageToEdit})
  }

  //View chats 
  handleViewChat = async () => {
    const sessionToken = await AsyncStorage.getItem('sessionToken');
    const chatId = this.state.chatId;
    this.setState({isLoading: false });
    const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}`, {
      method: 'GET',
      headers: {
        'X-Authorization': sessionToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      console.log(data);
      this.setState({
        members: data.members,
        messages: data.messages,
        isLoading: false,
      });
      console.log(this.state.chats);
      
    } else if (response.status === 401) {
      const { navigation } = this.props;
      console.log('Unauthorized error');
      navigation.navigate('Login');
    } else if (response.status === 500) {
      throw new Error('Server Error');
    } else if (response.status === 403) {
      throw new Error('Forbidden');
    }else {
      this.setState({ errorMessage: 'Something went wrong' });
      throw new Error('Something went wrong');
    }
  }

  //Sending a message
  handleSendMessage = async () => {
    try {
      const sessionToken = await AsyncStorage.getItem('sessionToken');
      const { chatId, messageToSend } = this.state;
      if (!messageToSend) {
        this.setState({ errorMessage: 'Enter a message' });
        return;
      }
      const body = {
        message: messageToSend,
      };
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/message`, {
        method: 'POST',
        headers: {
          'X-Authorization': sessionToken,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (response.status === 200) { 
        console.log('Message Sent');
        await this.handleViewChat();
        this.setState({
          messageToSend: '',
        });
      } else if (response.status === 400) {
        throw new Error('Bad Request');
      } else if (response.status === 401) {
        const { navigation } = this.props;
        console.log('Unauthorized error');
        navigation.navigate('Login');
      } else if (response.status === 403) {
        throw new Error('Forbidden Error');
      } else {
        throw new Error(`Unhandled status code: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  };

  //Updating chat name
  handleUpdateChatName = async () => {
    try {
      const sessionToken = await AsyncStorage.getItem('sessionToken');
      const { chatId, updatedChatName } = this.state;
      if (!updatedChatName) {
          this.setState({ errorMessage: 'Enter a new chat name ' });
          return;
      }
      const body = {
          name: updatedChatName,
      };
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}`, {
          method: 'PATCH',
          headers: {
          'X-Authorization': sessionToken,
          Accept: 'application/json',
          'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
      if (response.status === 200) {
          this.setState({ errorMessage: 'The chat name has been updated' });
          this.setState({chatTitle: updatedChatName, updatedChatName: '',});
          this.handleViewChat();
      } else if (response.status === 401) {
          const { navigation } = this.props;
          console.log('Unauthorized error');
          navigation.navigate('Login');
      } else if (response.status === 500) {
          throw new Error('Server Error');
      }
    }
    catch (error) {
        console.error(error);
    }
  };

  //Adding user to chat
  handleAddUserToChat = async (userId) => {
    try {
      const sessionToken = await AsyncStorage.getItem('sessionToken');
      const { chatId, userToAdd } = this.state; 
    
    
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/user/${userToAdd}`, {
        method: 'POST',
        headers: {
          'X-Authorization': sessionToken,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        this.setState({ errorMessage: 'User added' });
        this.handleViewChat();
        this.setState({ userToAdd: '' });
      } else if (response.status === 400) {

        this.setState({ errorMessage: 'The user already a member of the chat or not on your contacts'});
      } else if (response.status === 401) {
        const { navigation } = this.props;
        console.log('Unauthorized error');
        navigation.navigate('Login');
      } else if (response.status === 404) {
        this.setState({ errorMessage: 'Error: Not Found' });
        throw new Error('Not Found');
      }else if (response.status === 403) {
        this.setState({ errorMessage: 'You cannot add this user' });
        throw new Error('Forbidden');
      } else if (response.status === 500) {
        throw new Error('Server Error');
      }
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  };  

//Removing user from chat
handleRemoveUserFromChat = async () => {
  try {
    const sessionToken = await AsyncStorage.getItem('sessionToken');
    const { chatId, userToRemove } = this.state;  
    
    const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/user/${userToRemove}`, {
      method: 'DELETE',
      headers: {
        'X-Authorization': sessionToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 200) {
      this.setState({ errorMessage: 'User Removed' });
      this.handleViewChat();
      this.setState({ userToRemove: '' });
    } else if (response.status === 401) {
      const { navigation } = this.props;
      console.log('Unauthorized error');
      navigation.navigate('Login');
    } else if (response.status === 403) {
      this.setState({ errorMessage: 'Error: Forbidden' });
      throw new Error('Forbidden');
    } else if (response.status === 404) {
      this.setState({ errorMessage: 'Error: Not Found' });
      throw new Error('Not Found');
    } else if (response.status === 500) {
      throw new Error('Server Error');
    }
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
  
};

//Editing a message:
handleMessageToEdit = async () => {
  try {
    const sessionToken = await AsyncStorage.getItem('sessionToken');
    const { chatId, messageToEdit} = this.state;
    const messageId = this.state.selectedMessageModalItem.message_id;
    if (!messageToEdit) {
        this.setState({ errorMessage: 'Please enter the edited message' });
        return;
    }
    const body = {
        message: messageToEdit,
    };
    const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/message/${messageId}`, {
        method: 'PATCH',
        headers: {
        'X-Authorization': sessionToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    if (response.status === 200) {
        this.setState({ errorMessage: 'The message  has been updated' });
        this.setState({messageToEdit: '',});
        this.handleViewChat();
    } else if (response.status === 401) {
      const { navigation } = this.props;
      console.log('Unauthorized error');
      navigation.navigate('Login');
    } else if (response.status === 403) {
      const { navigation } = this.props;
      this.setState({ errorMessage: 'You can only edit your own messages' });
    }  else if (response.status === 500) {
      throw new Error('Server Error');
    }
  }
  catch (error) {
      console.error(error);
  }
};

//Deleting a message:
handleMessageToDelete = async () => {
  try {
    const sessionToken = await AsyncStorage.getItem('sessionToken');
    const {chatId} = this.state;
    const messageId = this.state.selectedMessageModalItem.message_id;
  
    const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/message/${messageId}`, {
      method: 'DELETE',
      headers: {
        'X-Authorization': sessionToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 200) {
      this.setState({ errorMessage: 'Message Deleted' });
      await this.handleViewChat();
    } else if (response.status === 401) {
      const { navigation } = this.props;
      console.log('Unauthorized error');
      navigation.navigate('Login');
    } else if (response.status === 403) {
      this.setState({ errorMessage: 'You can only delete your own messages' });
      throw new Error('Forbidden');
    } else if (response.status === 500) {
      throw new Error('Server Error');
    }
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};


  

showChatModal = () => this.setState({ isChatModalVisible: true });
hideChatModal = () => this.setState({ isChatModalVisible: false });

showMessageModal = () => this.setState({ isMessageModalVisible: true });
hideMessageModal = () => this.setState({ isMessageModalVisible: false });

render() {
  const { messageToSend } = this.state;
  const { navigation } = this.props;
  const { chatTitle, errorMessage } = this.state; 
  const containerStyle = {backgroundColor: 'white', padding: 20};

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
          <Appbar.BackAction color='white' onPress={() => navigation.navigate('Chats')} />
          <Appbar.Content color='white' title={chatTitle} />
          <Appbar.Action icon="dots-vertical" color='white' onPress={this.showChatModal} />
        </Appbar.Header>

        <Portal>
            <Modal style={styles.modalContainer} visible={this.state.isChatModalVisible} onDismiss={this.hideChatModal} contentContainerStyle={containerStyle}>
            <Text variant="titleLarge" style={styles.modalTitle}>Chat Management:</Text>
            <Text variant="titleMedium" style={styles.modalContent}>Update The Chats Name:</Text>
            <TextInput style={styles.modalContent}
              label="Update The Chats Name:"
              value={this.state.updatedChatName}
              onChangeText={updatedChatName => this.setState({ updatedChatName })}
            />
            <Button style={styles.modalContent} mode="contained" onPress={this.handleUpdateChatName}>Update</Button>

            <Text variant="titleMedium" style={styles.modalContent}>Add a user to the chat:</Text>
            <TextInput style={styles.modalContent}
              label="User ID"
              value={this.state.userToAdd}
              onChangeText={userToAdd => this.setState({ userToAdd })}
            />
            <Button style={styles.modalContent} mode="contained" onPress={this.handleAddUserToChat}>Add User</Button>

            <Text variant="titleMedium" style={styles.modalContent} >Remove a user to the chat:</Text>
            <TextInput style={styles.modalContent}
              label="User ID"
              value={this.state.userToRemove} 
              onChangeText={userToRemove => this.setState({ userToRemove })}
            />
            <Button  style={styles.modalContent} mode="contained" onPress={this.handleRemoveUserFromChat}>Remove User</Button>

            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
            </Modal>
        </Portal>

        <Portal>
            <Modal  style={styles.modalContainer} visible={this.state.isMessageModalVisible} onDismiss={this.hideMessageModal} contentContainerStyle={containerStyle}>
              
            <Text variant="headlineMedium" style={styles.modalTitle}>Message Details:</Text>
              <Text style={styles.modalContent} variant="titleMedium">Message ID: {this.state.selectedMessageModalItem ? this.state.selectedMessageModalItem.message_id : ""}</Text>
              <Text style={styles.modalContent} variant="titleMedium">Author: {this.state.selectedMessageModalItem ? this.state.selectedMessageModalItem.author.first_name : ""} {this.state.selectedMessageModalItem ? this.state.selectedMessageModalItem.author.last_name : ""}</Text>
              <Text style={styles.modalContent} variant="titleMedium">Message: {this.state.selectedMessageModalItem ? this.state.selectedMessageModalItem.message : ""}</Text>

              <Text style={styles.modalContent} variant="titleLarge">Edit Message:</Text>
              <TextInput style={styles.modalContent} label="Edit Message" value={this.state.messageToEdit} onChangeText={messageToEdit => this.setState({ messageToEdit })}/>
              
              <Button style={styles.modalContent} mode="contained" onPress={this.handleMessageToEdit}>Edit Message</Button>

              <Button style={styles.modalContent} mode="contained" onPress={this.handleMessageToDelete}>Delete Message</Button>
              {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
              
          </Modal>
        </Portal>

        <ScrollView  ref={ref => this.scrollView = ref} onContentSizeChange={() => { this.scrollView.scrollToEnd({ animated: true }) }}contentContainerStyle={styles.content}>

          {
            this.state.messages.length === 0 && 
            <Text style={{padding: 16, textAlign: 'center'}}>
              No messages available. Start a conversation now!
            </Text>
          }
          {
 
          this.state.messages.slice().reverse().map((message, index) => (
            <View key={message.message_id} style={styles.listMessageStyle}>
                <List.Item
                    title={`${message.author.first_name} ${message.author.last_name}`}
                    description={message.message}
                    left={props => <List.Icon {...props} icon="account" />}
                    onPress={() => {
                        this.setState({selectedMessageModalItem: message}); 
                        this.showMessageModal();
                    }}
                />
            </View>
          ))
          }
        
      </ScrollView>

      <View style={styles.sendMessageContainer}>
            <TextInput
              label="Send a message..."
              value={messageToSend}
              onChangeText={this.handleMessageToSendInput}
              style={styles.sendMessageInput}
            />
            <Button mode="contained" onPress={this.handleSendMessage} style={styles.sendMessageButton}>
              Send
            </Button>
          </View>
      </View>
    );
}




}
export default ViewChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent:'flex-start',
    
  },

  appbarHeader:{
    backgroundColor: '#075E54',
  },

  listItemStyle: {
    borderBottomWidth: 1, 
    borderBottomColor: 'black'
  },

  sendMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ECE5DD',
  },

  sendMessageInput: {
    flex: 1,
    marginRight: 20,
  },
  sendMessageButton: {
    alignSelf: 'center',
    marginRight: 10, 
  },

  modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  
  modalTitle: {
    },
  
  modalContent: {
     marginTop: 10,
  },
  
});