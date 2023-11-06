import React, { Component } from 'react';
import { TextInput, TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';
import ImagePicker from 'react-native-image-picker'; 
import { auth, db } from '../../firebase/config';

class PostForm extends Component {
  constructor() {
    super();
    this.state = {
      textoPost: '',
      image: null, // Agrega un estado para la imagen seleccionada
    };
  }

  openImagePicker = () => {
    const options = {
      title: 'Seleccionar una imagen',
      mediaType: 'photo',
      maxWidth: 500,
      maxHeight: 500,
    };

    // Abre el selector de imágenes
    ImagePicker.showImagePicker(options, (response) => {
      if (!response.didCancel && !response.error) {
        const source = { uri: response.uri };
        this.setState({ image: source });
      }
    });
  };

  createPost = () => {
    const { textoPost, image } = this.state;
    const user = auth.currentUser;

    if (user && textoPost) {
      // Guarda la imagen en el almacenamiento o en Firebase Storage.
      // Luego, guarda la referencia de la imagen y el texto en la colección "posts".

      db.collection('posts')
        .add({
          imageUrl: 'URL de la imagen almacenada',
          description: textoPost,
          timestamp: new Date(),
          createdBy: user.email,
          likes: [],
          comments: [],
        })
        .then(() => {
          // Limpiar el formulario después de guardar el posteo
          this.setState({
            textoPost: '',
            image: null,
          });
        })
        .catch((error) => {
          console.error('Error al guardar el posteo: ', error);
        });
    } else {
      console.error('Por favor, complete todos los campos requeridos.');
    }
  };

  render() {
    return (
      <View style={styles.formContainer}>
        <Text>New Post</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => this.setState({ textoPost: text })}
          placeholder='Escribir...'
          keyboardType='default'
          value={this.state.textoPost}
        />
        {this.state.image && (
          <Image source={this.state.image} style={styles.imagePreview} />
        )}
        <TouchableOpacity style={styles.button} onPress={this.openImagePicker}>
          <Text style={styles.textButton}>Seleccionar una imagen</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={this.createPost}>
          <Text style={styles.textButton}>Postear</Text>
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
    backgroundColor: '#28a745',
    paddingHorizontal: 10,
    paddingVertical: 6,
    textAlign: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#28a745',
    marginTop: 10,
  },
  textButton: {
    color: '#fff',
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
});

export default PostForm;
