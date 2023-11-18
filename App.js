import React, { useState, useEffect } from 'react';
import { StyleSheet, AsyncStorage } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { auth } from './src/firebase/config';
import { useNavigation } from '@react-navigation/native';

import Register from './src/screens/Register/Register';
import Login from './src/screens/Login/Login';
import Home from './src/screens/Home/Home';
import PostForm from './src/screens/PostForm/PostForm';
import Profile from './src/screens/Profile/Profile';
import UserSearch from './src/screens/UserSearch/UserSearch';
import UserProfile from './src/screens/UserProfile/UserProfile';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ProfileStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MiPerfil"
        component={Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}


function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Crear Post"
        component={PostForm}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="plus" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Buscar Usuarios"
        component={UserSearch}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="search" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkRememberMe = async () => {
      try {
        const rememberMe = await AsyncStorage.getItem('rememberMe');
        if (rememberMe === 'true') {
          const firebaseUser = auth.currentUser;
          if (firebaseUser) {
            setUser(firebaseUser);
          }
        }
      } catch (error) {
        console.error('Error al recuperar el estado de Remember Me: ', error);
      }
    };

    checkRememberMe();

    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen
            name="Inicio"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Registro"
              component={Register}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
