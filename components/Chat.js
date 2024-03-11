import { StyleSheet, View, Text, KeyboardAvoidingView, Platform} from 'react-native';
import { useEffect, useState } from 'react';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { collection, getDocs, addDoc, onSnapshot, query, orderBy} from 'firebase/firestore';
//import AsyncStorage to cache message data (local storage)
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ db, route, navigation, isConnected }) => {
  //extract user-inputted name and selected background color from parameters (from Start screen)
  const { id, name, bgColor } = route.params;

  const [messages, setMessages] = useState([]);

  let unsubMessages;

  useEffect(() => {
    //set navigation header's title to the name passed from Start screen
    navigation.setOptions({title: name});

    //load messages from database if online; else,load most recently saves messages array in cache
    if (isConnected === true) {
      /* unregister current onSnapshot() listener to avoid registering multiple
      listeners when useEffect code is re-executed */
      if (unsubMessages) unsubMessages();
      unsubMessages = null;

      //documents in 'messages' collection ordered by the time the message was created
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      unsubMessages = onSnapshot(q, (documentSnapshot) => {
        //construct array of messages from fetched documents
        let newMessages = [];
        documentSnapshot.forEach(doc => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            //convert timestamp stored at createdAt property of each message to a Date object that Gifted Chat understands
            createdAt: new Date(doc.data().createdAt.toMillis())
          })
        });
        //cache new array of messages & assign to messages state (kept up to date when online)
        cacheMessages (newMessages);
        setMessages(newMessages);
      });
    } else loadCachedMessages();

    //clean up code with unsubscribe function of onSnapshot()
    return () => {
      if (unsubMessages) unsubMessages();
    }
  }, [isConnected]);

  //caches messages to local storage on client side
  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };

  //loads messages in cache (when offline & cannot fetch from Firestore database)
  const loadCachedMessages = async () => {
    const cachedMessages = await AsyncStorage.getItem('messages') || [];
    setMessages(JSON.parse(cachedMessages));
  };

  /*
  custom function called when a user sends a message;
  saves sent messages on the Firestore database
  */
  const onSend = (newMessages) => {
   addDoc(collection(db, 'messages'), newMessages[0])
  };

  //function return an altered version of Gifted Chat's speech bubble (customization)
  const renderBubble = (props) => {
    return <Bubble
      //inherit props
      {...props}
      wrapperStyle = {{
        //target right (messages sent from user) & left (sent from others) speech bubbles
        right: {
          backgroundColor: '#000'
        },
        left: {
          backgroundColor: '#FFF'
        }
      }}
    />
  };

  //override Gifted Chat's InputToobar to only render if there is a connection
  const renderInputToolbar = (props) => {
    if (isConnected) {
      return <InputToolbar {...props} />;
    } else {
      return null;
    }
  };

  //return chat interface using Gifted Chat's own GiftedChat component
  return (
    <View style={[styles.container, {backgroundColor: bgColor}]}>
      <GiftedChat
        messages = {messages}
        renderBubble = {renderBubble}
        onSend = {messages => onSend(messages)}
        user = {{
          _id: id,
          name: name
        }}
        renderInputToolbar = {renderInputToolbar}
      />
      {/*
        fix Android issue of keyboard hiding message input field;
        add KeyboardAvoidingView component only if the user's platform OS is Android
      */}
      { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  chatInterface: {
    color: '#000'
  }
});

export default Chat;


/* useEffect(() => {
  setMessages([
    {
      _id: 2,
      text: 'Welcome!',
      createdAt: new Date(),
      user: {
       _id: 2,
       name: 'React Native',
       avatar: 'https://placeimg.com/140/140/any'
      }
    },
    {
      _id: 1,
      text: `${name} has entered the chat`,
      createdAt: new Date(),
      system: true
    }
  ]);
}, []); 

  const onSend = (newMessages) => {
    setMessages (previousMessages => GiftedChat.append(previousMessages, newMessages))
  };
  */