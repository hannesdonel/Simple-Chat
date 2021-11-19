import { StyleSheet } from 'react-native';

import colors from './colors';

const stylesCustomActions = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: colors.transparent,
  },
});

export default stylesCustomActions;
