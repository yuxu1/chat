import { StyleSheet, View, Text, Button } from 'react-native';
import { useEffect } from 'react';

const Chat = ({ route, navigation }) => {
  const { name, bgColor } = route.params;

  //set navigation header's title to the name passed from Start screen
  useEffect(() => {
    navigation.setOptions({title: name});
  }, []);

  return (
    <View style={[styles.container, {backgroundColor: bgColor}]}>
      <Text>Chat Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default Chat;