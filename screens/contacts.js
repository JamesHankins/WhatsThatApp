import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, Button, Text, TextInput, ActivityIndicator, Modal, Portal, Chip, List, Searchbar} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Contacts extends Component {

  constructor(props) {
  super(props);
  this.state = {
    userToAdd: '',
    userToRemove: '',
    userToBlock: '',
    userToUnblock: '',
    errorMessage: '',
    searchString: '',
    contacts: [],
    blockedContacts: [],
    searchResults: [],
    isLoading: false,
  }
  }

  async componentDidMount() {
    try {
      const contacts = await this.handleGetContacts();
      if (contacts) {
        this.setState({ contacts });
      }

      const blockedContacts = await this.handleGetBlockedContacts();
      if (blockedContacts) {
        this.setState({ blockedContacts });
      }
      console.log(contacts);
      console.log(blockedContacts);
    } catch (error) {
      console.log('Error');
    }
  }


  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('sessionToken');
    const {navigation} = this.props;
    if (value == null) {
      navigation.navigate('Login');
    }
  };

  handleUserToAddInput = (userToAdd) => {
    this.setState({userToAdd});
  };

  handleUserToRemoveInput = (userToRemove) => {
    this.setState({userToRemove});
  };

  handleUserToBlockInput = (userToBlock) => {
    this.setState({userToBlock});
  };

  handleUserToUnblockInput = (userToUnblock) => {
    this.setState({userToUnblock});
  };


  
  //Add a user
  handleAddUser = async () => {

    const userId = this.state.userToAdd;
     if (!userId) {
      this.setState({ errorMessage: 'Please enter a user Id' });
      return;
    }
    const sessionToken = await AsyncStorage.getItem('sessionToken');
    this.userToAdd
    this.setState({ modalVisible: false });
    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/contact`, {
      method: 'Post',
      headers: {
        'X-Authorization': sessionToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        if (response.status === 200) {
          console.log('Contact Added successfully');
          this.setState({ errorMessage: 'Contact Added successfully' });
          const contacts = await this.handleGetContacts();
          
          if (contacts ) {
            this.setState({ contacts});
          }
        } else if (response.status === 401) {
          const { navigation } = this.props;
          console.log('Unauthorized');
          navigation.navigate('Login');
        } else if (response.status === 500) {
          throw new Error('Server Error');
        }else if (response.status === 400) {
          this.setState({ errorMessage: 'You cant add yourself as a contact' });
          throw new Error('You cant add yourself');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

 

    //Delete a user from contacts
    handleRemoveUser = async () => {

      const userId = this.state.userToRemove;

     if (!userId) {
      this.setState({ errorMessage: 'Please enter a user Id' });
      return;
    }

      const sessionToken = await AsyncStorage.getItem('sessionToken');
      return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/contact`, {
        method: 'DELETE',
        headers: {
          'X-Authorization': sessionToken,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(async (response) => {
          if (response.status === 200) {
            this.setState({ errorMessage: 'Contact deleted successfully' });
            const contacts = await this.handleGetContacts();
            if (contacts) {
              this.setState({contacts});
            }
          } else if (response.status === 401) {
            const { navigation } = this.props;
            console.log('Unauthorized');
            navigation.navigate('Login');
          } else if (response.status === 500) {
            throw new Error('Server Error');
          } else if (response.status === 400) {
            this.setState({ errorMessage: 'You cant remove yourself as a contact' });
            throw new Error('You cant add yourself');
          }else {
            this.setState({ errorMessage: 'Unable to delete contact' });
            throw new Error('Something went wrong');
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }

    //Get Contacts:
    handleGetContacts = async () => {
      const sessionToken = await AsyncStorage.getItem('sessionToken');
      
      return fetch('http://localhost:3333/api/1.0.0/contacts', {
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
            return data;
          }
          if (response.status === 401) {
            const { navigation } = this.props;
            console.log('Unauthorized ');
            navigation.navigate('Login');
            return null;
          }
          if (response.status === 500) {
            throw new Error('Server Error');
          } else {
            throw new Error('Something went wrong');
          }
        })
        .catch((error) => {
          console.error(error);
          return null;
        });

    }

    //Block a user 
    handleBlockUser = async () => {
      const sessionToken = await AsyncStorage.getItem('sessionToken');

      const userId = this.state.userToBlock;
  
      if (!userId) {
          this.setState({ errorMessage: 'Please enter a user Id' });
      return;
    }
      return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/block`, {
        method: 'POST',
        headers: {
          'X-Authorization': sessionToken,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(async (response) => {
          if (response.status === 200) {
            this.setState({ errorMessage: 'Contact blocked successfully' });
            const contacts = await this.handleGetContacts();
            const blockedContacts = await this.handleGetBlockedContacts();
            if (contacts && blockedContacts) {
              this.setState({ contacts, blockedContacts });
            }
          } else if (response.status === 400) {
            this.setState({ errorMessage: 'You cant block yourself' });
            throw new Error('You cant block yourself');
          } else if (response.status === 401) {
            const { navigation } = this.props;
            console.log('Unauthorized');
            navigation.navigate('Login');
          } else if (response.status === 500) {
            throw new Error('Server Error');
          } else {
            throw new Error('Something went wrong');
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  
  //Unblock a user 
  handleUnblockUser = async () => {
    const sessionToken = await AsyncStorage.getItem('sessionToken');

    const userId = this.state.userToUnblock;
  
      if (!userId) {
          this.setState({ errorMessage: 'Please enter a user Id' });
      return;
      }

    return fetch(`http://localhost:3333/api/1.0.0/user/${userId}/block`, {
      method: 'DELETE',
      headers: {
        'X-Authorization': sessionToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        if (response.status === 200) {
          this.setState({ errorMessage: 'Contact unblocked successfully' });
          const contacts = await this.handleGetContacts();
          const blockedContacts = await this.handleGetBlockedContacts();
          if (contacts && blockedContacts) {
            this.setState({ contacts, blockedContacts });
          }
        } else if (response.status === 400) {
          this.setState({ errorMessage: 'You cant unblock yourself' });
          throw new Error('You cant block yourself');
        } else if (response.status === 401) {
          const { navigation } = this.props;
          console.log('Unauthorized');
          navigation.navigate('Login');
        } else if (response.status === 500) {
          throw new Error('Server Error');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }


  //Get blocked users
  handleGetBlockedContacts = async () => {
    const sessionToken = await AsyncStorage.getItem('sessionToken');
    return fetch('http://localhost:3333/api/1.0.0/blocked', {
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
          return data;
        }
        if (response.status === 401) {
          const { navigation } = this.props;
          console.log('Unauthorized error');
          navigation.navigate('Login');
          return null;
        }
        if (response.status === 500) {
          throw new Error('Server Error');
        } else {
          throw new Error('Something went wrong');
        }
      })
      .catch((error) => {
        console.error(error);
        return null;
      });

  }

  handleSearch = async () => {
    const { searchString } = this.state;
    const sessionToken = await AsyncStorage.getItem('sessionToken');

    const url = `http://localhost:3333/api/1.0.0/search?q=${searchString}&search_in=all&limit=20&offset=0`;

    return fetch(url, {
        method: 'GET',
        headers: {
          "X-Authorization": sessionToken,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
    })
    .then(async response => {
        if(response.status === 200) {
            const data = await response.json();
            console.log(data);
            this.setState({ searchResults: data });
            return data;
        } else if(response.status === 401) {
            const { navigation } = this.props;
            console.log('Unauthorized error');
            navigation.navigate('Login');
            return;
        } else if(response.status === 500) {
            throw new Error('Server Error');
        } else if(response.status === 400) {
          throw new Error('Bad Request');
        } else {
            throw new Error('Something went wrong');
        }
    })
    .catch(error => {
        console.error(error);
    });
}


  showAddModal = () => this.setState({ isAddModalVisible: true });
  hideAddModal = () => this.setState({ isAddModalVisible: false });
    
  showRemoveModal = () => this.setState({ isRemoveModalVisible: true });
  hideRemoveModal = () => this.setState({ isRemoveModalVisible: false });

  showBlockModal = () => this.setState({ isBlockModalVisible: true });
  hideBlockModal = () => this.setState({ isBlockModalVisible: false });

  showUnblockModal = () => this.setState({ isUnblockModalVisible: true });
  hideUnblockModal = () => this.setState({ isUnblockModalVisible: false });
  
  render() {

    const {navigation} = this.props;
    const containerStyle = {backgroundColor: 'white', padding: 20};
    const { userToAdd, errorMessage, userToRemove, userToBlock, userToUnblock} = this.state;

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
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.contactsContainer}>
          <Text variant="headlineLarge">Contacts:</Text>
          <Text variant="titleLarge" style={styles.contactsContent}>Your Contacts:</Text>
          <View style={styles.chipContainer}>
            <Chip mode="outlined" style={styles.chip} icon="plus" onPress={this.showAddModal}>
              Add User
            </Chip>
            <Chip mode="outlined" style={styles.chip} icon="close" onPress={this.showRemoveModal}>
              Remove User
            </Chip>
          </View>
          <Portal>
            <Modal style={styles.modalContainer} visible={this.state.isAddModalVisible} onDismiss={this.hideAddModal} contentContainerStyle={containerStyle}>
              <Text variant="headlineMedium" style={styles.modalTitle}>Add Contact:</Text>
              <Text style={styles.modalContent} variant="bodyLarge">Add a user to your contacts by entering their user ID</Text>
              <TextInput  label="UserID" value={userToAdd} onChangeText={this.handleUserToAddInput}/>
              {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
              <Button style={styles.modalContent} mode="contained"  onPress={this.handleAddUser}>Add User</Button>
            </Modal>
          </Portal>
          <Portal>
            <Modal style={styles.modalContainer} visible={this.state.isRemoveModalVisible} onDismiss={this.hideRemoveModal} contentContainerStyle={containerStyle}>
              <Text variant="headlineMedium" style={styles.modalTitle}>Remove Contact:</Text>
              <Text style={styles.modalContent} variant="bodyLarge">Remove a user from your contacts by entering their user ID</Text>
              <TextInput  label="UserID" value={userToRemove} onChangeText={this.handleUserToRemoveInput}/>
              {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
              <Button style={styles.modalContent} mode="contained"  onPress={this.handleRemoveUser}>Remove User</Button>
            </Modal>
          </Portal>
          {this.state.contacts && this.state.contacts.length > 0 && this.state.contacts.map((contact, index) => (
            <List.Item
              key={index.toString()}
              title={`${contact.first_name} ${contact.last_name}`}
              description={`UserID: ${contact.user_id}`}
              left={props => <List.Icon {...props} icon="account" />}
            />
          ))}
        </View>
        <View style={styles.contactsContainer}>
          <Text variant="titleLarge" style={styles.contactsContent}>Your Blocked Users:</Text>
          <View style={styles.chipContainer}>
            <Chip mode="outlined" style={styles.chip} icon="plus" onPress={this.showBlockModal}>
              Block User
            </Chip>
            <Chip mode="outlined" style={styles.chip} icon="close" onPress={this.showUnblockModal}>
              Unblock User
            </Chip>
          </View>
          <Portal>
            <Modal style={styles.modalContainer} visible={this.state.isBlockModalVisible} onDismiss={this.hideBlockModal} contentContainerStyle={containerStyle}>
              <Text variant="headlineMedium" style={styles.modalTitle}>Block Contact:</Text>
              <Text style={styles.modalContent} variant="bodyLarge">Block a contact by entering their user ID</Text>
              <TextInput label="UserID" value={userToBlock} onChangeText={this.handleUserToBlockInput}/>
              {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
              <Button style={styles.modalContent} mode="contained"  onPress={this.handleBlockUser}>Block User</Button>
            </Modal>
          </Portal>
          <Portal>
            <Modal style={styles.modalContainer} visible={this.state.isUnblockModalVisible} onDismiss={this.hideUnblockModal} contentContainerStyle={containerStyle}>
              <Text variant="headlineMedium" style={styles.modalTitle}>Unblock Contact:</Text>
              <Text style={styles.modalContent} variant="bodyLarge">Unblock a user from your contacts by entering their user ID</Text>
              <TextInput  label="UserID" value={userToUnblock} onChangeText={this.handleUserToUnblockInput}/>
              {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
              <Button style={styles.modalContent} mode="contained"  onPress={this.handleUnblockUser}>Unblock User</Button>
            </Modal>
          </Portal>
          {this.state.blockedContacts && this.state.blockedContacts.length > 0 && this.state.blockedContacts.map((blockedContact, index) => (
            <List.Item
              key={index.toString()}
              title={`${blockedContact.first_name} ${blockedContact.last_name}`}
              description={`UserID: ${blockedContact.user_id}`}
              left={props => <List.Icon {...props} icon="account" />}
            />
          ))}
        </View>

        <View style={styles.contactsContainer}>
          <Text variant="titleLarge" style={styles.contactsContent}>Search for a user:</Text>
          <Searchbar
            placeholder="Search"
            onChangeText={(text) => this.setState({ searchString: text })}
            value={this.state.searchString} 
            style={styles.contactsContent}
          />
          <Button style={styles.contactsContent} icon="magnify" mode="contained" onPress={this.handleSearch}>
            Search
          </Button>
          {this.state.searchResults && this.state.searchResults.length > 0 &&
            this.state.searchResults.map((result, index) => (
              <List.Item
                key={index.toString()}
                title={`${result.given_name} ${result.family_name}`}
                description={`User ID: ${result.user_id}`}
                right={props => <List.Icon {...props} icon="account" color='#d9001c'/>}
              />
            ))
          }
        </View>
    </ScrollView>
    </View>
        );
      }
    }

export default Contacts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'left',
    padding: 20,
  },
  appbarHeader:{
    backgroundColor: '#075E54',
  },

  chipContainer: {
    flexDirection: 'row',
    justifyContent: 'left',
  },
  chip: {
    width: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
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
    textAlign: "center"
  },

  contactsContainer:{
    padding: 10,
  },

  contactsContent:{
    marginBottom: 10,
  },
});