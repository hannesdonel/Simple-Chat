import React from 'react';
import {
  Pressable, View, Text, Alert, Keyboard,
} from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import stylesCustomActions from './stylesCustomActions';

const CustomActions = ({
  customColor, setImagePick, onTyping, sendLocation,
}) => {
  const { showActionSheetWithOptions } = useActionSheet();

  // Lets user pick an image
  const pickImage = async () => {
    let result;
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status === 'granted') {
        result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'Images' });
      }
      if (status !== 'granted') {
        Alert.alert('Missing permission', 'Please grant permission to access your storage.');
      }
    } catch (error) {
      console.log(error);
    }

    if (!result.cancelled) {
      setImagePick(result);
    }
  };

  // Lets user take a photo
  const takePhoto = async () => {
    let result;
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status === 'granted') {
        result = await ImagePicker.launchCameraAsync();
      }
      if (status !== 'granted') {
        Alert.alert('Missing permission', 'Please grant permission to access your camera.');
      }
    } catch (error) {
      console.log(error);
    }

    if (!result.cancelled) {
      setImagePick(result);
    }
  };

  // Lets user pick his location
  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status === 'granted') {
      const result = await Location.getCurrentPositionAsync({});

      if (result) {
        sendLocation(result);
      }
    }
  };

  // Opens the Action Sheet to choose what kind of data to pick
  const onActionPress = () => {
    Keyboard.dismiss();
    onTyping(true);
    const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickImage();
            break;
          case 1:
            takePhoto();
            return;
          case 2:
            getLocation();
            break;
          default:
            onTyping('');
        }
      },
    );
  };

  return (
    <Pressable
      accessible
      accessibilityLabel="More options"
      accessibilityHint="Let’s you choose to send an image or your geolocation."
      style={[stylesCustomActions.container]}
      onPress={onActionPress}
    >
      <View style={[stylesCustomActions.wrapper, { borderColor: customColor }]}>
        <Text style={[stylesCustomActions.iconText, { color: customColor }]}>
          +
        </Text>
      </View>
    </Pressable>
  );
};

export default CustomActions;
