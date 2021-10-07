import React from 'react';
import { View, Text } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

import styles from '../styles';

const Char = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { name } = route.params;
  navigation.setOptions({ title: name });

  return (
    <View style={styles.containerCenter}>
      <Text>
        Hello
        {' '}
        {name}
        !
      </Text>
    </View>
  );
};

export default Char;
