import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    justifyContent: 'center', 
    padding: 20,
  },
  
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  signupLink: {
    marginTop: 10,
    color: 'black',
    textDecorationLine: 'underline',
  },

  appbarHeader:{
    backgroundColor: '#075E54',
  },

  success: {
    color: 'green',
    marginTop: 10,
  },

  TextInput: {
      marginTop: 10,
  },

  text: {
      marginBottom: 20,
  },

  signupLink:{
     marginTop: 10,
     textDecorationLine: 'underline',
  },

  button: {
      marginTop: 20,
  }
  
  });
  
  export default styles;