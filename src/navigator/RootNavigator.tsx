import {LinkingOptions, NavigationContainer} from '@react-navigation/native';
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {EditScreen, HomeScreen} from '../screens';
import {MyColors} from '../constants';
import {RootNavigatorParams, RootStackRoutesType} from '../configs/routes';

const RootStack = createNativeStackNavigator<RootNavigatorParams>();

const rootStackRoutes: RootStackRoutesType = [
  {name: 'HomeScreen', component: HomeScreen},
  {name: 'EditScreen', component: EditScreen},
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
    },
  },
};

const options: NativeStackNavigationOptions = {
  headerShadowVisible: false,
  headerStyle: {
    backgroundColor: MyColors.backgroundColor,
  },
  contentStyle: {
    backgroundColor: MyColors.backgroundColor,
  },
};

export default function RootNavigator() {
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
