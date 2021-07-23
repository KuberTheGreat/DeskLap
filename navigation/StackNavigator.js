import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import BottomTabNavigator from './TabNavigator';
import LogScreen from '../screens/LogScreen';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return(
    <Stack.Navigator
    initialRouteName = 'Feed'
    screenOptions = {{headerShown: false}}>
      <Stack.Screen name = 'Feed' component = {BottomTabNavigator}/>
      <Stack.Screen name = 'Log' component = {LogScreen}/>
    </Stack.Navigator>
  )
}

export default StackNavigator;
