import React from 'react';
import firebase from '../config/firebase'
import { Entypo } from '@expo/vector-icons';
import {
        View
        } from 'react-native';
import {
        Appbar,
        Headline,
        TextInput,
        Button
        } from 'react-native-paper';

export default class createCircle extends React.Component {
  constructor(props){
    super(props)
    this.state={
        text: '',
    }
  }

  static navigationOptions = {
    drawerLabel: 'Create Circle',
    drawerIcon: () => (
      <Entypo name="circle" size={20} color="blue" />
    ),
  };

  componentDidMount(){
    //Getting Uid From Props
    this.setState({
      uid : this.props.navigation.state.params.uid,
      })
    //Getting Current User 
    {
      const uid = this.props.navigation.state.params.uid;
      const database = firebase.database();
      const userRef = database.ref('userInfo');
      userRef
      .on('value', (snap)=>{
        data = snap.val()
        for(let i in data){
          if(uid === data[i].uid){
            this.setState({currentUser:data[i]})
          }
        }
      })
    }      
  }

  createCircle(){
    const {text,uid,currentUser} = this.state;
    const database = firebase.database();
    const circleRef = database.ref(`circles`).push();
    const joiningCode = Math.round(100000 + Math.random() * 900000);
    circleRef.set({
      name : text,
      code : joiningCode,
      members : [uid],
      owner : uid,
      tokens : [currentUser.token],
    }
    )
    .then(
      ()=>{
        this.props.navigation.navigate("Home",uid)
      }
      )
    }
  
render(){
  return (
    <View style={{flex: 1}}>
      <Appbar.Header>
        <Appbar.Content
        title="Create A Circle"
        subtitle="For Your Friends Family Co-Wokers e.t.c"
        />
      </Appbar.Header>
      <Headline>Enter Your Circle Name</Headline>
      <TextInput
        label='Circle Name'
        value={this.state.text}
        onChangeText={text => this.setState({ text })}
        />
      <Button mode="contained" onPress={() => this.createCircle()}>
        Create Circle
      </Button>
    </View>
  );
  }
}
