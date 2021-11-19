import React from 'react';
import {
  Text, View, Pressable, Image,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import {
  Bubble, InputToolbar, Send, Day, SystemMessage,
} from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';

import stylesChat from '../components/stylesChat';

import CustomActions from '../components/CustomActions';
import { chatMessageReference, firebaseStorage, isTypingDoc } from '../firebase';

const giftedChatServices = (giftedChatServicesProps) => {
  const {
    setMessages, imagePick, setLoading, initialMessages, setImagePick, setShowSend,
    bubbleColor, uid, name, textColor, activeColor, isOnline, ONLINE, showSend,
  } = giftedChatServicesProps;

  const services = {
    // Change color of Date
    renderDay: (props) => <Day {...props} textStyle={{ color: textColor }} />,

    // Change color of initial message
    renderSystemMessage: (props) => <SystemMessage {...props} textStyle={{ color: textColor }} />,

    // Change color of right chat bubble
    renderBubble: (props) => (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: bubbleColor, textColor,
          },
        }}
      />
    ),

    // Hide Input when offline
    renderInput: (props) => {
      if (isOnline === ONLINE) {
        return (
          <InputToolbar {...props} />
        );
      }
      return (
        <View style={stylesChat.offlineInputWrapper}>
          <Text style={stylesChat.offlineInput}>You are currently offline.</Text>
        </View>
      );
    },

    customSendButton: (props) => {
      if (showSend) {
        return (
          <Send {...props} textStyle={{ color: bubbleColor }} text={props.text || ' '} />
        );
      }
      return null;
    },

    // Show map preview in chat bubble
    renderCustomView: (props) => {
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
    },

    // Show attachement before sending
    renderAttachement: () => {
      if (imagePick !== '') {
        return (
          <View style={stylesChat.imageWrapper}>
            <Pressable
              style={[stylesChat.closeButtonWrapper, { backgroundColor: activeColor }]}
              onPress={() => { setImagePick(''); setShowSend(false); }}
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
    },

    // Tell server user is Typing
    startTyping: () => isTypingDoc.update({ isTyping: true, uid }),

    // Tell server user stopped typing
    stopTyping: () => isTypingDoc.update({ isTyping: false }),

    // Store selected data on Firebase
    uploadImageFetch: async (uri) => {
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

      const ref = firebaseStorage.child(`images/${imageName}`);

      const snapshot = await ref.put(blob);

      blob.close();

      const downloadUrl = await snapshot.ref.getDownloadURL();
      return downloadUrl;
    },

    // Send location
    sendLocation: (location) => {
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
      services.onSend(message);
    },

    // On isTyping
    onTyping: (value) => {
      if (value === '' && !imagePick) {
        setShowSend(false);
        services.stopTyping();
      } else {
        setShowSend(true);
        services.startTyping();
      }
    },

    // Render a button to access sending images, audio and location.
    renderCustomActions: () => (
      <CustomActions
        setImagePick={setImagePick}
        customColor={bubbleColor}
        onTyping={services.onTyping}
        sendLocation={services.sendLocation}
      />
    ),

    // Clear local storage
    deleteMessages: async () => {
      try {
        await AsyncStorage.removeItem('messages');
        setMessages(initialMessages);
      } catch (error) {
        console.log(error.message);
      }
    },

    // Send message
    onSend: async (message) => {
      if (message[0].text === 'DELETE_STORAGE') {
        services.deleteMessages();
        setTimeout(() => services.stopTyping, 4000);
      }
      let composedMessage = null;
      if (imagePick !== '') {
        setLoading(true);
        const imageUrl = await services.uploadImageFetch(imagePick.uri);
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
      setShowSend(false);
      services.stopTyping();
    },
  };

  return services;
};

export default giftedChatServices;
