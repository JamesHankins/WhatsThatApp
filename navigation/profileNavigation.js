//Import react, react naviagation and stack navigator
import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Login, Signup and Home screen imports
import Profile from '../screens/profile';
import UpdateProfile from '../screens/updateProfile';
import TakePicture from '../screens/takePicture';

//Creating Stack Navigator
const Stack = createNativeStackNavigator();

//Stack Navigator Container and Screens
export default function ProfileNavigator() {
  return (
        <Stack.Navigator initialRouteName='Profile'>
          <Stack.Screen name="Profile" component={Profile} options={{headerShown: false}}/>
          <Stack.Screen name="UpdateProfile" component={UpdateProfile} options={{headerShown: false}} />
          <Stack.Screen name="TakePicture" component={TakePicture} options={{headerShown: false}}/>
        </Stack.Navigator>
  );
}
