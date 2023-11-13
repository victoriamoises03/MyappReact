import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image, FlatList, Alert } from 'react-native';
import { auth, db } from '../../firebase/config';

// Importamos la cámara
import Camara from '../../components/Camara/Camara';

class Posteo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cantidadDeLikes: this.props.postData.data.likes.length,
      propioLike: false,
      comments: this.props.postData.data.comments,  // Corregido a "comments"
    };
  }

  componentDidMount() {
    if (this.props.postData.data.likes.includes(auth.currentUser.email)) {
      this.setState({
        propioLike: true,
      });
    }
  }

  like() {
    db.collection('posts')
      .doc(this.props.postData.id)
      .update({
        likes: [...this.props.postData.data.likes, auth.currentUser.email],
      })
      .then(() =>
        this.setState({
          cantidadDeLikes: this.state.cantidadDeLikes + 1,
          propioLike: true,
        })
      )
      .catch((e) => console.log(e));
  }

  dislike() {
    db.collection('posts')
      .doc(this.props.postData.id)
      .update({
        likes: this.props.postData.data.likes.filter((email) => email !== auth.currentUser.email),
      })
      .then(() =>
        this.setState({
          cantidadDeLikes: this.state.cantidadDeLikes - 1,
          propioLike: false,
        })
      )
      .catch((e) => console.log(e));
  }

  borrarPosteo() {
    Alert.alert(
      'Confirmar',
      '¿Estás seguro de que quieres borrar el posteo?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Borrar',
          onPress: () => {
            db.collection('posts')
              .doc(this.props.postData.id)
              .delete()
              .catch((e) => console.log(e));
          },
        },
      ]
    );
  }

  render() {
    return (
      <View>
        {this.props.postData.data.email === auth.currentUser.email ? (
          <TouchableOpacity onPress={() => this.borrarPosteo()}>
            <Text>Borrar Posteo</Text>
          </TouchableOpacity>
        ) : (
          <Text>No puedes realizar esta acción.</Text>
        )}

        <View>
          <Image
            style={styles.imagen}
            source={{ uri: this.props.postData.data.imageUrl }}  // Corregido a "imageUrl"
            resizeMode="cover"
          />
          <Text style={styles.description}>{this.props.postData.data.description}</Text>

          {this.state.propioLike ? (
            <TouchableOpacity onPress={() => this.dislike()}>
              <Text>Dislike</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => this.like()}>
              <Text>Like</Text>
            </TouchableOpacity>
          )}

          <Text>Cantidad de likes: {this.state.cantidadDeLikes}</Text>
        </View>

        <View>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('Comments', { id: this.props.postData.id })
            }
          >
            <Text>Ver Comentarios</Text>
          </TouchableOpacity>
          <Text>Comentarios: {this.state.comments.length}</Text>
        </View>

        <FlatList
          data={this.state.comments.slice(0, 3)}
          keyExtractor={(comment) => comment.id.toString()}
          renderItem={({ item }) => (
            <Text>
              {item.userName}: <Text>{typeof item.comentario === 'string' ? item.comentario : ''}</Text>
            </Text>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imagen: {
    width: 100,
    height: 100,
  },
  description: {
    fontSize: 16,
  },
});

export default Posteo;
