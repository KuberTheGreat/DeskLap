import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, SafeAreaView, Platform, StatusBar, Image, ImageBackground, ToastAndroid, Pressable} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

import firebase from 'firebase';
import db from '../config'
import '@firebase/firestore';
import '@firebase/auth'

export default class LogScreen extends Component{
  constructor(){
    super();
    this.state = {
      email: '',
      password: '',
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

  login = async(email, password) => {
    if(email && password){
      try{
        const response = await firebase.auth().signInWithEmailAndPassword(email, password);
        if(response){
          ToastAndroid.show('Logged in', ToastAndroid.SHORT)
          console.log(this.state.email);
          this.setState({
            email: email,
            password: password
          })
        }
      }
      catch(error){
        switch(error.code){
          case 'auth/user-not-found':
            Alert.alert('User does not exist');
            break;
          case 'auth/invalid-email':
            Alert.alert('Incorrect Email and Password');
            break;
        }
      }
    }
    else{
      Alert.alert('Enter email and password');
    }
  }

  signup = async(email, password) => {
    if(email && password){
      try{
        const response = await firebase.auth().createUserWithEmailAndPassword(email, password)
        if(response){
          this.props.navigation.navigate('Feed')
        }
      }
      catch(error){
        switch(error.code){
          case 'auth/user-not-found':
            Alert.alert('User does not exisit');
            break;
          case 'auth/invalid-email':
            Alert.alert('Incorrect Email and Password');
            break;
        }
      }
    }
    else{
      Alert.alert('Enter email and password');
    }
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

          <Text style = {[styles.titleText, {color: this.state.mode.titleTextColor}]}>Sign In</Text>
        </View>
        
        <TextInput
        style = {[styles.inputBox, {color: this.state.mode.displayTextColor}]}
        onChangeText = {text => {this.setState({email: text})}}
        placeholder = 'Enter email address'
        placeholderTextColor = {this.state.mode.titleTextColor}
        value = {this.state.email}/>

        <TextInput
        style = {[styles.inputBox, {color: this.state.mode.displayTextColor}]}
        onChangeText = {text => {this.setState({password: text})}}
        placeholder = 'Enter password'
        placeholderTextColor = {this.state.mode.titleTextColor}
        value = {this.state.password}
        secureTextEntry = {true}/>

        <View style = {styles.buttonContainer}>
          <TouchableOpacity
          style = {[styles.routeButton, {backgroundColor: this.state.mode.buyButtonColor}]}
          onPress = {() => {
            this.login(this.state.email, this.state.password)
            this.setState({
              email: '',
              password: ''
            })}}>
            <Text>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
          style = {[styles.routeButton, {backgroundColor: this.state.mode.cartButtonColor}]}
          onPress = {() => {
            this.signup(this.state.email, this.state.password)
            this.setState({
              email: '',
              password: ''
            })}}>
            <Text>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  inputBox: {
    margin: 20,
    padding: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    width: 230,
    shadowOffset: {width: 0, height: 0},
    shadowColor: 'black',
    shadowRadius: 3
  },

  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  routeButton: {
    margin: 15,
    padding: 10,
    flex: 1,
    borderRadius: 7,
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowOffset: {width: 0, height: 0},
    shadowColor: 'black',
    shadowRadius: 5
  },

  droidSafeArea: {
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },

  header: {
    flexDirection: 'row',
    padding: 8,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'flex-start',
    shadowColor: 'black',
    shadowOffset: {width: 4, height: 2},
    shadowRadius: 11
  },

  backText: {
    fontSize: 20,
    color: '#007AFF',
  },

  backContainer: {
    flex: 0.4,
    flexDirection: 'row',
    alignItems: 'center',
  },

  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'Nunito'
  },
})