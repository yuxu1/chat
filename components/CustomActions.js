import { TouchableOpacity, View, Text, StyleSheet, Alert } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';

//import ImagePicker and Location APIs for communication features
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';

const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userID }) => {
  //fetch ActionSheet included inside wrapper component (GiftedChat)
  const actionSheet = useActionSheet();

  //pressing action button displays list of options for communication features
  const onActionPress = () => {
    const options = ['Select an image from library', 'Take a photo', 'Share Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex
      },
      //call corresponding functions when user selects each respective option
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickImage();
            return;
          case 1:
            takePhoto();
            return;
          case 2:
            getLocation();
          default:
        }
      },
    );
  };

  //user select image from device, then uploads to Firestore Storage and sent in message
  const pickImage = async () => {
    //request permission to access device's gallery
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    //if permission granted, launch gallery for user to pick an image
    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync();
      //if user picks an image,fetch URI from image and convert to a blob before uploading to remote storage
      if(!result.canceled) {
        await uploadAndSendImage(result.assets[0].uri);
      } else {
        Alert.alert('Permissions haven\'t been granted.');
      }
    }
  };

  //allow user to use device camera to take a photo to be sent/uploaded
  const takePhoto = async () => {
    //request permission to access device camera
    let permissions = await ImagePicker.requestCameraPermissionsAsync();
    //if permission granted, launch device camera
    if (permissions?.granted) {
      let result = await ImagePicker.launchCameraAsync();
      //if photo taken, send the image's URI to uploadAndSendImage function
      if (!result.canceled) {
        await uploadAndSendImage(result.assets[0].uri);
      } else {
        Alert.alert('Permissions haven\'t been granted.');
      }
    }
  };

  const getLocation = async () => {
    //request permission to access geolocation of device
    let permissions = await Location.requestForegroundPermissionsAsync();
    //if permission granted, get coordinates of current user location
    if (permissions?.granted) {
      const location = await Location.getCurrentPositionAsync({});
      if(location) {
        /*send message containing location property (other properties added by default)
        contains data necessary to render MapView in message bubble*/
        onSend({
          location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude
          },
        });
      } else {
        Alert.alert('Error occurred while fetching location');
      }
    } else {
      Alert.alert('Permissions to read location haven\'t been granted');
    }
  };

   /*
    function to create a unique reference string for each new file to be uploaded
    extracts original file name from picked image's URI & combines it with user's ID and current timestamp
    */
    const generateReference = (uri) => {
      const timeStamp = (new Date()).getTime();
      const imageName = uri.split('/')[uri.split('/').length -1];
      return `${userID}-${timeStamp}-${imageName}`;
    };
  
    /*
      uploading and sending an image as a message
      fetch URI from image and convert to a blob
      then uploaded to storage and sent as a message with a generated unique reference
    */
    const uploadAndSendImage = async (imageURI) => {
      const uniqueRefString = generateReference(imageURI);
      const newUploadRef = ref(storage, uniqueRefString);
      const response = await fetch(imageURI);
      const blob = await response.blob();
      uploadBytes(newUploadRef, blob).then(async (snapshot) => {
        //get remote URL of image just uploaded
        const imageURL = await getDownloadURL(snapshot.ref);
        onSend({ image: imageURL });
      });
    };

  return (
    <TouchableOpacity 
      accessible={true}
      accessibilityLabel='more options'
      accessibilityHint='lets you choose to send an image or your location'
      accessibilityRole='button'
      style={styles.container}
      onPress={onActionPress}
    >
      {/* wrapperStle & iconTextStyle = default props provided by Gifted Chat */}
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  }
});

export default CustomActions;