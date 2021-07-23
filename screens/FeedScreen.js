import React, {Component} from 'react';
import {Text, View, StyleSheet, FlatList, TouchableOpacity, ImageBackground, SafeAreaView, Platform, StatusBar, Image, ScrollView, Alert, ToastAndroid, ActivityIndicator} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import * as Font from 'expo-font'
import {Searchbar} from 'react-native-paper'
import {LinearGradient} from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

import CustomSidebarMenu from './CustomSidebarMenu';

import firebase from 'firebase';
import 'firebase/firestore';
import db from '../config';

let customFont = {'Nunito': require('../fonts/Nunito/Nunito-Light.ttf')}

export default class FeedScreen extends Component{
  constructor(props){ 
    super(props);
    this.state = {
      allComputers: [],
      fontsLoaded: false,
      mode: [],
      image: null
    }
  }

  async _loadFontsAsync(){
    await Font.loadAsync(customFont)
    this.setState({fontsLoaded: true})
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

  getComputerInfo = async() => {
    try{
      var allComputers = [];
      var computers = await db.collection('Computers')
      .get().then((querySnapShot) => {
        querySnapShot.forEach((doc) => {
          allComputers.push(doc.data());
        })
        this.setState({allComputers})
      })
    }
    catch(error){
      Alert.alert(error)
    }
  }

  addItemToCart = async(id, seller, name, processor, ram, storage, price, uri) => {
    try{
      await db.collection('Cart').add({
        id: id,
        seller: seller,
        name: name,
        processor: processor,
        ram: ram,
        storage: storage,
        price: price,
        uri: uri
      })
    }
    catch(err){
      Alert.alert(err)
    }

    ToastAndroid.show('Item added to Cart', ToastAndroid.SHORT);
  }
  
  componentDidMount(){
    this.getComputerInfo();
    this._loadFontsAsync();
    this.getThemeMode();
  }

  render(){
    if(this.state.allComputers.length === 0){
      return(
        <View style = {[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
          <Text style = {{fontSize: 20, color: 'black'}}>Loading...</Text>
          <ActivityIndicator size = {20}/>
        </View>
      )
    }
    else{
      return (
        <View style = {[styles.container, {backgroundColor: this.state.mode.backgroundColor}]}>
            <SafeAreaView style = {styles.droidSafeArea}/>
            <ScrollView>
              <View style = {[styles.header, {backgroundColor: this.state.mode.headerColor}]}>
                <TouchableOpacity 
                onPress = {() => this.props.navigation.openDrawer()}>
                  <Ionicons name = 'menu' color = {this.state.mode.iconColor} size = {30}/>
                </TouchableOpacity>

                <Text style = {[styles.titleText, {color: this.state.mode.titleTextColor}]}>Home</Text>
              </View>
              
              <FlatList
              refreshing = {true}
              data = {this.state.allComputers}
              extraData = {this.state.mode}
              keyExtractor = {(item: object, index: number) => toString()}
              renderItem = {({item}) => (
                  <View style = {[styles.itemContainer, {backgroundColor: this.state.mode.itemContainerColor, borderColor: this.state.mode.borderColor}]}>

                    <Image source = {{uri: item.uri}} style = {styles.itemImage}></Image>
                    
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

                      <TouchableOpacity
                      style = {[styles.buyButton, {backgroundColor: this.state.mode.cartButtonColor}]}
                      onPress = {() => this.addItemToCart(item.id, item.seller, item.name, item.processor, item.ram, item.storage, item.price, item.uri)}>
                        <Text>Add to Cart</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}/>
            </ScrollView>
        </View>
      ); 
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
    flexDirection: 'row',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 5
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 8,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: 'black',
    shadowOffset: {width: 4, height: 2},
    shadowRadius: 11
  },

  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'Nunito',
  },

  buttonContainer: {
    flexDirection: 'row'
  },

  displayText: {
    fontSize: 20,
    fontFamily: 'Nunito',
  },

  itemImage: {
    alignSelf: 'center',
    width: 250,
    height: 200,
    borderRadius: 10,
    borderWidth: 1
  }
})