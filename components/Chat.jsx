import React, { useEffect, useState } from 'react';
import {
  View, Text, Platform, KeyboardAvoidingView, SafeAreaView, LogBox, Image, Pressable,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import {
  GiftedChat, Day, SystemMessage, Bubble, InputToolbar, Send,
} from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import firebase from '../firebase';

import CustomActions from './CustomActions';

import styles from './styles';
import stylesChat from './stylesChat';

// Disable timer alert in console
LogBox.ignoreLogs(['Setting a timer', 'Animated: `useNativeDriver`', 'Animated.event']);

// Import Chat Bot avatar
const chatBot = require('../public/chat_bot.png');

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [imagePick, setImagePick] = useState('');
  const [locationPick, setLocationPick] = useState('');
  const [loading, setLoading] = useState(false);
  const [uid, setUid] = useState('');
  const [isOnline, setIsOnline] = useState('idle');
  const [isTyping, setIsTyping] = useState(false);
  const [showSend, setShowSend] = useState(false);

  const route = useRoute();
  const navigation = useNavigation();

  // Get name and colors from Start screen
  const {
    name, activeColor, bubbleColor, textColor,
  } = route.params;

  // Connect to Firebase
  const db = firebase.firestore();
  const chatMessageReference = db.collection('messages');
  const metadataReference = db.collection('metadata');

  // Make Unsubscription accessable outise useEffect
  let authUnsubscribe = () => { };
  let unsubscribeMessageReference = () => { };
  let unsubscribeMetadataReference = () => { };

  // Get network state
  const onNetworkChange = (state) => {
    if (!state.isConnected) {
      setIsOnline(false);
    } else if (state.isConnected) {
      setIsOnline(true);
    }
  };

  // Construct welcome message
  const initialMessages = [
    // Welcome message
    {
      _id: 1,
      text: `Hey ${name}`,
      createdAt: Date.parse(new Date()),
      user: {
        _id: 2,
        name: 'Chat Bot',
        avatar: chatBot,
      },
    },
    // Initital message
    {
      _id: 2,
      text: 'You entered the chat',
      createdAt: Date.parse(new Date()),
      system: true,
    },
  ];

  // Retrieve messages from local storage
  const getMessages = async () => {
    let storedMessages = '';
    try {
      storedMessages = await AsyncStorage.getItem('messages') || initialMessages;
      if (storedMessages === initialMessages) {
        setMessages(initialMessages);
      } else {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Store messages in local storage
  const saveMessages = async (elements) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(elements));
    } catch (error) {
      console.log(error.message);
    }
  };

  // Clear local storage
  const deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem('messages');
      setMessages(initialMessages);
    } catch (error) {
      console.log(error.message);
    }
  };

  // Retrieve UID from local storage
  const getUid = async () => {
    let uId = '';
    try {
      uId = await AsyncStorage.getItem('uid') || '';
      setUid(JSON.parse(uId));
    } catch (error) {
      console.log(error.message);
    }
  };

  // Store UID in local storage
  const saveUid = async (id) => {
    try {
      await AsyncStorage.setItem('uid', JSON.stringify(id));
    } catch (error) {
      console.log(error.message);
    }
  };

  // Get messages from Firebase
  const onCollectionUpdate = (querySnapshot) => {
    const fetchedMessages = querySnapshot.docs.map((element) => {
      const {
        _id, text, createdAt, user, image, location,
      } = element.data();
      return {
        _id,
        text,
        image,
        location,
        createdAt: Date.parse(createdAt.toDate()),
        user,
      };
    });
    initialMessages.forEach((element) => fetchedMessages.push(element));
    const newMessages = fetchedMessages.sort((a, b) => b.createdAt - a.createdAt);
    setMessages(newMessages);
    saveMessages(newMessages);
  };

  // Get metadata from Firebase
  const onMetadataUpdate = (querySnapshot) => {
    const metadata = querySnapshot.docs.map((element) => element.data());
    if (metadata[0].uid !== uid) {
      setIsTyping(metadata[0].isTyping);
    }
    setTimeout(() => metadataReference.doc('BS5BwiimxHiTJOfkVaeR').update({ isTyping: false }), 10000);
  };

  useEffect(() => {
    setLoading(true);
    const unsubscribeNetInfo = NetInfo.addEventListener(onNetworkChange);
    navigation.setOptions({ title: name });

    // Authentication
    const authentication = () => {
      authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
          firebase.auth().signInAnonymously();
        }
        setUid(user.uid);
        saveUid(user.uid);
      });
    };

    // Check if online
    // online
    if (isOnline && isOnline !== 'idle') {
      authentication();
      unsubscribeMessageReference = chatMessageReference.onSnapshot(onCollectionUpdate);
      unsubscribeMetadataReference = metadataReference.onSnapshot(onMetadataUpdate);
      setLoading(false);
    } else {
      // offline
      getUid();
      getMessages();
      setLoading(false);
    }

    return () => {
      authUnsubscribe();
      unsubscribeMessageReference();
      unsubscribeMetadataReference();
      unsubscribeNetInfo();
    };
  }, [isOnline, uid]);

  // Change color of Date
  /* eslint-disable-next-line */
  const renderDay = (props) => <Day {...props} textStyle={{ color: textColor }} />;

  // Change color of initial message
  /* eslint-disable-next-line */
  const renderSystemMessage = (props) => <SystemMessage {...props} textStyle={{ color: textColor }} />;

  // Change color of right chat bubble
  const renderBubble = (props) => (
    <Bubble
    /* eslint-disable-next-line */
    {...props}
      wrapperStyle={{
        right: {
          backgroundColor: bubbleColor, textColor,
        },
      }}
    />
  );

  // Hide Input when offline
  const renderInput = (props) => {
    if (isOnline) {
      return (
          /* eslint-disable-next-line  */
          <InputToolbar {...props} />
      );
    }
    return (
      <View style={stylesChat.offlineInputWrapper}>
        <Text style={stylesChat.offlineInput}>You are currently offline.</Text>
      </View>
    );
  };

  const customSendButton = (props) => {
    if (showSend) {
      return (
          // eslint-disable-next-line
          <Send {...props} textStyle={{ color: bubbleColor }} />
      );
    }
    return null;
  };

  // Show map preview in chat bubble
  const renderCustomView = (props) => {
    const { location } = props.currentMessage;
    if (location) {
      return (
        <View
          style={stylesChat.mapViewWrapper}
        >
          <MapView
            style={stylesChat.mapView}
            region={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
            />
          </MapView>
        </View>
      );
    }
    return null;
  };

  // Show attachement before sending
  const renderAttachement = () => {
    if (imagePick !== '') {
      return (
        <View style={stylesChat.imageWrapper}>
          <Pressable
            style={[stylesChat.closeButtonWrapper, { backgroundColor: activeColor }]}
            onPress={() => { setImagePick(''); setLocationPick(''); setShowSend(false); }}
          >
            <Text style={[stylesChat.closeButton, { color: textColor }]}>
              &#10005;
            </Text>
          </Pressable>
          <Image
            style={stylesChat.image}
            source={{ uri: imagePick.uri }}
          />
        </View>
      );
    }
    return null;
  };

  // Tell server user is Typing
  const startTyping = () => metadataReference.doc('BS5BwiimxHiTJOfkVaeR').update({ isTyping: true, uid });

  // Tell server user stopped typing
  const stopTyping = () => metadataReference.doc('BS5BwiimxHiTJOfkVaeR').update({ isTyping: false });

  // Store selected data on Firebase
  const uploadImageFetch = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        resolve(xhr.response);
      };
      xhr.onerror = (e) => {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    const imageNameBefore = uri.split('/');
    const imageName = imageNameBefore[imageNameBefore.length - 1];

    const ref = firebase.storage().ref().child(`images/${imageName}`);

    const snapshot = await ref.put(blob);

    blob.close();

    const downloadUrl = await snapshot.ref.getDownloadURL();
    return downloadUrl;
  };

  // Send message
  const onSend = async (message) => {
    console.log('Im here');
    if (message[0].text === 'DELETE_STORAGE') {
      deleteMessages();
      setTimeout(() => stopTyping, 4000);
    }
    let composedMessage = null;
    if (imagePick !== '') {
      const imageUrl = await uploadImageFetch(imagePick.uri);
      const {
        _id, createdAt, text, user,
      } = message[0];
      composedMessage = {
        _id,
        createdAt,
        text,
        image: imageUrl,
        user,
      };
    }
    await chatMessageReference.add(composedMessage || message[0]);
    setImagePick('');
    setLocationPick('');
    setShowSend(false);
    stopTyping();
  };

  // Send location
  const sendLocation = (location) => {
    const guid = () => {
      const s4 = () => Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
      // return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
      return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
    };
    const message = [{
      _id: guid(),
      createdAt: new Date(),
      text: '',
      location,
      user: {
        _id: uid,
        name,
      },
    }];
    onSend(message);
  };

  // On isTyping
  const onTyping = (value) => {
    if (value === '') {
      setShowSend(false);
      stopTyping();
    } else {
      setShowSend(true);
      startTyping();
    }
  };

  // Render a button to access sending images, audio and location.
  const renderCustomActions = () => (
    /* eslint-disable-next-line */
    <CustomActions
      setLocationPick={setLocationPick}
      setImagePick={setImagePick}
      customColor={bubbleColor}
      onTyping={onTyping}
      sendLocation={sendLocation}
    />
  );

  // Render component

  if (loading) {
    // Loading Screen
    return (
      <SafeAreaView style={[styles.containerCenter, { backgroundColor: activeColor }]}>
        <Text style={{ color: textColor }}>loading...</Text>
      </SafeAreaView>
    );
  }

  // Chat Screen
  return (
    <SafeAreaView style={[styles.justFlex, { backgroundColor: activeColor }]}>
      <GiftedChat
        messages={messages}
        onSend={(message) => onSend(message)}
        user={{
          _id: uid,
          name,
        }}
        alignTop={false}
        scrollToBottom
        onInputTextChanged={onTyping}
        isTyping={isTyping}
        renderCustomView={renderCustomView}
        alwaysShowSend
        renderSend={customSendButton}
        renderChatFooter={renderAttachement}
        renderActions={renderCustomActions}
        renderInputToolbar={renderInput}
        renderUsernameOnMessage
        renderDay={renderDay}
        renderSystemMessage={renderSystemMessage}
        renderBubble={renderBubble}
      />
      { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
    </SafeAreaView>
  );
};

export default Chat;
