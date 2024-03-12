# Chat App

## Description:
A chat app for mobile devices built using React Native. The app will provide useres with a chat interface and options to share images and their location.

## Features:
* Users can input a name to be displayed in chatroom
* Users can select a background color for chat room display
* Users can send and receive messages
* Users can send and receive images (picked from device's library or taken with the camera)
* Users can share and receive current locations
* Users can read previous messages when there is no internet connection
* Users can start using the app without signing up for an account through a temporary (local) account

## Technologies:
* **React Native** (framework)
* **Expo** (development platform)
* **Gifted Chat** (React Native library for creating chat interfaces in React Native)
* **Android Studio/Android Emulator** (development testing)
* **Google Firestore Database** (message storage)
* **Google Firebase authentication**
* **Firebase Cloud Storage** (remote image storage)
* **AsyncStorage** (local storage system - cache)
* **Expo ImagePicker API** (for accessing device's media library and uploading images)
* **Expo Location API** (for accessing device's geolocation)
* **react-native-maps** (Expo's recommended package for displaying location data on a map)

## Set Up:
* Clone repository
* Navigate to the root project folder in terminal and run ```npm install``` to install dependencies
* Set up Firestore Database for project
  - Sign in/create an account at Google Firebase
  - Create a new project
  - Build >> Firestore Database (set up database in production mode)
  - Adjust rules to allow for reading and writing (```allow read, write: if false``` to ```allow read, write: if true```)
  - Go to Firebase's project settings and register the web app (</>) to receive Firebase configuration
  - Navigate to root project folder in terminal and install Firestore via Firebase using ```npm install firebase@10.3.1```
  - Replace Firebase configurations with your own configuration retrieved from Firebase into the App.js file
* Install Expo Go app on mobile phone to test app during development on actual device
* Install Android Studio on your computer to emulate an Android phone for development testing (create a virtual device in Virtual Device Manager)
* Run ```npx expo start``` to start Metro Bundler
* Select app from Expo Go on mobile or press ```a``` in terminal to launch it on Android Emulator