import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image, FlatList, TextInput, Button, Alert } from 'react-native';
import { auth, db } from '../../firebase/config';

class Posteo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cantidadDeLikes: this.props.postData.data.likes.length,
      propioLike: false,
      comments: this.props.postData.data.comments,
      newComment: '',
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
    const currentUser = auth.currentUser;

    if (currentUser && currentUser.email) {
      const currentUserEmail = currentUser.email;

      if (this.props.postData.data.email === currentUserEmail) {
        const postId = this.props.postData.id;

        db.collection('posts')
          .doc(postId)
          .delete()
          .then(() => {
            console.log('Posteo borrado exitosamente.');
          })
          .catch((error) => {
            console.error('Error al borrar el posteo:', error);
          });
      } else {
        Alert.alert('Acción no permitida', 'No puedes borrar el posteo de otro usuario.');
      }
    } else {
      console.log('No hay un usuario autenticado o el correo electrónico es nulo.');
    }
  }

  addComment() {
    const currentUser = auth.currentUser;

    if (currentUser && currentUser.displayName) {
      const newComment = {
        userName: currentUser.displayName,
        comentario: this.state.newComment,
      };

      const updatedComments = [...this.state.comments, newComment];

      db.collection('posts')
        .doc(this.props.postData.id)
        .update({
          comments: updatedComments,
        })
        .then(() => {
          this.setState({
            comments: updatedComments,
            newComment: '',
          });
          console.log('Comentario agregado correctamente.');
        })
        .catch((error) => {
          console.error('Error al agregar el comentario:', error);
        });
    } else {
      console.error('No hay un usuario autenticado o el nombre de usuario es nulo.');
    }
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
            source={{ uri: this.props.postData.data.imageUrl }}
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

        <View>
          {/* Agregar un nuevo comentario */}
          <TextInput
            placeholder="Añadir un comentario..."
            value={this.state.newComment}
            onChangeText={(text) => this.setState({ newComment: text })}
          />
          <Button title="Comentar" onPress={() => this.addComment()} />

          {/* Mostrar todos los comentarios */}
          <FlatList
            data={this.state.comments}
            keyExtractor={(comment) => comment.id.toString()}
            renderItem={({ item }) => (
              <Text>
                {item.userName}: {item.comentario}
              </Text>
            )}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imagen: {
    width: "50vh",
    height: "50vh",
    backgroundColor: "red"
  },
  description: {
    fontSize: 16,
  },
});

export default Posteo;

