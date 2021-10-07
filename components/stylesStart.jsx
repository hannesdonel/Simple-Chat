import { StyleSheet } from 'react-native';
import colors from './colors';

const stylesStart = StyleSheet.create({
  backgroundImage: {
    height: '100%',
    width: '100%',
  },
  boxWrapper: {
    flex: 1,
    margin: '6%',
  },
  box1: {
    flex: 7,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  box2: {
    flex: 3,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6%',
    marginTop: '6%',
    minHeight: 130,
  },
  appTitle: {
    fontSize: 45,
    fontWeight: 'bold',
    color: colors.white,
    marginTop: '33%',
  },
  textInput: {
    padding: 10,
    height: 40,
    width: '100%',
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 2,
  },
  colorWrapper: {
    width: '100%',
  },
  colorPickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '66%',
  },
  colorPickerWrapper: {
    padding: 2,
    borderWidth: 3,
    borderRadius: 25,
    width: 40,
    height: 40,
  },
  colorPickerText: {
    fontSize: 16,
    color: colors.lilaLight,
    marginBottom: 6,
  },
  colorPicker: {
    width: 30,
    height: 30,
    borderRadius: 25,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.lilaLight,
    width: '100%',
    height: 40,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default stylesStart;
