import React, { Component } from 'react';
import { auth } from '../../firebase/config';
import { TextInput, TouchableOpacity, View, Text, StyleSheet, AsyncStorage } from 'react-native';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      error: null,
      rememberMe: false,
    };
  }

  login = () => {
    const { email, password, rememberMe } = this.state;

    if (!email || !password) {
      this.setState({ error: 'Por favor, complete todos los campos obligatorios.' });
      return;
    }

    auth.signInWithEmailAndPassword(email, password)
      .then((authUser) => {
        if (rememberMe) {
          AsyncStorage.setItem('rememberMe', 'true')
            .then(() => {
              this.props.navigation.navigate('Home');
            })
            .catch((error) => {
              console.error('Error al almacenar la marca de Remember Me: ', error);
              this.props.navigation.navigate('Home');
            });
        } else {
          this.props.navigation.navigate('Home');
        }
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
  }

  render() {
    return (
      <View style={styles.formContainer}>
        <Text>Login</Text>
        {this.state.error && <Text style={styles.errorText}>{this.state.error}</Text>}
        <TextInput
          style={styles.input}
          onChangeText={(text) => this.setState({ email: text })}
          placeholder='Email'
          keyboardType='email-address'
          value={this.state.email}
        />
        <TextInput
          style={styles.input}
          onChangeText={(text) => this.setState({ password: text })}
          placeholder='Password'
          keyboardType='default'
          secureTextEntry={true}
          value={this.state.password}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.login()}
          disabled={!this.state.email || !this.state.password}
        >
          <Text style={styles.textButton}>Ingresar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => this.props.navigation.navigate('Registro')}
        >
          <Text style={styles.linkButtonText}>Registrarme</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => this.props.navigation.navigate('Registro')}
        >
          <Text style={styles.linkButtonText}>No tengo cuenta</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => this.setState({ rememberMe: !this.state.rememberMe })}
        >
          <Text style={styles.linkButtonText}>Recordarme</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  formContainer: {
    paddingHorizontal: 10,
    marginTop: 20,
  },
  input: {
    height: 20,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'solid',
    borderRadius: 6,
    marginVertical: 10,
  },
  button: {
    backgroundColor: 'blue',
    paddingHorizontal: 10,
    paddingVertical: 6,
    textAlign: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#28a745',
  },
  textButton: {
    color: '#fff',
  },
  linkButton: {
    marginVertical: 10,
  },
  linkButtonText: {
    color: 'blue',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
  },
});

export default Login;
