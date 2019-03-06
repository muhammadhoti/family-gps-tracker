import React from 'react';
import {StyleSheet,
        View,
        Text,
        Platform } from 'react-native';
import {ImagePicker,  
        Permissions,
        Constants,
        Location 
       } from 'expo';
import { dbRef,fbAppId,uid } from '../constants/constants'
import MapView from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import firebase from '../config/firebase'
var KEY;
const GEOLOCATION_OPTIONS = { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 };

export default class Maps extends React.Component {
  constructor(props){
    super(props)
    this.state={
      
    }
    this._getLocationAsync = this._getLocationAsync.bind(this)
    // this.locationChanged = this.locationChanged.bind(this)
  }  

  static navigationOptions = {
    drawerLabel: 'Home',
    drawerIcon: (props) => (
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
            userInfo =[];
            data = snap.val()
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
        await Location.watchPositionAsync(GEOLOCATION_OPTIONS, this.locationChanged);
               
        
}

locationChanged = async (location) => {
  region = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.1,
    longitudeDelta: 0.05,
  }
  this.setState({location, region})
  const database = firebase.database();
    let coordinates = {
      longitude : location.coords.longitude,
      latitude : location.coords.latitude
    }
  await KEY && database.ref(`userInfo/${KEY}`).update({coordinates:coordinates})
}


_getLocationAsync = async () => {
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
    }
  };

render() {
  const {currentUser,selectedMembers,location,region} = this.state;
  console.log(this.state)
  return (
        <View style={{
            flex: 1
            }}>
            {
            location && region && currentUser &&
            <MapView 
              style={{
              flex: 1
              }}
              initialRegion={region}>
              <MapView.Marker
                coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                }}
                image={currentUser.displayPicture}
                description={currentUser.displayName}
              />
              </MapView>
            }
            {!location && !region &&
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              <Text>Turn On Your Location Services On High AccuracyAnd If It Is Already On Try Reloading App</Text>
            </View>
            }
          </View>
    );
  }
}