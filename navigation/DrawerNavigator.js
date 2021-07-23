import React, {Component} from 'react';
import {createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem, Alert} from '@react-navigation/drawer';

import SellerScreen from '../screens/SellerScreen';
import SettingScreen from '../screens/SettingScreen';
import LogoutScreen from '../screens/LogoutScreen';
import LogScreen from '../screens/LogScreen';

import BottomTabNavigator from './TabNavigator';
import CustomSidebarMenu from '../screens/CustomSidebarMenu';
import StackNavigator from './StackNavigator';

import firebase from 'firebase';
import db from '../config';

const Drawer = createDrawerNavigator();

export default class DrawerNavigator extends Component{
  constructor(props){
    super(props);
    this.state = {
      mode: []
    }
  }

  getThemeMode = async() => {
    try{
      var mode = []
      var response = await db.collection('Theme')
      .get().then((querySnapShot) => {
        querySnapShot.forEach((doc) => {
          mode = doc.data()
        })
        this.setState({mode: mode})
      })
    }
    catch(error){
      Alert.alert(error)
    }
  }

  componentDidMount(){
    this.getThemeMode();
  }

  render(){
    return(
      <Drawer.Navigator 
      initialRouteName = 'Feed' 
      drawerType = 'back'
      drawerContentOptions={{
        activeTintColor: this.state.mode.titleTextColor,
        inactiveTintColor: this.state.mode.titleTextColor,
        itemStyle: { marginVertical: 5 },
      }}
      drawerContent = {props => <CustomSidebarMenu {...props}/>}>
        <Drawer.Screen name = 'Feed' component = {StackNavigator}/>
        <Drawer.Screen name = 'Sell' component = {SellerScreen}/>
        <Drawer.Screen name = 'Settings' component = {SettingScreen}/>
        <Drawer.Screen name = 'Logout' component = {LogoutScreen}/>
      </Drawer.Navigator>
    )
  }
}
