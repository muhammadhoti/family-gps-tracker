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
const KEY = "-L_-FgYcYrWeqoE6dtO8"
const GEOLOCATION_OPTIONS = { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 };

export default class Maps extends React.Component {
  constructor(props){
    super(props)
    this.state={
      location: { coords: {latitude: 0, longitude: 0}},
    }
    this._getLocationAsync = this._getLocationAsync.bind(this)
  }

  static navigationOptions = {
    drawerLabel: 'Home',
    drawerIcon: (props) => (
      <MaterialCommunityIcons name="home" size={20} color="blue" />
    ),
  };

  componentWillMount() {
    Location.watchPositionAsync(GEOLOCATION_OPTIONS, this.locationChanged);
  }

  locationChanged = (location) => {
    region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.1,
      longitudeDelta: 0.05,
    },
    this.setState({location, region})
  }

  componentDidMount(){
    
    //Getting Uid From Props
    const uid = this.props.navigation.state.params.uid
        this.setState({
          uid : uid
        })
        
        {
          const database = firebase.database();
          const userRef = database.ref('userInfo');
          let arr = []
          let brr = []
          userRef
          .on('child_added', function (data) {
            arr.push(data.val())
          })
          this.setState({userInfo:arr})
            if (Platform.OS === 'android' && !Constants.isDevice) {
              this.setState({
              errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
              });
            }else {
              this._getLocationAsync();
          }
        }
               
        
}

static getDerivedStateFromProps(props, state){
  const members = props.navigation.state.params.members
  const userInfo = state.userInfo;
  const selectedMembers = [];
  userInfo && members && userInfo.map(
    (value,index)=>{
      if(members.includes((value.uid))){
        selectedMembers.push(value)
      }
    }
  )
  return ({selectedMumbers :selectedMembers})
}

_getLocationAsync = async () => {
    
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    const locationSerivceCheck = await Location.hasServicesEnabledAsync();
    if (status !== 'granted') {
      return  'Permission to access location was denied'
    }else if(locationSerivceCheck){
        let location = await Location.getCurrentPositionAsync();
      let coordinates = {
        latitude : location.coords.longitude,
        longitude : location.coords.latitude
      };
      const database = firebase.database();
       return database.ref(`userInfo/${KEY}`).update({coordinates:coordinates})
    }
  };

render() {
  console.log(region)
  const {region,selectedMumbers} =this.state
  console.log("render Chala",this.state)
    return (
        <View style={{
            flex: 1
            }}>
            <MapView 
              style={{
              flex: 1
              }}
              initialRegion={{
                latitude: 24.8838,
                longitude: 67.0654,
                latitudeDelta: 0.0072,
                longitudeDelta: 0.0051
              }}>
              <MapView.Marker
                  coordinate={{
                  latitude: 24.8838,
                  longitude: 67.0654,
                  }}
                  />
              {selectedMumbers && selectedMumbers.map((value,index)=>{
                console.log('chheck *****',value.coordinates.latitude)
                const latitude = +value.coordinates.latitude
                const longitude = +value.coordinates.longitude
                return(
                <MapView.Marker
                coordinate={{
                  latitude: latitude,
                  longitude: longitude,
                  }}
                  />)
              })
              }
            </MapView>
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
