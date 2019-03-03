import React from 'react';
import {
        StyleSheet,
        View,
        Text,
        } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import {
        Appbar,
        Headline,
        TextInput,
        Button
        } from 'react-native-paper';
import firebase from '../config/firebase'
    

export default class createCircle extends React.Component {
  constructor(props){
    super(props)
    this.state={
        text: '',
    }
  }

  static navigationOptions = {
    drawerLabel: 'Create Circle',
    drawerIcon: (props) => (
      <Entypo name="circle" size={20} color="blue" />
    ),
  };

  componentDidMount(){
    //Getting Uid From Props
    this.setState({
    uid : this.props.navigation.state.params.uid
    })
}

    createCircle(){
        const {text,uid} = this.state;
        const database = firebase.database();
        const circleRef = database.ref(`circles`).push();
        const joiningCode = Math.round(100000 + Math.random() * 900000);
        circleRef.set({
            name : text,
            code : joiningCode,
            members : [uid],
            owner : uid
        }
        )
        .then(
            ()=>{
                this.props.navigation.navigate("Home",uid)
            }
        )

    }

render() {
    console.log(this.state)
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
