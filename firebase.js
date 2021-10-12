import firebase from 'firebase';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCka8344XwnWu78isUsXT-gI_RHcDsI2-0',
  authDomain: 'simple-chat-2021.firebaseapp.com',
  projectId: 'simple-chat-2021',
  storageBucket: 'simple-chat-2021.appspot.com',
  messagingSenderId: '585465124585',
  appId: '1:585465124585:web:cd59aa5c653cecec780278',
};

firebase.initializeApp(firebaseConfig);

export default firebase;
