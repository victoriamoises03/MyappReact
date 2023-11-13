import React, { Component } from 'react';
import { auth, db } from '../../firebase/config';
//import { TextInput, TouchableOpacity, View, Text, StyleSheet, AsyncStorage } from 'react-native';
//import { AsyncStorage } from 'react-native';
import { TextInput, TouchableOpacity, View, Text } from 'react-native';
import { StyleSheet } from 'react-native';


class Register extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      userName: '',
      password: '',
      bio: '',
      profileImage: '', 
      error: null,
      rememberMe: false, // Nuevo estado para recordar la sesión
    };
  }

  // Función para cambiar el estado de "Remember Me"
  toggleRememberMe = () => {
    this.setState((prevState) => ({
      rememberMe: !prevState.rememberMe,
    }));
  };

  // Función p/ realizar el registro 
  register = () => {
    const { email, password, userName, bio, profileImage, rememberMe } = this.state;

    if (!email || !password || !userName) {
      this.setState({ error: 'Por favor, complete todos los campos obligatorios.' });
      return;
    }

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        // Usuario registrado con éxito- redirigir a la pantalla de inicio de sesión.

        // Agrega el usuario a la colección "users" con datos adicionales.
        db.collection('users').doc(authUser.user.uid).set({
          userName,
          bio,
          profileImage,
        });

        // Guarda el estado de "Remember Me" en AsyncStorage si está ok
        if (rememberMe) {
          AsyncStorage.setItem('rememberMe', 'true');
        } else {
          AsyncStorage.removeItem('rememberMe');
        }

        this.props.navigation.navigate('Login');
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
  }

  render() {
    return (
      <View style={styles.formContainer}>
        <Text>Register</Text>
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
          onChangeText={(text) => this.setState({ userName: text })}
          placeholder='User Name'
          keyboardType='default'
          value={this.state.userName}
        />
        <TextInput
          style={styles.input}
          onChangeText={(text) => this.setState({ password: text })}
          placeholder='Password'
          keyboardType='default'
          secureTextEntry={true}
          value={this.state.password}
        />
        <TextInput
          style={styles.input}
          onChangeText={(text) => this.setState({ bio: text })}
          placeholder='Mini Bio'
          keyboardType='default'
          value={this.state.bio}
        />
        <TextInput
          style={styles.input}
          onChangeText={(text) => this.setState({ profileImage: text })}
          placeholder='Profile Image URL'
          keyboardType='default'
          value={this.state.profileImage}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.register()}
          disabled={!this.state.email || !this.state.password || !this.state.userName}
        >
          <Text style={styles.textButton}>Registrarse</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
          <Text>Ya tengo cuenta. Ir al login</Text>
        </TouchableOpacity>
        {/* Agregar el botón para "Remember Me" */}
        <View style={styles.rememberMeContainer}>
          <Text>Remember Me:</Text>
          <TouchableOpacity
            onPress={this.toggleRememberMe}
            style={styles.rememberMeButton}
          >
            {this.state.rememberMe ? (
              <Text style={styles.rememberMeText}>✅</Text>
            ) : (
              <Text style={styles.rememberMeText}>❌</Text>
            )}
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#28a745',
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
  errorText: {
    color: 'red',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  rememberMeButton: {
    marginLeft: 10,
    padding: 5,
    backgroundColor: '#f0f0f0',
  },
  rememberMeText: {
    fontSize: 20,
  },
});

export default Register;