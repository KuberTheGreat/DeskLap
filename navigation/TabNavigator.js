import React from "react";
import { StyleSheet } from "react-native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { RFValue } from "react-native-responsive-fontsize";

import CartScreen from "../screens/CartScreen";
import FeedScreen from "../screens/FeedScreen";

import StackNavigator from './StackNavigator';

const Tab = createMaterialBottomTabNavigator();

const BottomTabNavigator = () => {
  return(
    <Tab.Navigator
      shifting = {true}
      barStyle = {styles.bottomTab}
      screenOptions = {({route}) => ({
      tabBarIcon: ({focused, color, size}) => {
        let iconName;
        if(route.name === 'Feed'){
          iconName = focused ? 'library' : 'library-outline';
        }
        else if(route.name === 'Cart'){
          iconName = focused ? 'cart' : 'cart-outline';
        }
        return (<Ionicons name = {iconName} color = {color} size = {RFValue(25)}/>)
      }})}
      tabBarOptions = {{
        activeTintColor: 'purple',
        inactiveTintColor: 'white'
      }}>
        <Tab.Screen name = 'Feed' component = {FeedScreen}/>
        <Tab.Screen name = 'Cart' component = {CartScreen}/>
    </Tab.Navigator>
  )
}


const styles = StyleSheet.create({
  bottomTab: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'center',
    height: '10%',
    overflow: 'hidden',
    position: 'absolute',
    shadowOffset: {width: 0, height: -7},
    shadowRadius: 11,
    shadowColor: 'black'
  }
})

export default BottomTabNavigator