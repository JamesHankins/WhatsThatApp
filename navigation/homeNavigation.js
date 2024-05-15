//Import react, react naviagation and tab navigator
import * as React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from 'react-native-vector-icons';

// Import your screen components
import ChatsNavigator from '../navigation/chatNavigation';
import ContactsNavigator from '../navigation/contactsNavigation';
import ProfileNavigator from '../navigation/profileNavigation';

//Creating tab navigator
const Tab = createMaterialBottomTabNavigator();

//Tab Navigation
export default function App() {
  return (
    <Tab.Navigator
      initialRouteName="Chats"
      activeColor="white"
      inactiveColor="white"
      barStyle={{ backgroundColor: '#075e54' }}
    >
      <Tab.Screen
        name="ChatsNavigator"
        component={ChatsNavigator}
        options={{
          tabBarLabel: 'Chats',
          tabBarIcon: ({  }) => (
            <MaterialCommunityIcons name="chat" color={'#d9001c'} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="ContactsNavigator"
        component={ContactsNavigator}
        options={{
          tabBarLabel: 'Contacts',
          tabBarIcon: ({ }) => (
            <MaterialCommunityIcons name="contacts" color={'#d9001c'} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileNavigator"
        component={ProfileNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({  }) => (
            <MaterialCommunityIcons name="account" color={'#d9001c'} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

