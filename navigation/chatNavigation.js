//Import react, react naviagation and stack navigator
import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Login, Signup and Home screen imports
import Chats from '../screens/chats';
import ViewChat from '../screens/viewChat';

//Creating Stack Navigator
const Stack = createNativeStackNavigator();

//Stack Navigator Container and Screens
export default function ChatNavigator() {
  return (
        <Stack.Navigator initialRouteName='Chats'>
          <Stack.Screen name="Chats" component={Chats} options={{headerShown: false}}/>
          <Stack.Screen name="ViewChat" component={ViewChat} options={{headerShown: false}}/>
        </Stack.Navigator>
  );
}
