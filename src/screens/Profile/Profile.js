import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import { auth, db } from '../../firebase/config';
import Post from '../../components/Post/Post';
import { useNavigation } from '@react-navigation/native';
import UserSearch from '../UserSearch/UserSearch';

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
        // Realiza una consulta a la base de datos para obtener el nombre de usuario
        db.collection('users')
          .doc(user.uid)
          .get()
          .then((userDoc) => {
            if (userDoc.exists) {
              const userData = userDoc.data();
              this.setState({ user: { ...user, userName: userData.userName } });
            }
          })
          .catch((error) => {
            console.error('Error al obtener el nombre de usuario:', error.message);
          });
  
        // Consultar la base de datos para obtener los posteos del usuario actual
        db.collection('posts')
          .where('email', '==', user.userName) 
          .orderBy('createdAt', 'desc')
          .onSnapshot((snapshot) => {
            console.log('Documentos de posts:', snapshot.docs);
            const posts = snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }));
            console.log('Posts recuperados:', posts);
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
    auth
      .signOut()
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
    db.collection('posts')
      .doc(postId)
      .delete()
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
      <View style={styles.container}>
        {user && (
          <View style={styles.userInfoContainer}>
            <Image
              source={{ uri: user.photoURL }}
              style={styles.profileImage}
            />
            <Text style={styles.usernameText}>Nombre de usuario: {user.userName}</Text>
            <Text style={styles.emailText}>Email: {user.email}</Text>
            <Text style={styles.postCountText}>
              Cantidad total de posteos: {userPosts.length}
            </Text>

            <TouchableOpacity style={styles.logoutButton} onPress={this.handleLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => this.props.navigation.navigate('Buscar Usuarios')}
            >
              <Text style={styles.searchButtonText}>Buscar Usuarios</Text>
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  userInfoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 10,
  },
  usernameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  emailText: {
    fontSize: 16,
    marginVertical: 5,
  },
  postCountText: {
    fontSize: 16,
    marginVertical: 5,
  },
  logoutButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  searchButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Profile;
