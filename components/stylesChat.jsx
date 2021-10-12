import { StyleSheet } from 'react-native';

import colors from './colors';

const stylesChat = StyleSheet.create({
  offlineInputWrapper: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.red,
  },
  offlineInput: {
    color: colors.white,
    textAlign: 'center',
  },
});

export default stylesChat;
