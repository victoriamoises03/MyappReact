import React, { Component } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { db } from '../../firebase/config';

class UserSearch extends Component {
  constructor() {
    super();
    this.state = {
      searchQuery: '',
      searchResults: [],
      noResults: false,
      loading: false,
    };
  }

handleSearch = () => {
    const { searchQuery } = this.state;
  
    // Realiza la consulta a la colección 'users' para encontrar usuarios que coincidan con la búsqueda.
    db.collection('users')
      .where('userName', '>=', searchQuery)
      .where('userName', '<=', searchQuery + '\uf8ff')
      .get()
      .then((querySnapshot) => {
        const results = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
  
        if (results.length > 0) {
          this.setState({ searchResults: results, noResults: false });
        } else {
          this.setState({ searchResults: [], noResults: true });
        }
  
        // Agrega esta línea para limpiar la barra de búsqueda
        this.setState({ searchQuery: '' });
      })
      .catch((error) => {
        console.error('Error al buscar usuarios por userName:', error);
      });
  };
  

  render() {
    const { searchQuery, searchResults, noResults, loading } = this.state;

    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Buscar por userName"
          value={searchQuery}
          onChangeText={(text) => this.setState({ searchQuery: text })}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={this.handleSearch}
          disabled={searchQuery.trim() === ''}
        >
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
        {noResults && <Text style={styles.noResultsText}>No hay usuarios que coincidan.</Text>}
        <FlatList
      data={searchResults}
      keyExtractor={(user) => user.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.resultItem}
          onPress={() => {
            // Navegar al perfil del usuario
            navigation.navigate('UserProfile', { userName: item.data.userName });
          }}
        >
          <Text>{item.data.userName}</Text>
        </TouchableOpacity>
      )}
      keyboardShouldPersistTaps="handled"
    />
        {loading && <ActivityIndicator size="large" color="#3498db" />}
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  searchButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  noResultsText: {
    color: 'red',
    marginBottom: 10,
  },
  resultItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
});

export default UserSearch;
