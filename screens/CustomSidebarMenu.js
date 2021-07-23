import React, { Component } from "react";
import { SafeAreaView, View, StyleSheet, Image, Alert } from "react-native";

import {DrawerContentScrollView, DrawerItemList} from "@react-navigation/drawer";

import firebase from 'firebase';
import db from '../config';

export default class CustomSidebarMenu extends Component {
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
  
  render() {
    let props = this.props;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: this.state.mode.headerColor,
        }}>
        <DrawerContentScrollView {...props} style = {{borderRadius: 20}}>
          <DrawerItemList {...props}/>
        </DrawerContentScrollView>
      </View>
    );
  }
}
