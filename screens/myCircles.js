import React from 'react';
import {
        StyleSheet,
        View,
        Text,
        TouchableOpacity
        } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
        Appbar,
        Card,
        Avatar,
        Button
        } from 'react-native-paper';
import firebase from '../config/firebase'
import { dbRef,fbAppId,uid } from '../constants/constants'
    

export default class MyCircle extends React.Component {
  constructor(props){
    super(props)
    this.state={

    }
  }

  static navigationOptions = {
    drawerLabel: 'My Circles',
    drawerIcon: (props) => (
      <MaterialCommunityIcons name="google-circles" size={20} color="blue" />
    ),
  };

  componentDidMount(){
    //Getting Uid From Props
    this.setState({
    uid : this.props.navigation.state.params.uid
    })
    //fetching circles
    {        
        fetch(`${dbRef}/circles.json`)
        .then(data => {
            return data.json();
        })
        .then(data2 => {
            const {uid} = this.state
            const arr = [];
            for(let i in data2){
                data2[i].key=i;
                if(data2[i].members.includes(uid)){
                    arr.push(data2[i])
                }
                if(data2[i].owner === uid){
                    data2[i].isOwner = true
                }
            }
            this.setState({
                currentUserCircles : arr,
            }) 
        })
    }    
}

viewCircle(value){
    const {uid} = this.state
    this.props.navigation.navigate("Circle",{uid:uid,circle:value})
}

render() {
    const { currentUserCircles } = this.state
    return (
        <View style={{flex: 1}}>
            <Appbar.Header>
                <Appbar.Content
                title="My Circles"
                />
            </Appbar.Header>
            {
            currentUserCircles && currentUserCircles.map((value,index)=>{
                return(
                    <TouchableOpacity onPress={()=>{this.viewCircle(value)}}>
                        <Card.Title
                            title={value.name}
                            subtitle = {value.isOwner && 'You Are Owner'}
                            left={(props) => <Avatar.Icon {...props} icon="group" />}
                        />
                    </TouchableOpacity>
                )
            })
            }
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
