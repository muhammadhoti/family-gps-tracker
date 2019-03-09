import React from 'react';
import {
        StyleSheet,
        View,
        Text,
        } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
        Appbar,
        Headline,
        TextInput,
        Button
        } from 'react-native-paper';
import firebase from '../config/firebase'
import { dbRef,fbAppId,uid } from '../constants/constants'    

export default class JoinCircle extends React.Component {
  constructor(props){
    super(props)
    this.state={
        code : '',
    }
  }

  static navigationOptions = {
    drawerLabel: 'Join Circle',
    drawerIcon: (props) => (
      <Ionicons name="md-add-circle" size={20} color="blue" />
    ),
  };

  componentDidMount(){
    //Getting Uid From Props
    this.setState({
    uid : this.props.navigation.state.params.uid
    })
    //fetching circles
    {        
        const database = firebase.database();
        const circleRef = database.ref('circles');
        let arr = []
        circleRef
        .on('value', (snap)=>{
          const {uid} = this.state
          let { circles } = this.state
          data = snap.val()
          arr = [];
          for(let i in data){
            data[i].key=i;
            if(!data[i].members.includes(uid)){
                arr.push(data[i])
            }
          }
          this.setState({
            circles : arr,
        }) 
        })
    }    
}

    joinCircle(){
        const {code,circles,uid} = this.state;
        let WrongCode = true;
        circles.map((value,index)=>{
            if(value.code == code){
                circle = value
                WrongCode = false;   
                const database = firebase.database();
                circle.members.push(uid)
                database.ref(`circles/${circle.key}`).update({ members: circle.members })
                .then(
                    ()=>{
                      this.setState({code:""})
                        this.props.navigation.navigate("Home",uid)
                    }
                )             
            }
        })
        if(WrongCode){
          alert("Wrong Code !")
        }
    }

render() {
    return (
        <View style={{flex: 1}}>
            <Appbar.Header>
                <Appbar.Content
                title="Join A Circle"
                subtitle="With Your Friends Family Co-Wokers e.t.c"
                />
            </Appbar.Header>
            <Headline>Enter Circle Invitation Code</Headline>
            <TextInput
                label='Circle Code'
                value={this.state.code}
                onChangeText={code => this.setState({ code })}
            />
            <Button mode="contained" onPress={() => this.joinCircle()}>
                Join Circle
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
