import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform} from 'react-native';

export const fcmRequestUserPermission = async () => {
  if (Platform.OS === 'ios') {
    // IOS
    await messaging().requestPermission();
  } else {
    // Android
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }
};

export const fcmGetToken = async () => {
  // Request permission
  await fcmRequestUserPermission();

  // Register the device with FCM
  await messaging().registerDeviceForRemoteMessages();

  // Get the token
  const token = await messaging().getToken();

  return token;
};

export const fcmSendMessage = async (token: string) => {
  console.log(token);
};
