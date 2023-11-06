import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { auth, db } from '../../firebase/config';

class Home extends Component {
  constructor() {
    super();
    this.state = {
      posts: [],
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
        this.setState({ posts });
      });
  }

  render() {
    const { posts } = this.state;

    return (
      <View>
        <Text>HOME</Text>
        <TouchableOpacity onPress={() => auth.signOut()}>
          <Text>Logout</Text>
        </TouchableOpacity>

        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.postContainer}>
              <Text style={styles.username}>{item.data.username}</Text>
              <Image source={{ uri: item.data.imageUrl }} style={styles.postImage} />
              <Text style={styles.likesCount}>{item.data.likes} Likes</Text>
              <Text style={styles.commentsCount}>Comments: {item.data.comments}</Text>
              <TouchableOpacity
                style={styles.likeButton}
                onPress={() => {
                  // Agrega lógica para dar like o deslike a la publicación
                }}
              >
                <Text>Like</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.commentsButton}
                onPress={() => {
                  // Redirige a la página de comentarios
                }}
              >
                <Text>View Comments</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  postContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 10,
    padding: 10,
    borderRadius: 5,
  },
  username: {
    fontWeight: 'bold',
  },
  postImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
  },
  likesCount: {
    marginTop: 5,
  },
  commentsCount: {
    marginTop: 5,
  },
  likeButton: {
    marginTop: 5,
  },
  commentsButton: {
    marginTop: 5,
  },
});

export default Home;
