import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, SafeAreaView, ImageBackground, FlatList, Platform, StatusBar, ScrollView, ToastAndroid, Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import firebase from 'firebase';
import db from '../config'
import 'firebase/firestore';

export default class CartScreen extends Component{
  constructor(){
    super();
    this.state = {
      allItems: [],
      mode: []
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

  retrieveItems = async() => {
    try{
      var allItems = [];
      var items = await db.collection('Cart')
      .get().then((querySnapShot) => {
        querySnapShot.forEach((doc) => {
          allItems.push(doc.data())
        })
        this.setState({allItems})
      })
    }
    catch(error){
      Alert.alert(error); 
    }
  }

  componentDidMount(){
    this.retrieveItems();
    this.getThemeMode();
  }

  render(){
    if(this.state.allItems.length === 0){
      return(
        <View style = {[styles.container, {justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}]}>
          <Ionicons name = 'chatbox-outline' color = {this.state.mode.iconColor} size = {30}/>
          <Text style = {[styles.displayText, {color: this.state.displayTextColor}]}>Your cart is empty</Text>
        </View>
      )
    }
    else{
      return(
        <View style = {[styles.container, {backgroundColor: this.state.mode.backgroundColor}]}>
          <SafeAreaView style = {styles.droidSafeArea}/>
          <ScrollView>
            <View style = {[styles.header, {backgroundColor: this.state.mode.headerColor}]}>
              <Text style = {[styles.headingText, {color: this.state.mode.titleTextColor}]}>Your Cart</Text>
            </View>
           
            <FlatList
            refreshing = {true}
            data = {this.state.allItems}
            extraData = {this.state.mode}
            keyExtractor = {(item: object, index: number) => toString()}
            renderItem = {({item}) => (
                <View style = {[styles.itemContainer, {backgroundColor: this.state.mode.itemContainerColor}]}>
                  <Image source = {{uri: item.uri}} style = {styles.itemImage}/>
                  
                  <Text style = {[styles.displayText, {color: this.state.mode.displayTextColor, fontWeight: 'bold'}]}> {item.name}</Text>
                    <Text style = {[styles.displayText, {color: this.state.mode.displayTextColor}]}>{item.processor}</Text>

                    <Text style = {[styles.displayText, {color: this.state.mode.displayTextColor}]}>{item.ram}</Text>

                    <Text style = {[styles.displayText, {color: this.state.mode.displayTextColor}]}>{item.storage}</Text>

                    <Text style = {[styles.displayText, {color: this.state.mode.displayTextColor}]}>₹{item.price}</Text>

                  <View style = {styles.buttonContainer}>
                    <TouchableOpacity
                    style = {[styles.buyButton, {backgroundColor: this.state.mode.buyButtonColor}]}>
                      <Text>Buy</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}/>
          </ScrollView>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
 container: {
    flex: 1,
  },

  droidSafeArea: {
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },

  itemContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
    width: '90%',
    borderRadius: 10,
    padding: 20,
    backgroundColor: 'rgb(236, 236, 236)',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 8
  },

  buyButton: {
    margin: 10,
    padding: 15,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(170, 250, 50, 0.4)',
    flexDirection: 'row',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 5
  },

  header: {
    justifyContent: 'flex-start',
    backgroundColor: 'rgb(247, 210, 62)',
    padding: 8,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: 'black',
    shadowOffset: {width: 4, height: 2},
    shadowRadius: 11
  },

  buttonContainer: {
    flexDirection: 'row'
  },

  displayText: {
    color: 'rgb(57, 55, 53)',
    fontSize: 20,
    fontFamily: 'Nunito'
  },

  headingText: {
    fontSize: 25,
    color: '#000',
    fontFamily: 'Nunito',
    fontWeight: 'bold'
  },

  itemImage: {
    alignSelf: 'center',
    width: 250,
    height: 200,
    borderRadius: 10,
    borderWidth: 1
  }
})
