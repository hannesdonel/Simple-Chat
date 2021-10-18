import AsyncStorage from '@react-native-async-storage/async-storage';
import { metadataReference } from '../firebase';

const dbServices = (dbServicesProps) => {
  const {
    initialMessages, setMessages, setUid, setLoading, uid, setIsTyping,
  } = dbServicesProps;

  const services = {
    // Retrieve messages from local storage
    getMessages: async () => {
      let storedMessages = '';
      try {
        storedMessages = await AsyncStorage.getItem('messages') || initialMessages;
        if (storedMessages === initialMessages) {
          setMessages(initialMessages);
        } else {
          setMessages(JSON.parse(storedMessages));
        }
      } catch (error) {
        console.log(error.message);
      }
    },

    // Store messages in local storage
    saveMessages: async (elements) => {
      try {
        await AsyncStorage.setItem('messages', JSON.stringify(elements));
      } catch (error) {
        console.log(error.message);
      }
    },

    // Retrieve UID from local storage
    getUid: async () => {
      let uId = '';
      try {
        uId = await AsyncStorage.getItem('uid') || '';
        setUid(JSON.parse(uId));
      } catch (error) {
        console.log(error.message);
      }
    },

    // Store UID in local storage
    saveUid: async (id) => {
      try {
        await AsyncStorage.setItem('uid', JSON.stringify(id));
      } catch (error) {
        console.log(error.message);
      }
    },

    // Get messages from Firebase
    onCollectionUpdate: (querySnapshot) => {
      const fetchedMessages = querySnapshot.docs.map((element) => {
        const {
          _id, text, createdAt, user, image, location,
        } = element.data();
        return {
          _id,
          text,
          image,
          location,
          createdAt: Date.parse(createdAt.toDate()),
          user,
        };
      });
      initialMessages.forEach((element) => fetchedMessages.push(element));
      const newMessages = fetchedMessages.sort((a, b) => b.createdAt - a.createdAt);
      setMessages(newMessages);
      services.saveMessages(newMessages);
      setLoading(false);
    },

    // Get metadata from Firebase
    onMetadataUpdate: (querySnapshot) => {
      const metadata = querySnapshot.docs.map((element) => element.data());
      if (metadata[0].uid !== uid) {
        setIsTyping(metadata[0].isTyping);
      }
      setTimeout(() => metadataReference.doc('BS5BwiimxHiTJOfkVaeR').update({ isTyping: false }), 10000);
    },
  };

  return services;
};

export default dbServices;
