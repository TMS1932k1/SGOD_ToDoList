import {LinkingOptions, NavigationContainer} from '@react-navigation/native';
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {
  EditScreen,
  HomeScreen,
  InfoUpdateScreen,
  SettingScreen,
} from '../screens';
import {RootNavigatorParams, RootStackRoutesType} from './routeConfig';
import {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../store/store';
import {getTheme} from '../store/homeSlice';
import {Colors} from '../theme';
import {Appearance} from 'react-native';
import {save} from '../utils';

const RootStack = createNativeStackNavigator<RootNavigatorParams>();

const rootStackRoutes: RootStackRoutesType = [
  {name: 'HomeScreen', component: HomeScreen},
  {name: 'EditScreen', component: EditScreen},
  {name: 'InfoUpdateScreen', component: InfoUpdateScreen},
  {name: 'SettingScreen', component: SettingScreen},
];

const linking: LinkingOptions<RootNavigatorParams> = {
  prefixes: ['myapp://', 'https://app.myapp.com'],
  config: {
    initialRouteName: 'HomeScreen',
    screens: {
      HomeScreen: 'home',
      EditScreen: {
        path: 'edit/:todo',
        parse: {
          todo: todo => JSON.parse(todo),
        },
      },
      InfoUpdateScreen: 'infoupdate',
    },
  },
};

export default function RootNavigator() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(state => state.todoState.theme);

  useEffect(() => {
    dispatch(getTheme());
  }, []);

  const options: NativeStackNavigationOptions = {
    headerShadowVisible: false,
    headerTintColor:
      Colors[theme === 'light' ? 'light' : 'dark'].colors.onBackground,
    headerStyle: {
      backgroundColor:
        Colors[theme === 'light' ? 'light' : 'dark'].colors.backgroundColor,
    },
    contentStyle: {
      backgroundColor:
        Colors[theme === 'light' ? 'light' : 'dark'].colors.backgroundColor,
    },
  };

  return (
    <NavigationContainer linking={linking}>
      <RootStack.Navigator
        initialRouteName="HomeScreen"
        screenOptions={options}>
        {rootStackRoutes.map(stackRoute => (
          <RootStack.Screen key={stackRoute.name} {...stackRoute} />
        ))}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
