import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { db } from '../../firebase/config';
import Profile from '../Profile/Profile';
import UserSearch from '../UserSearch/UserSearch';

const UserProfile = ({ route }) => {
  const { userName } = route.params;
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    // Consultar la base de datos para obtener los posteos del usuario
    db.collection('posts')
      .where('email', '==', userName)
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const posts = snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        setUserPosts(posts);
      });
  }, [userName]);

  return (
    <View>
      <Text>{userName}'s Profile</Text>
      <FlatList
        data={userPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.data.postContent}</Text>
            {/* Otros elementos del posteo */}
          </View>
        )}
      />
    </View>
  );
};

export default UserProfile;
