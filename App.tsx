import React, {useEffect} from 'react';
import {SafeAreaView, StatusBar, useColorScheme} from 'react-native';
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
    return notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
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
