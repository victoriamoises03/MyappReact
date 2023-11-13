import React, { Component } from 'react';
import { TextInput, TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';
import { auth, db } from '../../firebase/config';

// Importamos la cámara
import Camara from "../../components/Camara/Camara";

class PostForm extends Component {
  constructor() {
    super();
    this.state = {
      imageUrl: "",  // Corregido a "imageUrl"
      description: "",
      createdAt: "",
      showCamera: true,
      likes: [],
      comments: [],  // Corregido a "comments"
    };
  }

  createPost() {
    db.collection("posts").add({
      email: auth.currentUser.email,
      imageUrl: this.state.imageUrl,  // Corregido a "imageUrl"
      description: this.state.description,
      likes: [],
      comments: [],
      createdAt: new Date(),
    })
    .then(() => {
      this.setState({
        description: "",
        imageUrl: "",  // Corregido a "imageUrl"
        createdAt: "",
        showCamera: true,
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
      imageUrl: url,  // Corregido a "imageUrl"
      showCamera: false,
    });
  }

  render() {
    return (
      <View>
        <Text>
          Hacé un posteo nuevo!
        </Text>

        <View>
          {this.state.showCamera ? (
            <Camara onImageUpload={url => this.onImageUpload(url)} />
          ) : (
            <View>
              <TextInput
                placeholder='Agrega una descripción'
                keyboardType='default'
                onChangeText={(text) => this.setState({ description: text })}
                value={this.state.description}
              />

              <TouchableOpacity onPress={() => this.createPost()}>
                Postear
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }
}

export default PostForm;
