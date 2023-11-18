import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../firebase/config';

const UserSearch = ({ route }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = db.collection('users').onSnapshot((docs) => {
      let users = [];
      docs.forEach((doc) => {
        users.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setUsuarios(users);
    });

    return () => unsubscribe();
  }, []);

  const controlarCambios = (text) => {
    setBusqueda(text);
  };

  const buscarUsuarios = () => {
    const busquedaLower = busqueda.toLowerCase();

    const resultados = usuarios.filter((usuario) =>
      usuario.data.userName.toLowerCase().includes(busquedaLower)
    );

    if (resultados.length === 0) {
      setResultados([]);
      setMensaje('No hay resultados que coincidan.');
    } else {
      setResultados(resultados);
      setMensaje('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        keyboardType="default"
        placeholder="Buscar por username"
        onChangeText={(text) => controlarCambios(text)}
        value={busqueda}
      />
      <TouchableOpacity style={styles.button} onPress={() => buscarUsuarios()}>
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>

      {mensaje ? (
        <Text style={styles.message}>{mensaje}</Text>
      ) : (
        <FlatList
          data={resultados}
          keyExtractor={(user) => user.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.userContainer}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('UserProfile', { userName: item.data.owner })
                }
              >
                <Text style={styles.userName}>User Name: {item.data.userName}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    marginBottom: 10,
    color: '#e74c3c',
  },
  userContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  userName: {
    fontSize: 16,
  },
});

export default UserSearch;
