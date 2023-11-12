import React, {useCallback, useEffect} from 'react';
import {Linking, SafeAreaView, StatusBar, useColorScheme} from 'react-native';
import notifee, {EventType} from '@notifee/react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {RootNavigator} from './src/routes';
import {MyStylers} from './src/constants';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import {createDisplayNotification, get, save} from './src/utils';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import BootSplash from 'react-native-bootsplash';

function App(): JSX.Element {
  const appearance = useColorScheme();

  const setAppTheme = useCallback(async () => {
    const isFirst = await get('@isfirst');
    if (isFirst === null) {
      save('@theme', appearance);
      save('@isdefault', true);
      save('@isfirst', true);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await setAppTheme();
    };

    init().finally(async () => {
      await BootSplash.hide({fade: true});
      console.log('BootSplash has been hidden successfully');
    });
  }, []);

  // Subscribe to events
  useEffect(() => {
    messaging().onMessage(onMessageReceived);
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
    backgroundColor: appearance === 'dark' ? Colors.darker : Colors.lighter,
  };

  return (
    <Provider store={store}>
      <SafeAreaView style={[MyStylers.rootContainer, backgroundStyle]}>
        <StatusBar
          barStyle={appearance === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <RootNavigator />
      </SafeAreaView>
    </Provider>
  );
}

export default App;
