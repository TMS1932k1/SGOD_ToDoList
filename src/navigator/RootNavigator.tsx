import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {EditScreen, HomeScreen} from '../screens';
import {MyColors} from '../constants';
import {ToDo} from '../types';

const Stack = createNativeStackNavigator<RootNavigatorParams>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="HomeScreen"
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: MyColors.backgroundColor,
          },
          contentStyle: {
            backgroundColor: MyColors.backgroundColor,
          },
        }}>
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            title: 'TODO List',
          }}
        />
        <Stack.Screen name="EditScreen" component={EditScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export type RootNavigatorParams = {
  HomeScreen: undefined;
  EditScreen: {todo?: ToDo};
};
