import { StyleSheet } from 'react-native';
import colors from './colors';

const styles = StyleSheet.create({
  containerCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  marginTop: {
    marginTop: 5,
  },
  marginBottom: {
    marginBottom: 5,
  },
  textInput: {
    padding: 4,
    height: 35,
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 3,
  },
});

export default styles;
