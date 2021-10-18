import React, { useEffect, useState } from 'react';
import {
  Platform, KeyboardAvoidingView, SafeAreaView, LogBox,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { GiftedChat } from 'react-native-gifted-chat';
import NetInfo from '@react-native-community/netinfo';
import { chatMessageReference, metadataReference, firebaseAuth } from '../firebase';

import Loader from './Loader';

import styles from './styles';
import giftedChatServices from '../services/giftedChatServices';
import dbServices from '../services/dbServices';

// Disable timer alert in Expo console
LogBox.ignoreLogs(['Setting a timer', 'Animated: `useNativeDriver`', 'Animated.event']);

// Import Chat Bot avatar
const chatBot = require('../public/chat_bot.png');

const Chat = () => {
  // SET STATE
  const [messages, setMessages] = useState([]);
  const [imagePick, setImagePick] = useState('');
  const [loading, setLoading] = useState(false);
  const [uid, setUid] = useState('');
  const [isOnline, setIsOnline] = useState('idle');
  const [isTyping, setIsTyping] = useState(false);
  const [showSend, setShowSend] = useState(false);

  // Initiate navigation features
  const navigation = useNavigation();

  // Get name and colors from Start screen
  const route = useRoute();
  const {
    name, activeColor, bubbleColor, textColor,
  } = route.params;

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

  // Get all data related services
  const dbServicesProps = {
    setMessages, setUid, setLoading, setIsTyping, uid, initialMessages,
  };
  const {
    saveUid, getUid, onCollectionUpdate, onMetadataUpdate, getMessages,
  } = dbServices(dbServicesProps);

  // Get Gifted Chat services
  const giftedChatServicesProps = {
    setMessages,
    setLoading,
    setImagePick,
    setShowSend,
    initialMessages,
    imagePick,
    bubbleColor,
    uid,
    name,
    textColor,
    activeColor,
    isOnline,
    showSend,
  };
  const {
    onSend, onTyping, renderCustomView, customSendButton, renderAttachement,
    renderCustomActions, renderInput, renderDay, renderSystemMessage, renderBubble,
  } = giftedChatServices(giftedChatServicesProps);

  // Get network state
  const onNetworkChange = (state) => {
    if (!state.isConnected) {
      setIsOnline(false);
    } else if (state.isConnected) {
      setIsOnline(true);
    }
  };

  // Initiate unsubscribe to prevent sync errors in useEffect
  let authUnsubscribe = () => { };
  let unsubscribeMessageReference = () => { };
  let unsubscribeMetadataReference = () => { };

  // USE EFFECT
  useEffect(() => {
    setLoading(true);
    const unsubscribeNetInfo = NetInfo.addEventListener(onNetworkChange);
    navigation.setOptions({ title: name });

    // Authentication
    const authentication = () => {
      authUnsubscribe = firebaseAuth.onAuthStateChanged((user) => {
        if (!user) {
          firebaseAuth.signInAnonymously();
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

  // RENDER COMPONENT
  return (
    <SafeAreaView style={[styles.justFlex, { backgroundColor: activeColor }]}>
      <GiftedChat
        messages={messages}
        user={{
          _id: uid,
          name,
        }}
        alignTop={false}
        scrollToBottom
        isTyping={isTyping}
        alwaysShowSend
        onSend={(message) => onSend(message)}
        onInputTextChanged={onTyping}
        renderCustomView={renderCustomView}
        renderSend={customSendButton}
        renderChatFooter={renderAttachement}
        renderActions={renderCustomActions}
        renderInputToolbar={renderInput}
        renderUsernameOnMessage
        renderDay={renderDay}
        renderSystemMessage={renderSystemMessage}
        renderBubble={renderBubble}
      />
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      {loading ? <Loader /> : null}
    </SafeAreaView>
  );
};

export default Chat;
