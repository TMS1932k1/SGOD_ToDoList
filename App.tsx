import React, {useEffect} from 'react';
import {Linking, SafeAreaView, StatusBar, useColorScheme} from 'react-native';
import notifee, {EventType} from '@notifee/react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {RootNavigator} from './src/navigator';
import {MyStylers} from './src/constants';
import {Provider} from 'react-redux';
import {store} from './src/store/store';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  // Subscribe to events
  useEffect(() => {
    return notifee.onForegroundEvent(async ({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          const {notification} = detail;
          if (notification?.id)
            await notifee.cancelNotification(notification.id);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          const data = detail.notification?.data?.todo;
          if (data) {
            Linking.openURL(`myapp://edit/${JSON.stringify(data)}`);
          }
          if (notification?.id)
            await notifee.cancelNotification(notification.id);
          break;
      }
    });
  }, []);

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
