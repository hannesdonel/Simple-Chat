import { StyleSheet } from 'react-native';

import colors from './colors';

const stylesChat = StyleSheet.create({
  mapView: {
    width: 150,
    height: 150,
    margin: 3,
  },
  mapViewWrapper: {
    borderRadius: 22,
    overflow: 'hidden',
  },
  inputWrapper: {
    flex: 1,
  },
  imageWrapper: {
    flex: 1,
    width: '100%',
    height: '33%',
  },
  image: {
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  closeButtonWrapper: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 0,
    position: 'absolute',
    top: 10,
    right: 10,
    opacity: 0.75,
  },
  closeButton: {
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
  },
  loaderWrapper: {
    height: 50,
    width: 50,
  },
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
