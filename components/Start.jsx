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
const icon = require('../public/icon.svg');

const Start = () => {
  const [name, setName] = useState('');
  const [activeColor, setActiveColor] = useState(colors.white);

  const navigation = useNavigation();

  const handleOnPress = (color) => {
    setActiveColor(color);
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
            <TextInput
              style={[stylesStart.textInput, styles.marginTop, styles.marginBottom]}
              onChangeText={setName}
              blurOnSubmit
              autoCompleteType="name"
              placeholder="Your name"
              value={name}
              left={icon}
            />
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
              </View>
            </View>
            <Pressable
              style={stylesStart.button}
              onPress={() => navigation.navigate('Chat', { name, activeColor })}
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
