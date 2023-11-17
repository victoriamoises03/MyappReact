import React, { Component } from 'react';
import { TextInput, TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';
import { auth, db } from '../../firebase/config';

// Importamos la cámara
import Camara from "../../components/Camara/Camara";

class PostForm extends Component {
  constructor() {
    super();
    this.state = {
      imageUrl: "",
      description: "",
      createdAt: "",
      mostrarCamara: true,
      likes: [],
      comments: [],
    };
  }

  createPost() {
    console.log('ID del usuario autenticado:', auth.currentUser.uid);
    db.collection("posts").add({
      userId: auth.currentUser.uid,
      email: auth.currentUser.email,
      imageUrl: this.state.imageUrl,
      description: this.state.description,
      likes: [],
      comments: [],
      createdAt: new Date(),
    })
      .then(() => {
        this.setState({
          description: "",
          imageUrl: "",
          createdAt: "",
          mostrarCamara: true,
          likes: [],
          comments: [],
        });

        this.props.navigation.navigate("Home");
      })
      .catch(error => {
        console.error("Error al crear el posteo:", error);
      });
  }

  onImageUpload(url) {
    this.setState({
      imageUrl: url,
      mostrarCamara: false,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Hacé un posteo nuevo!
        </Text>

        <View style={styles.formContainer}>
          {this.state.mostrarCamara ? (
            <Camara onImageUpload={url => this.onImageUpload(url)} />
          ) : (
            <View style={styles.postForm}>
              <TextInput
                style={styles.input}
                placeholder='Agrega una descripción'
                keyboardType='default'
                onChangeText={text => this.setState({ description: text })}
                value={this.state.description}
              />

              <TouchableOpacity style={styles.postButton} onPress={() => this.createPost()}>
                <Text style={styles.postButtonText}>Postear</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formContainer: {
    width: '80%',
  },
  postForm: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  postButton: {
    backgroundColor: '#4285F4',
    padding: 10,
    borderRadius: 5,
  },
  postButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default PostForm;
