import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, LogBox, Alert } from 'react-native';
import { useEffect } from 'react';

//import screens
import Start from './components/Start';
import Chat from './components/Chat';

//import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//import Firebase/Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, disableNetwork, enableNetwork } from 'firebase/firestore';

//import NetInfo (to check connection status of user)
import { useNetInfo }from '@react-native-community/netinfo';

//import Firebase Storage Cloud
import { getStorage } from 'firebase/storage';

//dismiss warning message
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

//create the navigator
const Stack = createNativeStackNavigator();

const App = () => {

  //web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDLg8W_tORm_qo5WqcsPqqcOL0WROVtH6E",
    authDomain: "chat-d84df.firebaseapp.com",
    projectId: "chat-d84df",
    storageBucket: "chat-d84df.appspot.com",
    messagingSenderId: "883360226160",
    appId: "1:883360226160:web:7d2e52d1d13d97c7980db5"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  //Initialize handler to Firebase Storage
  const storage = getStorage(app);

  //initialize state of user's connection status - check if user is online
  const connectionStatus = useNetInfo();

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert ('Connection has been lost!');
      //disable attempts to reconnect to Firestore db is offline
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      //re-enable connection to Firestore db when back online
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    <NavigationContainer>
      {/* contains screens that user can navigate betweem, starting with Start screen at initial loading */}
      <Stack.Navigator initialRouteName = 'Start'>
        <Stack.Screen name = 'Start' component = {Start}/>
        {/* pass database object, up-to-date connection status, & Firestore storage handler to Chat component */}
        <Stack.Screen name = 'Chat'>
          {props => <Chat
            isConnected={connectionStatus.isConnected}
            db={db}
            storage={storage}
            {...props}
          />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;