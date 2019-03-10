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
let DEVICE_TOKEN;

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
      uid : this.props.navigation.state.params.uid,
      })
    }

    // async deviceToken(){
    //   const { status: existingStatus } = await Permissions.getAsync(
    //     Permissions.NOTIFICATIONS
    //   );
    //   let finalStatus = existingStatus;
    //   if (existingStatus !== 'granted') {
    //     const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    //     finalStatus = status;
    //   }
    //   if (finalStatus !== 'granted') {
    //     return;
    //   }
    //   let token = await Notifications.getExpoPushTokenAsync();
    //   this.setState({token: token})
    //   DEVICE_TOKEN = token
    //   return 
    // }

    createCircle(){
        const {text,uid,token} = this.state;
        const database = firebase.database();
        const circleRef = database.ref(`circles`).push();
        const joiningCode = Math.round(100000 + Math.random() * 900000);
        circleRef.set({
            name : text,
            code : joiningCode,
            members : [uid],
            owner : uid,
        }
        )
        .then(
            ()=>{
                this.props.navigation.navigate("Home",uid)
            }
        )

    }

render() {
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
