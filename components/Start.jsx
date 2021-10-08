import React, { useState } from 'react';
import {
  View, Text, TextInput, ImageBackground, Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ColorPicker from './ColorPicker';

import styles from './styles';
import stylesStart from './stylesStart';
import colors from './colors';

// Background Image
const image = require('../public/Background_Image.png');

const Start = () => {
  const [name, setName] = useState('');
  const [activeColor, setActiveColor] = useState(null);
  const [validation, setValidation] = useState(true);
  const [buttonActive, setButtonActive] = useState(false);

  const navigation = useNavigation();

  const handleOnPress = (color) => {
    if (name !== '' && color !== null) {
      setButtonActive(true);
    }
    setActiveColor(color);
  };

  const validate = () => {
    if (name !== '' && activeColor !== null) {
      setValidation(true);
      navigation.navigate('Chat', { name, activeColor });
    }
    if (name === '') {
      setValidation(false);
      setButtonActive(false);
    }
    if (activeColor === null) {
      setActiveColor(false);
      setButtonActive(false);
    }
  };

  const onType = (value) => {
    setName(value);
    if (value !== '' && activeColor !== null) {
      setButtonActive(true);
    }
    if (value !== '') {
      setValidation(true);
    } else {
      setButtonActive(false);
      setValidation(false);
    }
  };

  return (
    <View style={styles.containerCenter}>
      <ImageBackground
        source={image}
        resizeMode="cover"
        style={stylesStart.backgroundImage}
      >

        <View style={stylesStart.boxWrapper}>
          {/* App Title */}

          <View style={stylesStart.box1}>
            <Text style={stylesStart.appTitle}>Simple Chat</Text>
          </View>

          {/* Input Box */}

          <View style={stylesStart.box2}>
            <View style={stylesStart.textInputWrapper}>
              <TextInput
                style={stylesStart.textInput}
                onChangeText={onType}
                blurOnSubmit
                autoCompleteType="name"
                placeholder="Your name"
                value={name}
              />
              <Text style={
                validation
                  ? [stylesStart.textInputValidation, { height: 0 }]
                  : stylesStart.textInputValidation
              }
              >
                Please enter your name
              </Text>
            </View>
            <View style={stylesStart.colorWrapper}>
              <View>
                <Text style={stylesStart.colorPickerText}>
                  Choose Background Color:
                </Text>
              </View>
              <View style={stylesStart.colorPickerContainer}>
                <ColorPicker
                  color={colors.black}
                  activeColor={activeColor}
                  handleOnPress={handleOnPress}
                />
                <ColorPicker
                  color={colors.lilaDark}
                  activeColor={activeColor}
                  handleOnPress={handleOnPress}
                />
                <ColorPicker
                  color={colors.grey}
                  activeColor={activeColor}
                  handleOnPress={handleOnPress}
                />
                <ColorPicker
                  color={colors.green}
                  activeColor={activeColor}
                  handleOnPress={handleOnPress}
                />
                <Text style={
                activeColor !== false
                  ? [stylesStart.colorPickerValidation, { height: 0 }]
                  : stylesStart.colorPickerValidation
                  }
                >
                  Please choose a color
                </Text>
              </View>
            </View>
            <Pressable
              style={
                buttonActive
                  ? stylesStart.button
                  : [stylesStart.button, { opacity: 0.7 }]
              }
              onPress={() => validate()}
            >
              <Text style={stylesStart.buttonText}>Start Chatting</Text>
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Start;
