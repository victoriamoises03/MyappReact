import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { auth, db } from '../../firebase/config';
import Post from '../../components/Post/Post';

class Home extends Component {
  constructor() {
    super();
    this.state = {
      posteos: [],
    };
  }

  componentDidMount() {
    // Consulta la base de datos para obtener las publicaciones ordenadas por fecha descendente.
    db.collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        const posts = snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        this.setState({
          posteos: posts,
        });
      });
  }

  render() {
    const { posteos } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Publicaciones Recientes</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={() => auth.signOut()}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
        <FlatList
          data={posteos}
          keyExtractor={(onePost) => onePost.id.toString()}
          renderItem={({ item }) => <Post postData={item} />}
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
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Home;
