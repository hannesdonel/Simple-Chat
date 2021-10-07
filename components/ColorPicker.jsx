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

  return (
    <View style={[stylesStart.colorPickerWrapper, { borderColor: active ? color : colors.white }]}>
      <Pressable
        style={[stylesStart.colorPicker, { backgroundColor: color }]}
        onPress={() => {
          handleOnPress(color);
          toggleActive();
        }}
      />
    </View>
  );
};

export default ColorPicker;
