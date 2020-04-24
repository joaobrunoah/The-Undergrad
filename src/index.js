import React, {Component, useEffect} from 'react';
import {Alert} from 'react-native';

import firebase from './services/firebaseConnection';

//StatusBar
import './configs/StatusBarConfig';

//Navigation
import Routes from './routes/switch';

console.disableYellowBox = true;

const App = () => {
  useEffect(() => {
    checkPermission();
    messageListener();
  }, []);

  const checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      getFcmToken();
    } else {
      requestPermission();
    }
  };

  const getFcmToken = async () => {
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      //console.log('Your Firebase Token is:' + fcmToken);
    } else {
      console.warn('No push token was received');
    }
  };

  const requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
    } catch (error) {
      // User has rejected permissions
    }
  };

  const messageListener = async () => {
    // const notificationListener = firebase.notifications().onNotification((notification) => {
    //   const { title, body } = notification;
    //   showAlert(title, body);
    // });

    const notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        const {title, body} = notificationOpen.notification;
        //showAlert(title, body);
      });

    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const {title, body} = notificationOpen.notification;
      //showAlert(title, body);
    }

    const messageListener = firebase.messaging().onMessage(message => {});
  };

  const showAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );
  };

  return <Routes />;
};

export default App;
