import React, {Component} from 'react';
import {Text, View, StyleSheet, TextInput, ImageBackground, Alert, Platform, StatusBar, ToastAndroid, SafeAreaView, TouchableOpacity, Picker, Switch, Pressable} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

import StackNavigator from '../navigation/StackNavigator'

import firebase from 'firebase';
import db from '../config';
import 'firebase/firestore';
 
let selectedMode = ''

export default class SettingScreen extends Component{
  constructor(props){
    super(props);
    this.state = {
      mode: [],
      switched: false,
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

  changeThemeToLight = async() => {
    await db.collection('Theme').doc('colors').set({
      mode: 'light',
      backgroundColor: '#FAFBF7',
      itemContainerColor: '#FFF',
      buyButtonColor: '#08C6B6',
      cartButtonColor: '#8BD2A2',
      headerColor: '#FFF',
      titleTextColor: '#000',
      displayTextColor: '#1F1D22',
      iconColor: '#000',
      borderColor: '#000',
      switched: false
    })
  }

  changeThemeToDark = async() => {
    await db.collection('Theme').doc('colors').set({ 
      mode: 'dark',
      backgroundColor: '#212121',
      itemContainerColor: '#2F2F2F',
      buyButtonColor: '#08C6B6',
      cartButtonColor: '#8BD2A2',
      headerColor: '#1F1D22',
      titleTextColor: '#FFF',
      displayTextColor: '#FAF7F4',
      iconColor: '#FFF',
      borderColor: '#FFF',
      switched: true
    })
  }

  toggleSwitch(){
    if(this.state.switched === true){
      this.changeThemeToLight()
    }
    if(this.state.switched === false){
      this.changeThemeToDark()
    }
    this.setState({switched: !this.state.switched})
  }

  componentDidMount(){
    this.getThemeMode();
  }

  render(){ 
    return(
      <View style = {[styles.container, {backgroundColor: this.state.mode.backgroundColor}]}>
        <SafeAreaView style = {styles.droidSafeArea}/>
        <View style = {[styles.header, {backgroundColor: this.state.mode.headerColor}]}> 
          <Pressable
          style = {styles.backContainer}
          onPress = {() => this.props.navigation.navigate('Feed')}>
            <Ionicons name = 'chevron-back' color = '#007AFF' size = {25}/>
            <Text style = {styles.backText}>Back</Text>
          </Pressable>

          <Text style = {[styles.titleText, {color: this.state.mode.titleTextColor}]}>Settings</Text>
        </View>
        
        <View>
          <View style = {[styles.switchContainer, {borderColor: this.state.mode.borderColor}]}>
            <Text style = {[styles.displayText, {color: this.state.mode.displayTextColor}]}>Dark Theme</Text>
            
            <Switch
            trackColor = {{false: 'grey', true: 'cyan'}}
            thumbColor = {this.state.switched === 'true' ? 'red' : 'grey'} 
            onValueChange = {() => this.toggleSwitch()}
            value = {this.state.switched}/> 
          </View>

          <View style = {[styles.switchContainer, {borderColor: this.state.mode.borderColor}]}>
            <TouchableOpacity
            onPress = {() => this.props.navigation.navigate('Log')}>
              <Text style = {[styles.displayText, {color: this.state.mode.displayTextColor}]}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ) 
  }
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  droidSafeArea: {
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },

  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'Nunito',
  },

  backText: {
    fontSize: 20,
    color: '#007AFF'
  },

  header: {
    flexDirection: 'row',
    padding: 8,
    textAlign: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'flex-start',
    shadowColor: 'black',
    shadowOffset: {width: 4, height: 2},
    shadowRadius: 11
  },

  backContainer: {
    flex: 0.4,
    flexDirection: 'row',
    alignItems: 'center',
  },

  displayText: {
    fontSize: 20,
    fontFamily: 'Nunito',
  },

  switchContainer:{ 
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
    padding: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1
  },
})