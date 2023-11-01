import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {auth} from "./src/firebase/config"

export default function App() {
  function register(email, pass){
    auth.createUserWithEmailAndPassword(email, pass)
    .then(response =>{
      this.setState({registered: true});
    })
    .catch(error => {
      this.setState({error: 'Fallo en el registro.'})
    })
  }
  function login (email,pass){
    auth.signInWithEmailAndPassword(email, pass)
    .then(response =>{
      this.setState({loggedIn: true});
    })
    .catch(error => {
      this.setState({error: 'Credenciales invalidas.'})
    })
  }
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
