import React, { Component } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { db } from '../../firebase/config';

class UserSearch extends Component {
  constructor() {
    super();
    this.state = {
      searchQuery: '',
      searchResults: [],
      noResults: false,
    };
  }

  handleSearch = () => {
    const { searchQuery } = this.state;

    // Realiza la consulta a la base de datos para encontrar usuarios que coincidan con la búsqueda.
    db.collection('users')
      .where('email', '==', searchQuery) // O puedes cambiar 'email' por 'userName' según tu elección
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
      })
      .catch((error) => {
        console.error('Error al buscar usuarios:', error);
      });
  };

  render() {
    const { searchQuery, searchResults, noResults } = this.state;

    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Buscar por email o userName"
          value={searchQuery}
          onChangeText={(text) => this.setState({ searchQuery: text })}
        />
        <TouchableOpacity style={styles.searchButton} onPress={this.handleSearch}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
        {noResults && <Text style={styles.noResultsText}>El email/ userName no existe.</Text>}
        <FlatList
          data={searchResults}
          keyExtractor={(user) => user.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => {
                // Navegar al perfil del usuario, puedes implementar esto según tu enrutador
                console.log('Ir al perfil de', item.data.email); // O item.data.userName
              }}
            >
              <Text>{item.data.email}</Text> {/* O item.data.userName según tu elección */}
            </TouchableOpacity>
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
