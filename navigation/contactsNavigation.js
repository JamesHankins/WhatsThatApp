//Import react, react naviagation and stack navigator
import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Login, Signup and Home screen imports
import Contacts from '../screens/contacts';


//Creating Stack Navigator
const Stack = createNativeStackNavigator();

//Stack Navigator Container and Screens
export default function ContactsNavigator() {
  return (
        <Stack.Navigator initialRouteName='Profile'>
          <Stack.Screen name="Contacts" component={Contacts} options={{headerShown: false}}/>
        </Stack.Navigator>
  );
}
