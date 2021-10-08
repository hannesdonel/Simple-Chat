import React, { useEffect, useState } from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
  GiftedChat, Day, SystemMessage, Bubble,
} from 'react-native-gifted-chat';

import styles from './styles';

// Import Chat Bot avatar
const chatBot = require('../public/chat_bot.png');

const Chat = () => {
  const [messages, setMessages] = useState([]);

  const route = useRoute();
  const navigation = useNavigation();

  // Get name and colors from Start screen
  const {
    name, activeColor, bubbleColor, textColor,
  } = route.params;

  useEffect(() => {
    navigation.setOptions({ title: name });
    setMessages([
      // Welcome message
      {
        _id: 1,
        text: `Hey ${name}`,
        createdAt: new Date(),
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
        createdAt: new Date(),
        system: true,
      },
    ]);
  }, [name]);

  const onSend = (newMessage = []) => {
    setMessages(GiftedChat.append(messages, newMessage));
  };

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

  return (
    <View style={[styles.justFlex, { backgroundColor: activeColor }]}>
      <GiftedChat
        messages={messages}
        onSend={(message) => onSend(message)}
        user={{
          _id: 1,
          name,
        }}
        renderUsernameOnMessage
        renderDay={renderDay}
        renderSystemMessage={renderSystemMessage}
        renderBubble={renderBubble}
      />
      { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
    </View>
  );
};

export default Chat;
