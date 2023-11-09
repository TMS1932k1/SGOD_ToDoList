import React, {useEffect} from 'react';
import {Linking, SafeAreaView, StatusBar, useColorScheme} from 'react-native';
import notifee, {EventType} from '@notifee/react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {RootNavigator} from './src/routes';
import {MyStylers} from './src/constants';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import {createDisplayNotification} from './src/utils';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  // Subscribe to events
  useEffect(() => {
    messaging().onMessage(onMessageReceived);
    messaging().setBackgroundMessageHandler(onMessageReceived);

    notifee.onForegroundEvent(async ({type, detail}) => {
      const {notification, pressAction} = detail;
      switch (type) {
        case EventType.DISMISSED:
          if (notification?.id)
            await notifee.cancelNotification(notification.id);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', notification);
          const data = notification?.data?.todo;
          if (data) {
            Linking.openURL(`myapp://edit/${JSON.stringify(data)}`);
          }
          if (notification?.id)
            await notifee.cancelNotification(notification.id);
          break;
        case EventType.ACTION_PRESS:
          console.log('User action pressed notification', notification);
          if (pressAction?.id && pressAction?.id === 'read') {
            console.log(pressAction?.id);
            Linking.openURL('myapp://infoupdate');
          }
          Linking.openURL('myapp://infoupdate');
          if (notification?.id)
            await notifee.cancelNotification(notification.id);
          break;
      }
    });
  }, []);

  const onMessageReceived = async (
    message: FirebaseMessagingTypes.RemoteMessage,
  ) => {
    console.log('Create notification');
    await createDisplayNotification(
      message.notification?.title,
      message.notification?.body,
    );
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <Provider store={store}>
      <SafeAreaView style={[MyStylers.rootContainer, backgroundStyle]}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <RootNavigator />
      </SafeAreaView>
    </Provider>
  );
}

export default App;
