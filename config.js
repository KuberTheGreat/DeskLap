import * as firebase from 'firebase';

require('@firebase/firestore')

const firebaseConfig = {
  apiKey: "AIzaSyBJBE5s7XZIU7Fa_VxCjTJGvWj0t80dwVA",
  authDomain: "desklap.firebaseapp.com",
  projectId: "desklap",
  storageBucket: "desklap.appspot.com",
  messagingSenderId: "871032913699",
  appId: "1:871032913699:web:b08bd7aed0e5f9770d9696"
};

firebase.initializeApp(firebaseConfig)

export default firebase.firestore();