import React, {Component} from 'react';
import {Text, View, StyleSheet, TextInput, ImageBackground, Alert, Platform, StatusBar, ToastAndroid, SafeAreaView, TouchableOpacity, Pressable, Image, FlatList, ScrollView} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import firebase from 'firebase';
import db from '../config';
import 'firebase/firestore';

export default class SellerScreen extends Component{
  constructor(props){
    super(props);
    this.state = {
      name: '',
      processor: '',
      ram: '',
      storage: '',
      seller: '',
      price: '',
      id: 0,
      mode: [],
      uri: ''
    }
  }

  getThemeMode = async() => {
    try{
      var mode
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

  getTodaysDate = async() => {
    var today = await new Date();
    var day = today.getDate();
    var month = today.getMonth() + 1;

    var year = today.getFullYear()
    if(day < 10){
      day = '0' + day;
    }
    if(month < 10){
      month = '0' + month;
    }

    today = year + month + day;

    this.setState({
      id: today
    })
    
    return today
  }

  submitComputerInfo = async() => {
    await db.collection('Computers').add({
      name: this.state.name,
      processor: this.state.processor,
      ram: this.state.ram,
      storage: this.state.storage,
      seller: this.state.seller,
      price: this.state.price,
      id: this.state.id,
      uri: this.state.uri
    })

    this.setState({
      name: '',
      processor: '',
      ram: '',
      storage: '',
      seller: '',
      price: '',
      id: '',
      uri: ''
    })

    ToastAndroid.show('Specifications Submitted', ToastAndroid.SHORT);
  }

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
    });

    this.setState({uri: result.uri})
  };

  componentDidMount(){
    this.getThemeMode();
    this.getTodaysDate();
  }

  render(){
    return (
      <View style = {[styles.container, {backgroundColor: this.state.mode.backgroundColor}]}>
        <SafeAreaView style = {styles.droidSafeArea}/>
        <ScrollView>
          <View style = {[styles.header, {backgroundColor: this.state.mode.headerColor}]}>
            <Pressable
            style = {styles.backContainer}
            onPress = {() => this.props.navigation.navigate('Feed')}>
              <Ionicons name = 'chevron-back' color = '#007AFF' size = {25}/>
              <Text style = {styles.backText}>Back</Text>
            </Pressable>

            <Text style = {[styles.titleText, {color: this.state.mode.titleTextColor}]}>Sell</Text>
          </View>

          <TextInput
          style = {[styles.inputBox, {color: this.state.mode.displayTextColor}]}
          onChangeText = {text => this.setState({name: text})}
          placeholder = 'Enter computer model name'
          placeholderTextColor = {this.state.mode.titleTextColor}
          value = {this.state.name}/>

          <TextInput
          style = {[styles.inputBox, {color: this.state.mode.displayTextColor}]}
          onChangeText = {text => this.setState({processor: text})}
          placeholder = 'Enter processor'
          placeholderTextColor = {this.state.mode.titleTextColor}
          value = {this.state.processor}/>

          <TextInput
          style = {[styles.inputBox, {color: this.state.mode.displayTextColor}]}
          onChangeText = {text => this.setState({ram: text})}
          placeholder = 'Enter RAM (size)'
          placeholderTextColor = {this.state.mode.titleTextColor}
          value = {this.state.ram}/>

          <TextInput
          style = {[styles.inputBox, {color: this.state.mode.displayTextColor}]}
          onChangeText = {text => this.setState({storage: text})}
          placeholder = 'Enter storage (size)'
          placeholderTextColor = {this.state.mode.titleTextColor}
          value = {this.state.storage}/>

          <TextInput
          style = {[styles.inputBox, {color: this.state.mode.displayTextColor}]}
          onChangeText = {text => this.setState({seller: text})}
          placeholder = 'Enter seller name'
          placeholderTextColor = {this.state.mode.titleTextColor}
          value = {this.state.seller}/>

          <TextInput
          style = {[styles.inputBox, {color: this.state.mode.displayTextColor}]}
          onChangeText = {text => this.setState({price: text})}
          placeholder = 'Enter product price'
          placeholderTextColor = {this.state.mode.titleTextColor}
          value = {this.state.price}
          maxLength = {10}
          keyboardType = 'numeric'/>

          <TouchableOpacity
          style = {styles.uploadImageButton}
          onPress = {this.pickImage}>
            <Text style = {{color: 'white'}}>Upload an Image</Text>
          </TouchableOpacity>
          {this.state.uri && <Image source = {{uri: this.state.uri}} style = {styles.uploadImage}/>}

          <TouchableOpacity
          style = {[styles.submitButton, {backgroundColor: this.state.mode.buyButtonColor}]}
          onPress = {() => {
            this.state.name === ''
            ? Alert.alert('No text Entered')
            : this.submitComputerInfo()
          }}>
            <Text>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
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
    fontFamily: 'Nunito'
  },

  inputBox: {
    margin: 10,
    padding: 10,
    justifyContent: 'center',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 3
  },

  submitButton: {
    margin: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 15,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 5,
  },

  backText: {
    fontSize: 20,
    color: '#007AFF'
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

  backContainer: {
    flex: 0.4,
    flexDirection: 'row',
    alignItems: 'center',
  },

  uploadImage: {
    alignSelf: 'center',
    width: 250,
    height: 200,
    borderRadius: 10,
    borderWidth: 1
  },

  uploadImageButton: {
    alignSelf: 'center',
    padding: 13,
    borderRadius: 15,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 5,
    backgroundColor: '#C0345C'
  }
})