import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import { auth, db } from '../../firebase/config';

class Posteo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cantidadDeLikes: this.props.postData.data.likes.length,
      propioLike: false,
      comments: this.props.postData.data.comments || [],
      newComment: '',
      user: this.props.user, // Agregamos el usuario al estado
    };
  }

  componentDidMount() {
    if (auth.currentUser && this.props.postData.data.likes.includes(auth.currentUser.email)) {
      this.setState({
        propioLike: true,
      });
    }
  }

  like() {
    const { postData } = this.props;
    db.collection('posts')
      .doc(postData.id)
      .update({
        likes: [...postData.data.likes, auth.currentUser.email],
      })
      .then(() =>
        this.setState((prevState) => ({
          cantidadDeLikes: prevState.cantidadDeLikes + 1,
          propioLike: true,
        }))
      )
      .catch((e) => console.log(e));
  }

  dislike() {
    const { postData } = this.props;
    db.collection('posts')
      .doc(postData.id)
      .update({
        likes: postData.data.likes.filter((email) => email !== auth.currentUser.email),
      })
      .then(() =>
        this.setState((prevState) => ({
          cantidadDeLikes: prevState.cantidadDeLikes - 1,
          propioLike: false,
        }))
      )
      .catch((e) => console.log(e));
  }

  borrarPosteo() {
    const { postData } = this.props;
    const currentUser = auth.currentUser;

    if (currentUser && currentUser.email) {
      const currentUserEmail = currentUser.email;

      if (postData.data.email === currentUserEmail) {
        db.collection('posts')
          .doc(postData.id)
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
  
    if (currentUser && currentUser.providerData && currentUser.providerData.length > 0) {
      const newComment = {
        userName: currentUser.providerData[0].displayName,
        comment: this.state.newComment,
        createdAt: new Date(),
      };
  
      // Actualiza el estado de comentarios
      this.setState(
        (prevState) => ({
          comments: [...prevState.comments, newComment],
          newComment: '', // Limpiar el campo del nuevo comentario
        }),
        () => {
          // Actualizar la colección en la base de datos después de actualizar el estado
          db.collection('posts')
            .doc(this.props.postData.id)
            .update({
              comments: this.state.comments,
            })
            .then(() => {
              console.log('Comentario agregado correctamente.');
            })
            .catch((error) => {
              console.error('Error al agregar el comentario:', error);
            });
        }
      );
    } else {
      console.warn('No hay un usuario autenticado o la información del usuario es nula o el comentario está vacío.');
      // Mostrar un mensaje al usuario informándole que necesita estar autenticado y agregar un comentario válido.
    }
  }
  

  render() {
    const { postData, user } = this.props;
    console.log (postData)
    return (
      <View>
        {postData.data.email === auth.currentUser.email ? (
      <TouchableOpacity onPress={() => this.borrarPosteo()}>
        <Text>Borrar Posteo</Text>
      </TouchableOpacity>
        ) : (
      <Text>Publicado por: {postData.data.email} </Text>
      )}

        <View>
          <Image style={styles.imagen} source={{ uri: postData.data.imageUrl }} resizeMode="cover" />
          <Text style={styles.description}>{postData.data.description}</Text>

          {this.state.propioLike ? (
            <TouchableOpacity onPress={() => this.dislike()}>
              <Text>👎 No me gusta</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => this.like()}>
              <Text>👍 Me gusta</Text>
            </TouchableOpacity>
          )}

          <Text>Cantidad de likes: {this.state.cantidadDeLikes}</Text>
        </View>

        <View>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Comments', { comments: this.state.comments })}>
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
          <Button
            title="Comentar"
            onPress={() => this.addComment()}
            disabled={this.state.newComment.trim() === ''}
          />

          {/* Mostrar todos los comentarios */}
          <FlatList
            data={this.state.comments}
            keyExtractor={(item, index) => index.toString()} // Usamos el índice como clave en lugar de "id"
            renderItem={({ item }) => (
              <Text>
                {item.userName}: {item.comment}
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
    width: '50vh',
    height: '50vh',
    backgroundColor: 'red',
  },
  description: {
    fontSize: 16,
  },
});

export default Posteo;
