import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import firebase from '../config/firebase';
import {AsyncStorage} from 'react-native';
import { dbRef,fbAppId,uid } from '../constants/constants'

export default class Login extends React.Component {
  constructor(props){
    super(props)
    this.state={
        
    }
  }
  
    componentDidMount(){
    const database = firebase.database();
          const userRef = database.ref('usersList');
          let arr = [];
          userRef
          .on('value', (snap)=>{
            data = snap.val()
            for(let i in data){
              arr.push(data[i].uid);
            }
            this.setState({usersList:arr})
          })
    }
  
    async login() {
      const appId = fbAppId;
      const permissions = ['public_profile', 'email'];  // Permissions required, consult Facebook docs
      const {usersList} = this.state;
      const database = firebase.database();
      const newUserRef = database.ref(`userInfo`).push();
      const userListRef = database.ref(`usersList`).push();
      const {
        type,
        token,
      } = await Expo.Facebook.logInWithReadPermissionsAsync(
        appId,
        {permissions}
      );
    
      switch (type) {
        case 'success': {
          await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);  // Set persistent auth state
          const credential = firebase.auth.FacebookAuthProvider.credential(token);
          const facebookProfileData = await firebase.auth().signInAndRetrieveDataWithCredential(credential);  // Sign in with Facebook credential
          const userData = await facebookProfileData.user.providerData[0];
          await AsyncStorage.setItem('uid', userData.uid);
          const uid = await userData.uid
          if(usersList){
          const userCheck = await usersList.includes(uid)
          await userCheck ? this.props.navigation.navigate("Home",{uid})
           :
            newUserRef.set({
                displayName : userData.displayName,
                email : userData.email,
                displayPicture : userData.photoURL,
                uid : userData.uid
            })
            .then(()=>{
                userListRef.set({uid})
            })
            .then(
                ()=>{this.props.navigation.navigate("Home",uid)}
            )
          return Promise.resolve({type: 'success'});
          }
          
        }
        case 'cancel': {
          alert("Login Failed Try Again")
          return Promise.reject({type: 'cancel'});
        }
      }
    }

  render() {
    return (
      <View style={styles.container}>
        <Button
        onPress={
          ()=>{
            this.login()
          }
        }
        title ="Login With Facebook"
      />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
});