import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import { auth, db } from '../../firebase/config';
import Post from '../../components/Post/Post';

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      userPosts: [],
    };
  }

  componentDidMount() {
    this.unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });

        // Consultar la base de datos para obtener los posteos del usuario actual
        db.collection('posts')
          .where('userId', '==', user.uid)
          .orderBy('timestamp', 'desc')
          .onSnapshot((snapshot) => {
            const posts = snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }));
            this.setState({ userPosts: posts });
          });
      } else {
        this.setState({ user: null, userPosts: [] });
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  handleLogout = () => {
    auth.signOut()
      .then(() => {
        // Logout exitoso, redirigir al usuario a la pantalla de login
        this.props.navigation.navigate('Login');
      })
      .catch((error) => {
        console.error('Error al cerrar sesión:', error.message);
      });
  };

  handleDeletePost = (postId) => {
    // Lógica para eliminar el posteo
    db.collection('posts').doc(postId).delete()
      .then(() => {
        console.log('Posteo eliminado correctamente');
      })
      .catch((error) => {
        console.error('Error al eliminar el posteo:', error.message);
      });
  };

  render() {
    const { user, userPosts } = this.state;

    return (
      <View>
        {user && (
          <View>
            <Text>Nombre de usuario: {user.userName}</Text>
            <Text>Email: {user.email}</Text>
            {user.photoURL && <Image source={{ uri: user.photoURL }} style={styles.profileImage} />}
            {user.bio && <Text>Mini Bio: {user.bio}</Text>}
            <Text>Cantidad total de posteos: {userPosts.length}</Text>

            <TouchableOpacity onPress={this.handleLogout}>
              <Text>Logout</Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          data={userPosts}
          keyExtractor={(onePost) => onePost.id.toString()}
          renderItem={({ item }) => (
            <Post
              postData={item}
              onDelete={() => this.handleDeletePost(item.id)}
              isOwnPost={item.data.userId === user.uid}
            />
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 10,
  },
});

export default Profile;
