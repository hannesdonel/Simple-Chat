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
  const [bubbleColor, setBubbleColor] = useState(null);
  const [textColor, setTextColor] = useState(null);
  const [validation, setValidation] = useState(true);
  const [buttonActive, setButtonActive] = useState(false);

  const navigation = useNavigation();

  // Actions that fires on START CHATTING button press
  const handleOnPress = (color1, color2, color3) => {
    if (name !== '' && color1 !== null) {
      setButtonActive(true);
    }
    setActiveColor(color1);
    setBubbleColor(color2);
    setTextColor(color3);
  };

  // Check if name is provided and color is chosen
  const validate = () => {
    if (name !== '' && activeColor !== null) {
      setValidation(true);
      navigation.navigate('Chat', {
        name, activeColor, bubbleColor, textColor,
      });
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

  // Check again if name is provided and color is chosen
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

      {/* Background Image */}
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

            {/* Color Picker */}

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

            {/* Start chatting button */}

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
