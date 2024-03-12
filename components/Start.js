import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';

import { useState } from 'react';
import { getAuth, signInAnonymously } from 'firebase/auth';

//prevent message warning against upcoming deprecation of packager
import { LogBox } from 'react-native';
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

const Start = ({ navigation }) => {
  const [name, setName] = useState('');
  const [bgColor, setBgColor] = useState('');
  const colors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];

  //initialize Firebase authentication handler
  const auth = getAuth();

  //function to  authenticate user anonymously before entering chatroom
  const signInUser = () => {
    signInAnonymously(auth)
    //if user is logged in,navigate to Chat screen passing route paramters: user's ID, name, & selected background color
      .then(result => {
        navigation.navigate('Chat', {userID: result.user.uid, name: name, bgColor: bgColor});
        Alert.alert('Signed in Successfully!');
      })
      .catch((error) => {
        Alert.alert('Unable to sign in, try later again.');
      })
  }

  return (
    //background image
    <ImageBackground
      source={require('../assets/background-image.png')}
      style={styles.container}
    >
      {/* app title */}
      <Text style={styles.titleText}>CHAT</Text>
      {/* box for user name input and background color selection */}

    {/* user interaction section */}
      <View style={styles.box}>
        {/* user name input (to be displayed when enter chatroom) */}
        <TextInput
          accessible={true}
          accesibilityLabel = 'Enter your name'
          style={styles.textInput}
          value={name}
          onChangeText={setName}
          placeholder="Your Name"
        />

        <Text style={styles.chooseBackgroundColor}>
          Choose Background Color:
        </Text>
        {/* buttons for background color options that user can select
        (sets selected color as background color of chatroom) */}
        <View style={styles.backgroundColorOptions}>
          {colors.map((color, index) => (
            <TouchableOpacity
              accessible={true}
              accessibilityLabel = 'select a background color for chatroom'
              accessibilityRole = 'button'
              key={index}
              /*set each button's color to corresponding color in colors array
              change styling to reflect selection status if button color matches bgColor(when user presses it)*/
              style={[
                styles.colorButton,
                { backgroundColor: color },
                bgColor === color && styles.selectedColor,
              ]}
              onPress={() => setBgColor(color)}
            />
          ))}
        </View>

        {/* button to navigate to Chat screen */}
        <TouchableOpacity
          accessible = {true}
          accessibilityLabel = 'enter chatroom'
          accessibilityRole = 'button'
          style={styles.startChatButton}
          onPress={signInUser}
        >
          <Text style={styles.buttonInnerText}>Start Chatting</Text>
        </TouchableOpacity>

        {/* 
          fix keyboard issue on iOS - keyboard covers name & background color picker form;
          adds KeyBoardAvoidingView component only if user's platform OS is iOS
         */}
        {Platform.OS === 'ios' ? (
          <KeyboardAvoidingView behavior="padding" />
        ) : null}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    flex: 1,
    fontSize: 45,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 80,
  },
  box: {
    flex: 1,
    width: '88%',
    height: '44%',
    marginBottom: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  textInput: {
    width: '88%',
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 0.5,
    padding: 15,
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 15,
  },
  chooseBackgroundColor: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 1,
  },
  backgroundColorOptions: {
    flexDirection: 'row',
    width: '88%',
    justifyContent: 'space-between',
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  selectedColor: {
    borderColor: '#757083',
    borderWidth: 1,
    borderLeftWidth: 4,
  },
  startChatButton: {
    width: '88%',
    backgroundColor: '#757083',
  },
  buttonInnerText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    margin: 15,
  },
});

export default Start;
