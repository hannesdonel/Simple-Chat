import React from 'react';
import { StyleSheet } from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';

import colors from './colors';

const loader = require('./loader.json');

const Loader = () => {
  const styles = StyleSheet.create({
    lottie: {
      width: 100,
      height: 100,
    },
  });

  return (
    <AnimatedLoader
      source={loader}
      visible
      overlayColor={colors.whiteOpacity}
      animationStyle={styles.lottie}
      speed={1}
    />
  );
};

export default Loader;
