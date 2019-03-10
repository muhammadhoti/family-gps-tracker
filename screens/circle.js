import React from 'react';
import {
        View,
        Text,
        TouchableOpacity
        } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
        Appbar,
        Card,
        Avatar,
        Button,
        Headline,
        } from 'react-native-paper';
import firebase from '../config/firebase'
import _ from 'lodash';

export default class Circle extends React.Component {
  constructor(props){
    super(props)
    this.state={
    }
  }

  static navigationOptions = {
    drawerLabel: 'My Circles',
    drawerIcon: () => (
      <MaterialCommunityIcons name="google-circles" size={20} color="blue" />
    ),
  };

  componentDidMount(){
    //Getting data From Props
    const uid = this.props.navigation.state.params.uid
    circle = this.props.navigation.state.params.circle
    this.setState({
      circle : circle,
      uid : this.props.navigation.state.params.uid,
    })
    //fetching users
    {
      const database = firebase.database();
      const userRef = database.ref('userInfo');
      let arr = []
      userRef
      .on('value', (snap)=>{
        userInfo =[];
        data = snap.val()
        arr = [];
        for(let i in data){
          data[i].key = i;
          arr.push(data[i])
          if(uid === data[i].uid){
            this.setState({currentUser:data[i]})
          }
        }
        const admin = _.find(arr, {
          uid: circle.owner
        });
        this.setState({
          userInfo : arr,
          admin : admin
        }) 
      })
    }    
  }

  deleteCircle(value){
    const {uid} = this.state
    const database = firebase.database();
    database.ref(`circles/${value.key}`).set({})
    .then(
      ()=>{
        this.props.navigation.navigate("Home",uid)
      }
    )
  }

  leaveCircle(value){
    const {uid,currentUser} = this.state
    const database = firebase.database();
    const index=value.members.indexOf(uid)
    const updatedArray = value.members.splice(index,1);
    const index2=value.tokens.indexOf(currentUser.token)
    const updatedArray2 = value.tokens.splice(index2,1);
    database.ref(`circles/${value.key}`).update({ members: value.members, tokens : value.tokens })
    .then(
      ()=>{
        this.props.navigation.navigate("Home",uid)
      }
    )
  }

  removeMember(value,renderingUser){
    const uid = renderingUser.uid
    const database = firebase.database();
    const index=value.members.indexOf(uid)
    const updatedArray = value.members.splice(index,1);
    const index2=value.tokens.indexOf(renderingUser.token)
    const updatedArray2 = value.tokens.splice(index2,1);
    database.ref(`circles/${value.key}`).update({ members: value.members, tokens : value.tokens })
    .then(
      ()=>{
        this.props.navigation.navigate("Home",uid)
      }
    )
  }

  render() {
    const { userInfo,circle,admin,uid } = this.state
    return (
      <View style={{flex: 1}}>
        {
          circle && admin &&
          <Appbar.Header>
            <Appbar.Content
              title={circle.name}
              subtitle={`${admin.displayName} is admin`}
            />
          </Appbar.Header>
        }
        {
          circle && circle.members.map((value,index)=>{
            const renderingUser = _.find(userInfo, {
              uid: value
            });
            return(
              <View>
                {renderingUser && circle.isOwner && renderingUser.uid !== uid &&
                  <View>
                    <Card.Title
                      title={renderingUser.displayName}
                      left={(props) => <Avatar.Icon {...props} icon="face" />}
                      right={(props) => <TouchableOpacity onPress={() => this.removeMember(circle,renderingUser)}><Avatar.Icon {...props} icon="delete" /></TouchableOpacity>}
                    />
                  </View>
                }
                <TouchableOpacity>
                  {renderingUser && !circle.isOwner &&
                    <Card.Title
                      title={renderingUser.displayName}
                      left={(props) => <Avatar.Icon {...props} icon="face" />}
                    />
                  }
                  {renderingUser && circle.isOwner && renderingUser.uid === uid &&
                    <Card.Title
                    title={renderingUser.displayName}
                    left={(props) => <Avatar.Icon {...props} icon="face" />}
                    />
                  }
                </TouchableOpacity>
              </View>
            )
          })
        }
        {circle && circle.isOwner &&
          <View style={{flex:1,alignItems:"center"}}>
            <Text>Joining Key :</Text>
            <Headline>{circle.code}</Headline>
            <Button color='red' mode="contained" onPress={() => this.deleteCircle(circle)}>
              Delete Circle 
            </Button>
          </View>
        }
        {circle && !circle.isOwner &&
          <View style={{flex:1,alignItems:"center"}}>
            <Button color='red' mode="contained" onPress={() => this.leaveCircle(circle)}>
              Leave Circle 
            </Button>
          </View>
        }
      </View>
    );
  }
}