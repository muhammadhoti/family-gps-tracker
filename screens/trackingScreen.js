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
import { dbRef,googleAPI,uid } from '../constants/constants'
import MapView from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import firebase from '../config/firebase'
import {
  Appbar,
  Headline,
  TextInput,
  Button
  } from 'react-native-paper';
import _ from 'lodash';
import MapViewDirections from 'react-native-maps-directions';
var KEY;
const GEOLOCATION_OPTIONS = { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 };

export default class TrackingScreen extends React.Component {
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
    const name = this.props.navigation.state.params.circle.name
    const members = this.props.navigation.state.params.circle.members
    const tokens = this.props.navigation.state.params.circle.tokens
    const owner = this.props.navigation.state.params.circle.owner
        this.setState({
          uid : uid,
          name :name,
          members :members,
          owner : owner,
          tokens : tokens
        })
        
        {
          const database = firebase.database();
          const userRef = database.ref('userInfo');
          let arr = []
          userRef
          .on('value', (snap)=>{
            userInfo =[];
            data = snap.val()
            arr = null;
            arr = [];
            for(let i in data){
              if(uid === data[i].uid){
                KEY = i;
                this.setState({currentUser:data[i]})
                if(data[i].uid === owner){
                    this.setState({admin:data[i]})
                }
              }
              if(uid !== data[i].uid && members.includes(data[i].uid)){
                  arr.push(data[i])
                  if(data[i].uid === owner){
                    this.setState({admin:data[i]})
                }
              }
            }
            this.setState({selectedMembers:arr})
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
  let date = Date();
      date = date.split("G",1)
    let coordinates = {
      longitude : location.coords.longitude,
      latitude : location.coords.latitude
    }
  await KEY && database.ref(`userInfo/${KEY}`).update({coordinates:coordinates})
  await KEY && database.ref(`userInfo/${KEY}`).update({lastSeen:date[0]})
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

emergencyAlert(){
  fetch('https://exp.host/--/api/v2/push/send', {
	mode: 'no-cors',
    method: 'POST',
    headers: {
    	"Accept":'application/json',
		"Content-Type": 'application/json'
        },
	body: JSON.stringify({
    to: "ExponentPushToken[a3Nvx_GY6sc0IZhzK6Fqup]", body: "Emergency ALert",title:`${this.state.name}`
  })
});
fetch('https://exp.host/--/api/v2/push/send', {
	mode: 'no-cors',
    method: 'POST',
    headers: {
    	"Accept":'application/json',
		"Content-Type": 'application/json'
        },
	body: JSON.stringify({
    to: "ExponentPushToken[xIPN9PLs7wIry5VenF1imZ]", body: "Emergency ALert",title:`${this.state.name}`
  })
});
}

render() {
  const {currentUser,selectedMembers,location,region,admin,name} = this.state;
  console.log("Tracking Screen Se Render Chala",this.state)
  return (
        <View style={{
            flex: 1
            }}>
            {admin && name &&
            <Appbar.Header>
                <Appbar.Content
                title={name}
                subtitle={`${admin.displayName} is Owner`}
                />
            </Appbar.Header>
            }
            {
            location && region && currentUser &&
            <View style={{
              flex: 1
              }}>
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
                >
                  <MapView.Callout>
                    <View style={{alignItems: 'center',justifyContent: 'center'}}>
                        <Text style={{fontWeight: 'bold'}}>{currentUser.displayName}</Text>
                        <Text>{`Last Seen : ${currentUser.lastSeen}`}</Text>
                    </View>
                  </MapView.Callout>
                </MapView.Marker>
                {selectedMembers && selectedMembers.map(
                    (value,index)=>{
                      console.log("value *******",value)
                        return(
                            <MapView.Marker
                            coordinate={{
                            latitude: value.coordinates.latitude,
                            longitude: value.coordinates.longitude,
                            }}
                            image={value.displayPicture}
                            description={value.displayName}
                            >
                              <MapView.Callout>
                                <View style={{alignItems: 'center',justifyContent: 'center'}}>
                                    <Text style={{fontWeight: 'bold'}}>{value.displayName}</Text>
                                    <Text>{`Last Seen : ${value.lastSeen}`}</Text>
                                </View>
                              </MapView.Callout>  
                            </MapView.Marker>
                        )
                    }
                )
                }
                {selectedMembers && selectedMembers.map(
                    (value,index)=>{
                        return(
                            <MapViewDirections
                            origin={{
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude,
                                }}
                            destination={value.coordinates}
                            apikey={googleAPI}
                            strokeWidth={3}
                            strokeColor="red"
                            />
                        )
                    }
                )
                }
                </MapView>
              </View>
            }
            {!location && !region &&
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              <Headline>Turn On Your Location Services On High Accuracy And If It Is Already On GO Back And Try Tracking Circle</Headline>
            </View>
            }
            <View >
                  <Button color='red' mode="contained" onPress={() => this.emergencyAlert() }>
                    Emergency ALert !
                  </Button>
            </View>
          </View>
    );
  }
}