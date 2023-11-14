import { Text, View, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import React, { Component } from 'react';
import { db, auth } from '../../firebase/config';
import firebase from 'firebase';

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newComment: "",
      id: "",
      data: {},
      visibleComments: 3, // Mostrar inicialmente 3 comentarios
    };
  }

  componentDidMount() {
    db.collection("posts")
      .doc(this.props.route.params.id)
      .onSnapshot(doc => {
        this.setState({ id: doc.id, data: doc.data() });
      });
  }

  addComment(id, comentario) {
    db.collection("posts")
      .doc(id)
      .update({
        comentarios: firebase.firestore.FieldValue.arrayUnion({
          owner: auth.currentUser.email,
          createdAt: Date.now(),
          comentario: comentario,
        }),
      });
  }

  showMoreComments() {
    const additionalComments = 3; // Puedes ajustar la cantidad de comentarios adicionales a mostrar
    this.setState((prevState) => ({
      visibleComments: prevState.visibleComments + additionalComments,
    }));
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.data.comentarios && this.state.data.comentarios.length > 0 ? (
          <View>
            <FlatList
              data={this.state.data.comentarios.slice(0, this.state.visibleComments)}
              keyExtractor={item => item.createdAt.toString()}
              renderItem={({ item }) => (
                <View style={styles.commentContainer}>
                  <Text style={styles.ownerText}>{item.owner}:</Text>
                  <Text style={styles.commentText}>{item.comentario}</Text>
                </View>
              )}
            />
            {this.state.data.comentarios.length > this.state.visibleComments && (
              <TouchableOpacity onPress={() => this.showMoreComments()} style={styles.viewMoreButton}>
                <Text style={styles.viewMoreButtonText}>Ver más comentarios</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <Text>No hay comentarios aún.</Text>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={text => this.setState({ newComment: text })}
            keyboardType='default'
            placeholder='Agrega un comentario'
            value={this.state.newComment}
            style={styles.input}
          />
          <TouchableOpacity onPress={() => this.addComment(this.state.id, this.state.newComment)} style={styles.commentButton}>
            <Text style={styles.commentButtonText}>Comentar</Text>
          </TouchableOpacity>
        </View>
        <Text onPress={() => this.props.navigation.navigate("TabNavigation")} style={styles.goBackText}>
          Volver a home
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  commentContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    paddingBottom: 10,
    marginBottom: 10,
  },
  ownerText: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  commentText: {
    color: '#333333',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    padding: 10,
    marginRight: 10,
  },
  commentButton: {
    padding: 10,
    backgroundColor: '#3897f0',
    borderRadius: 5,
  },
  commentButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  goBackText: {
    marginTop: 20,
    color: '#3897f0',
    textDecorationLine: 'underline',
  },
  viewMoreButton: {
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
    marginTop: 10,
  },
  viewMoreButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default Comment;
