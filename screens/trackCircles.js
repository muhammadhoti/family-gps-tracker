import React from 'react';
import {
        StyleSheet,
        View,
        Text,
        TouchableOpacity
        } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import {
        Appbar,
        Card,
        Avatar,
        Button
        } from 'react-native-paper';
import firebase from '../config/firebase'
import { dbRef } from '../constants/constants'
    

export default class TrackCircle extends React.Component {
  constructor(props){
    super(props)
    this.state={

    }
  }

  static navigationOptions = {
    drawerLabel: 'Track Circle',
    drawerIcon: (props) => (
      <MaterialIcons name="location-searching" size={20} color="blue" />
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
          let {currentUserCircles} = this.state
          currentUserCircles =[];
          data = snap.val()
          arr = [];
          for(let i in data){
            data[i].key=i;
            if(data[i].members.includes(uid)){
                arr.push(data[i])
            }if(data[i].owner === uid){
                data[i].isOwner = true
            }
          }
          this.setState({
            currentUserCircles : arr,
        }) 
        })
    }    
}

trackCircle(value){
    const {uid} = this.state
    this.props.navigation.navigate("Home",{uid:uid,members:value.members})
}

render() {
    const { currentUserCircles } = this.state
    return (
        <View style={{flex: 1}}>
            <Appbar.Header>
                <Appbar.Content
                title="Select Circle To View On Map"
                />
            </Appbar.Header>
            {
            currentUserCircles && currentUserCircles.map((value,index)=>{
                return(
                    <TouchableOpacity onPress={()=>{this.trackCircle(value)}}>
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
