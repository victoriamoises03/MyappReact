import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { auth, db } from '../../firebase/config';
import Post from '../../components/Post/Post'

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
          posteos: posts});
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
          data={this.state.posteos}
          keyExtractor={(onePost) => onePost.id.toString()}
          renderItem={({ item }) => <Post postData ={item} />}
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
