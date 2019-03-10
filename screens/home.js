import React from 'react';
import {
        View,
        Text,
        Platform } from 'react-native';
import {  
        Permissions,
        Constants,
        Location 
       } from 'expo';
import MapView from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import firebase from '../config/firebase'
import {
  Appbar,
  } from 'react-native-paper';
import { Notifications } from 'expo'
var KEY;

export default class Maps extends React.Component {
  constructor(props){
    super(props)
    this.state={
      
    }
    this._getLocationAsync = this._getLocationAsync.bind(this)
    this.deviceToken = this.deviceToken.bind(this)
  }  

  static navigationOptions = {
    drawerLabel: 'Home',
    drawerIcon: () => (
      <MaterialCommunityIcons name="home" size={20} color="blue" />
    ),
  };

  async componentDidMount(){
    //Getting Uid From Props
    const uid = this.props.navigation.state.params.uid
      this.setState({
        uid : uid
      })
    {
      const database = firebase.database();
      const userRef = database.ref('userInfo');
      let arr = []
      userRef
      .on('value', (snap)=>{
        data = snap.val()
        arr = null;
        arr = [];
        for(let i in data){
          if(uid === data[i].uid){
            KEY = i;
            this.setState({currentUser:data[i]})
          }
          arr.push(data[i])
        }
        this.setState({userInfo:arr})
      })
      if (Platform.OS === 'android' && !Constants.isDevice) {
        this.setState({
          errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
        });
        }else {
          this._getLocationAsync();
        }
      }
    this.deviceToken();
  }

async deviceToken(){
  const database = firebase.database()
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    return;
  }
  let token = await Notifications.getExpoPushTokenAsync();
  this.setState({token: token})
  KEY && token && database.ref(`userInfo/${KEY}`).update({token:token})
  return 
}

_getLocationAsync = async () => {
  let date = Date();
  date = date.split("G",1)
  const database = firebase.database();
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  const locationSerivceCheck = await Location.hasServicesEnabledAsync();
  if (status !== 'granted') {
    return  'Permission to access location was denied'
  }else if(locationSerivceCheck){
    let location = await Location.getCurrentPositionAsync();
    let coordinates = {
      longitude : location.coords.longitude,
      latitude : location.coords.latitude
    }
    await KEY && database.ref(`userInfo/${KEY}`).update({coordinates:coordinates})
    await KEY && database.ref(`userInfo/${KEY}`).update({lastSeen:date[0]})
  }
  };

render() {
  const {currentUser} = this.state;
  return (
    <View style={{
      flex: 1
    }}>
      <Appbar.Header>
        <Appbar.Content
        title="Welcome To Family GPS Tracker"
        />
      </Appbar.Header>
      {
        currentUser &&
          <MapView 
            style={{
              flex: 1
            }}
            initialRegion={{
              latitude: currentUser.coordinates.latitude,
              longitude: currentUser.coordinates.longitude,
              latitudeDelta: 0.0072,
              longitudeDelta: 0.0051
            }}>
            <MapView.Marker
              coordinate={{
                latitude: currentUser.coordinates.latitude,
                longitude: currentUser.coordinates.longitude,
              }}
              image={currentUser.displayPicture}
              description={currentUser.displayName}
            >
              <MapView.Callout>
                <View style={{alignItems: 'center',justifyContent: 'center'}}>
                  <Text style={{fontWeight: 'bold'}}>{currentUser.displayName}</Text>
                  <Text>{`Last Seen : ${currentUser.lastSeen}`}</Text>
                </View>
              </MapView.Callout>  
            </MapView.Marker>
          </MapView>
      }
    </View>
  );
  }
}