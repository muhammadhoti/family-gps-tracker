import React from 'react';
import {  View } from 'react-native';
import {  createStackNavigator, createAppContainer, createDrawerNavigator } from "react-navigation";
import { IconButton } from 'react-native-paper'
import Login from '../screens/login'
import Home from '../screens/home'
import CreateCircle from '../screens/createCircle'
import MyCircles from '../screens/myCircles'
import Circle from '../screens/circle'
import JoinCircle from '../screens/joinCircle'
import TrackCircle from '../screens/trackCircles'
import TrackingScreen from '../screens/trackingScreen'

class Navigator extends React.Component {




  render() {
    return (
        <View style={{flex: 1,backgroundColor:'blue'}}>
          <Navigation />
        </View>
    );
  }
}

const MyDrawerNavigator = createDrawerNavigator(
    {
      Home: {
        screen: Home,
      },
      My_Circles : {
          screen : MyCircles
      },
      Track_Circles : {
        screen : TrackCircle
      },
      Create_Circle : {
        screen : CreateCircle
      },
      Join_Circle : {
        screen : JoinCircle
      },
    });
    

const AppNavigator = createStackNavigator({
  Login: {
    screen: Login
  },
  Home:{
    screen : MyDrawerNavigator,
    navigationOptions: ({ navigation }) => ({
        headerStyle: {
          backgroundColor: '#505050',
        },
        headerLeft: (
          <IconButton
            icon='menu'
            color='white'
            size={25}
            onPress={() => navigation.toggleDrawer()}
          />
        ),
        headerRight: (
          <IconButton
            icon="exit-to-app"
            color='#e833e5'
            size={25}
            onPress={() => navigation.navigate('Login')}
          />
        )
      }),
  },
  Circle : {
      screen : Circle
  },
  Tracking_Screen : {
    screen : TrackingScreen
  }
});

const Navigation =  createAppContainer(AppNavigator);

export default Navigator;