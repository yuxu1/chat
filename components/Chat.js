import { StyleSheet, View, Text, KeyboardAvoidingView, Platform} from 'react-native';
import { useEffect, useState } from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

const Chat = ({ route, navigation }) => {
  //extract user-inputted name and selected background color from parameters (from Start screen)
  const { name, bgColor } = route.params;

  const [messages, setMessages] = useState([]);

  //set navigation header's title to the name passed from Start screen
  useEffect(() => {
    navigation.setOptions({title: name});
  }, []);

  //set messages state with 2 static messages (a system message & a user message)
  useEffect(() => {
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

  /*
  custom function called when a user sends a message;
  appends the new message to the conversation (using the latest value of the messages state)
  */
  const onSend = (newMessages) => {
    setMessages (previousMessages => GiftedChat.append(previousMessages, newMessages))
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

  //return chat interface using Gifted Chat's own GiftedChat component
  return (
    <View style={[styles.container, {backgroundColor: bgColor}]}>
      <GiftedChat
        messages = {messages}
        renderBubble = {renderBubble}
        onSend = {messages => onSend(messages)}
        user = {{
          _id: 1
        }}
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