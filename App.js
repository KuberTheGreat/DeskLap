import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import BottomTabNavigator from "./navigation/TabNavigator";
import DrawerNaivgator from './navigation/DrawerNavigator';
import StackNavigator from './navigation/StackNavigator';

export default function App(){
  return (
    <NavigationContainer>
      <DrawerNaivgator/>
    </NavigationContainer>
  );
}
