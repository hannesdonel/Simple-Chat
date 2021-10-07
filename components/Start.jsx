import React, { useState } from 'react';
import {
  View, Text, Button, TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from '../styles';

const Start = () => {
  const [name, setName] = useState('');
  const navigation = useNavigation();

  return (
    <View style={styles.containerCenter}>
      <Text>Hey there</Text>
      <TextInput
        style={[styles.textInput, styles.marginTop, styles.marginBottom]}
        onChangeText={setName}
        blurOnSubmit
        autoCompleteType="name"
        placeholder="Enter your name"
        value={name}
      />
      <Button
        style={styles.marginTop}
        title="Let's go"
        onPress={() => navigation.navigate('Chat', { name })}
      />
    </View>
  );
};

export default Start;
