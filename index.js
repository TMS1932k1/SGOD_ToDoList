import {AppRegistry, Linking} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee, {EventType} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {createDisplayNotification} from './src/utils';

const onMessageReceived = async message => {
  console.log('Create notification');
  await createDisplayNotification(
    message.notification?.title,
    message.notification?.body,
  );
};

messaging().setBackgroundMessageHandler(onMessageReceived);

notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification, pressAction} = detail;
  switch (type) {
    case EventType.DISMISSED:
      if (notification?.id) await notifee.cancelNotification(notification.id);
      break;
    case EventType.PRESS:
      console.log('User pressed notification', notification);
      const data = notification?.data?.todo;
      if (data) {
        Linking.openURL(`myapp://edit/${JSON.stringify(data)}`);
      }
      if (notification?.id) await notifee.cancelNotification(notification.id);
      break;
    case EventType.ACTION_PRESS:
      console.log('User action pressed notification', notification);
      if (pressAction?.id && pressAction?.id === 'read') {
        console.log(pressAction?.id);
        Linking.openURL('myapp://infoupdate');
      }
      if (notification?.id) await notifee.cancelNotification(notification.id);
      break;
  }
});

AppRegistry.registerComponent(appName, () => App);
