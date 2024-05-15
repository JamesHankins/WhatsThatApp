
//Import react, react naviagation and stack navigator
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Styling for react native paper
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from 'react-native-paper';



//Login, Signup and Home screen imports
import Login from './screens/login';
import Signup from './screens/signup';
import HomeNavigation from './navigation/homeNavigation';


//Styling for react native paper
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#075E54',
    secondary: '#128C7E',
  },
};

//Creating Stack Navigator
const Stack = createNativeStackNavigator();

//Stack Navigator Container and Screens
export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login'>
          <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
          <Stack.Screen name="Signup" component={Signup} options={{headerShown: false}}/>
          <Stack.Screen name="HomeNavigation" component={HomeNavigation} options={{headerShown: false}} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}