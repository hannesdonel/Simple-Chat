import React, { useEffect, useState } from 'react';
import {
  View, Text, Platform, KeyboardAvoidingView, SafeAreaView, LogBox,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
  GiftedChat, Day, SystemMessage, Bubble, InputToolbar,
} from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import firebase from '../firebase';

import styles from './styles';
import stylesChat from './stylesChat';

// Disable timer alert in console
LogBox.ignoreLogs(['Setting a timer']);

// Import Chat Bot avatar
const chatBot = require('../public/chat_bot.png');

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uid, setUid] = useState('');
  const { ONLINE, OFFLINE, IDLE } = {
    ONLINE: 'ONLINE',
    OFFLINE: 'OFFLINE',
    IDLE: 'IDLE',
  };
  const [isOnline, setIsOnline] = useState(IDLE);
  const [isTyping, setIsTyping] = useState(false);

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
      setIsOnline(OFFLINE);
    } else if (state.isConnected) {
      setIsOnline(ONLINE);
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
        _id, text, createdAt, user,
      } = element.data();
      return {
        _id,
        text,
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
    if (isOnline === ONLINE && isOnline !== IDLE) {
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
    if (isOnline === ONLINE) {
      return (
      /* eslint-disable-next-line */
          <InputToolbar {...props} />
      );
    }
    return (
      <View style={stylesChat.offlineInputWrapper}>
        <Text style={stylesChat.offlineInput}>You are currently offline.</Text>
      </View>
    );
  };

  // Send message
  const onSend = (message) => {
    if (message[0].text === 'DELETE_STORAGE') {
      deleteMessages();
      setTimeout(() => metadataReference.doc('BS5BwiimxHiTJOfkVaeR').update({ isTyping: false }), 4000);
    } else {
      chatMessageReference.add(message[0]);
      setTimeout(() => metadataReference.doc('BS5BwiimxHiTJOfkVaeR').update({ isTyping: false }), 4000);
    }
  };

  // On isTyping
  const onTyping = (value) => {
    if (value === '') {
      metadataReference.doc('BS5BwiimxHiTJOfkVaeR').update({ isTyping: false });
    } else {
      metadataReference.doc('BS5BwiimxHiTJOfkVaeR').update({ isTyping: true, uid });
    }
  };

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
