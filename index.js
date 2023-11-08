import {AppRegistry, Linking} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee, {EventType} from '@notifee/react-native';

notifee.onBackgroundEvent(async ({type, detail}) => {
  switch (type) {
    case EventType.DISMISSED:
      const {notification} = detail;
      if (notification?.id) await notifee.cancelNotification(notification.id);
      break;
    case EventType.PRESS:
      console.log('User pressed notification', detail.notification);
      const data = detail.notification.data.todo;
      if (data) {
        Linking.openURL(`myapp://edit/${JSON.stringify(data)}`);
      }
      if (notification?.id) await notifee.cancelNotification(notification.id);
      break;
  }
});

AppRegistry.registerComponent(appName, () => App);
