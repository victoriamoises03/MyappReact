import Reac, {Component} from "react";
import { Text, View, TouchableOpacity, StyleSheet, Image, FlatList} from "react-native";
import firebase from "firebase"
import {auth , db} from "../firebase/config"


class Posteo extends Component { 
    constructor(props) {
        super(props)
        this.state = {
            cantidadDeLikes: this.props.postData.data.likes.length,
            propioLike: false, 
            comentarios: this.props.postData.data.comments
        }
    }

    //Chequear que si ya tengo el puessto el like o no tengo puesto el like//

componentDidMount(){
    if(this.props.postData.data.likes.includes(auth.currentUser.email)){
        this.setState({
            propioLike: true, 
        })
}

}

like(){
//Si la collection es la tablita que tiene todos los usuarios
//Los documentos "doc" hacen referencia a cada uno de esos "usuarios"

db.collection("Posts").doc(this.props.postData.id).update({
    likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email)
})
.then(()=>this.setState({
    cantidadDeLikes: this.state.cantidadDeLikes +1,
    propioLike: true
})

)
.catch(e =>console.log(e))

}

dislike(){
    //Si la collection es la tablita que tiene todos los usuarios
    //Los documentos "doc" hacen referencia a cada uno de esos "usuarios"
    
    db.collection("Posts").doc(this.props.postData.id).update({
        likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email)
    }).then(()=>this.setState({
        cantidadDeLikes: this.state.cantidadDeLikes -1,
        propioLike: false
    })
    ).catch(e =>console.log(e))
}

//Preguntarle si hacemos funcion de redireccionamiento al perfil//






borrarPosteo(){
    confirm("Estas seguro de que queres borrar el posteo?") ?
    db.collection("Posts").doc(this.props.postData.id).delete()
    .catch(e=>console.log(e))
    :
    console.log("NO se borro")
}




render() {
    return(

        <View>

            { this.props.postData.data.email === auth.currentUser.email ?
                <Text onPress={()=>this.borrarPosteo()}></Text>
            :
            <Text>No puedes realizar esta acción.</Text>
        
            }


<       View>
 

<Image style={styles.imagen} source={{ uri: this.props.postData.data.imageurl }} resizeMode='cover' />
<Text style> {this.props.posteoData.data.description} </Text>

{this.state.propioLike ? 

<TouchableOpacity onPress={() => this.dislike()}></TouchableOpacity>
:
<TouchableOpacity onPress={() => this.like()}></TouchableOpacity>

}
<Text>Cantidad de likes:{this.state.cantidadDeLikes}</Text>

</View>

<View>

<TouchableOpacity onPress={() => this.props.navigation.navigate("Comments" , {id: this.props.posteoData.id})}></TouchableOpacity>
<Text>Comentarios: {this.state.comentarios.length}</Text>

</View>
<FlatList
          data={this.state.comentarios.slice(0, 3)}
          keyExtractor={(oneComent) => oneComent.id.toString()}
          renderItem={({ item }) => <Text> {item.userName} : <Text> {item.comentario}  </Text>  </Text>/>}
        />
        </View>


    )
}  
}

