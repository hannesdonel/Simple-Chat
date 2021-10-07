import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

import styles from './styles';
import stylesChat from './stylesChat';

const Chat = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { name, activeColor } = route.params;

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, [name]);

  return (
    <View style={[styles.containerCenter, { backgroundColor: activeColor }]}>
      <Text style={stylesChat.welcome}>
        Hello
        {' '}
        {name}
        !
      </Text>
    </View>
  );
};

export default Chat;
