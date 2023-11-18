import React, { Component } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { db } from '../../firebase/config';
import Post from '../../components/Post/Post';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: this.props.route.params.userName,
      userPosts: [],
      userData: null,
    };
  }

  componentDidMount() {
    const { userName } = this.state;

    // Consultar la base de datos para obtener los posteos del usuario
    db.collection('posts')
      .where('email', '==', userName)
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const posts = snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        this.setState({
          userPosts: posts,
        });
      });

    // Consultar la base de datos para obtener los datos del usuario
    db.collection('users')
      .doc(userName)
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.setState({
            userData: doc.data(),
          });
        }
      });
  }

  render() {
    const { userData, userPosts } = this.state;

    return (
      <View style={styles.container}>
        {userData && (
          <View style={styles.userInfoContainer}>
            {userData.profileImage && (
              <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
            )}
            {userData.userName && (
              <Text style={styles.usernameText}>Nombre de usuario: {userData.userName}</Text>
            )}
            {userData.bio && <Text style={styles.bio}>Biografía: {userData.bio}</Text>}
            {userData.email && <Text style={styles.emailText}>Email: {userData.email}</Text>}
            <Text style={styles.postCountText}>
              Cantidad total de posteos: {userPosts.length}
            </Text>

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
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <Post postData={item} />}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  userInfoContainer: {
    // Estilos para el contenedor de la información del usuario
  },
  profileImage: {
    // Estilos para la imagen de perfil
  },
  usernameText: {
    // Estilos para el texto del nombre de usuario
  },
  bio: {
    // Estilos para el texto de la biografía
  },
  emailText: {
    // Estilos para el texto del correo electrónico
  },
  postCountText: {
    // Estilos para el texto de la cantidad de posteos
  },
  searchButton: {
    // Estilos para el botón de búsqueda de usuarios
  },
  searchButtonText: {
    // Estilos para el texto del botón de búsqueda de usuarios
  },
});

export default UserProfile;
