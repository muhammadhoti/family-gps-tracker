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
        Button,
        Headline,
        } from 'react-native-paper';
import firebase from '../config/firebase'
import { dbRef } from '../constants/constants'
import _ from 'lodash';

export default class Circle extends React.Component {
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
    //Getting data From Props
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

// getDerivedStateFromProps(props,state){
// 	return {circle : props.navigation.state.params.circle}
// }

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
    const {uid} = this.state
    const database = firebase.database();
    const index=value.members.indexOf(uid)
    const updatedArray = value.members.splice(index,1);
    database.ref(`circles/${value.key}`).update({ members: value.members })
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
  database.ref(`circles/${value.key}`).update({ members: value.members })
  .then(
    ()=>{
      this.props.navigation.navigate("Home",uid)
    }
  )
}

render() {
    const { userInfo,circle,admin,uid} = this.state
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
