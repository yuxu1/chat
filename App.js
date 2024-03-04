import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

//import screens
import Start from './components/Start';
import Chat from './components/Chat';

//import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//create the navigator
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      {/* contains screens that user can navigate betweem, starting with Start screen at initial loading */}
      <Stack.Navigator initialRouteName = 'Start'>
        <Stack.Screen
          name = 'Start'
          component = {Start}
        />
        <Stack.Screen
          name = 'Chat'
          component = {Chat}
        />
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