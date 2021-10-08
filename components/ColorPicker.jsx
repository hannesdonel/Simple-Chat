import React, { useEffect, useState } from 'react';
import {
  View, Pressable,
} from 'react-native';

import colors from './colors';

import stylesStart from './stylesStart';

const ColorPicker = ({ color, activeColor, handleOnPress }) => {
  const [active, setActive] = useState(false);

  const toggleActive = () => {
    if (color === activeColor) {
      setActive(true);
    } else {
      setActive(false);
    }
  };
  useEffect(() => {
    toggleActive();
  }, [activeColor]);

  let bubbleColor;
  let textColor;
  switch (color) {
    case colors.black:
      bubbleColor = colors.grey;
      textColor = colors.white;
      break;
    case colors.lilaDark:
      bubbleColor = colors.grey;
      textColor = colors.white;
      break;
    case colors.grey:
      bubbleColor = colors.lilaDark;
      textColor = colors.black;
      break;
    case colors.green:
      bubbleColor = colors.grey;
      textColor = colors.black;
      break;
    default:
      bubbleColor = null;
      textColor = null;
      break;
  }

  return (
    <View style={[stylesStart.colorPickerWrapper, { borderColor: active ? color : colors.white }]}>
      <Pressable
        accessible
        accessibilityHint="Let's you choose the background color of your chat interface."
        accessibilityLabel="Color Picker"
        accessibilityRole="button"
        style={[stylesStart.colorPicker, { backgroundColor: color }]}
        onPress={() => {
          handleOnPress(color, bubbleColor, textColor);
          toggleActive();
        }}
      />
    </View>
  );
};

export default ColorPicker;
