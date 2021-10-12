import React, { useEffect, useState } from 'react';
import {
  Text, Platform, KeyboardAvoidingView, SafeAreaView, LogBox,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
  GiftedChat, Day, SystemMessage, Bubble,
} from 'react-native-gifted-chat';
import firebase from '../firebase';

import styles from './styles';

// Disable timer alert in console
LogBox.ignoreLogs(['Setting a timer']);

// Import Chat Bot avatar
const chatBot = require('../public/chat_bot.png');

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uid, setUid] = useState('');

  const route = useRoute();
  const navigation = useNavigation();

  // Get name and colors from Start screen
  const {
    name, activeColor, bubbleColor, textColor,
  } = route.params;

  // Connect to Firebase
  const db = firebase.firestore();
  const chatMessageReference = db.collection('messages');

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

  // Get data from Firebase
  const onCollectionUpdate = (querySnapshot) => {
    setLoading(true);
    const fetchedMessages = querySnapshot.docs.map((element) => {
      const {
        _id, text, createdAt, user, dbUid,
      } = element.data();
      return {
        _id,
        text,
        createdAt: Date.parse(createdAt.toDate()),
        user,
        dbUid,
      };
    });
    initialMessages.forEach((element) => fetchedMessages.push(element));
    const newMessages = fetchedMessages.sort((a, b) => b.createdAt - a.createdAt);
    setMessages(newMessages);
    setLoading(false);
  };

  // Send message
  const onSend = (message) => chatMessageReference.add(message[0]);

  useEffect(() => {
    navigation.setOptions({ title: name });
    const authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        setLoading(true);
        firebase.auth().signInAnonymously();
        setLoading(false);
      }
      setUid(user.uid);
      setMessages([]);
    });
    const unsubscribe = chatMessageReference.onSnapshot(onCollectionUpdate);
    return () => {
      authUnsubscribe();
      unsubscribe();
    };
  }, []);

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
