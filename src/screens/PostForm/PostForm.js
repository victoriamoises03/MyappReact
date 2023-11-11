import React, { Component } from 'react';
import { TextInput, TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';
import { auth, db } from '../../firebase/config';

//Importamos camara//

import Camara from "../../components/Camara/Camara"


class PostForm extends Component {
  constructor() {
    super();
    this.state = {
      imagen: "",
      description: "",
      createdAt: "",
      showCamera: true, 
      likes: [],
      comentarios: [],
    };
  }


  createPost() {

    db.collection("posts").add({
      email: auth.currentUser.email,
      imagen: this.state.imagen,
      description: this.state.description,
      likes: [],
      comentarios: [],
      createdAt: Date.now()
    }).then(()=>{
      this.setState({
        description: "",
        imagen: "", 
        createdAt: "",
        showCamera: true,
        likes: [],
        comentarios: [],
      })
      this.props.navigation.navigate("Home")
    }).catch(error)
  }


onImageUpload(url){
  this.setState({
    imagen: url,
    showCamera: false,
  })
}



render(){

  return (
<View>
      <Text>
        Hacé un posteo nuevo!
      </Text>

      <View>
        
        {
          this.state.showCamera ? 
            <Camara onImageUpload={url => this.onImageUpload(url)}  />
: 
    <View>
    <TextInput
              placeholder='Agrega una descripcion'
              keyboardType='default'
              onChangeText={(text) => this.setState({ description: text })}
              value={this.state.description}
            />

    <TouchableOpacity onPress={() => this.createPost()}>
      Postear
    </TouchableOpacity>
    </View>
  

    }
    </View>
    </View>
  )
}
}
    

export default PostForm