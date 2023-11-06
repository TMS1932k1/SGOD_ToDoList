import {
  ParamListBase,
  RouteConfig,
  RouteProp,
  StackNavigationState,
} from '@react-navigation/native';
import {ToDo} from '../../types';
import {
  NativeStackNavigationEventMap,
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

type StackRoutesType<ParamList extends ParamListBase> = Array<
  RouteConfig<
    ParamList,
    keyof ParamList,
    StackNavigationState<ParamList>,
    NativeStackNavigationOptions,
    NativeStackNavigationEventMap
  >
>;

export type RootNavigatorParams = {
  HomeScreen: undefined;
  EditScreen: {todo: ToDo} | undefined;
};

export type RootStackScreenProps<T extends keyof RootNavigatorParams> =
  NativeStackScreenProps<RootNavigatorParams, T>;

export type RootStackNavigationScreenProps<
  T extends keyof RootNavigatorParams,
> = NativeStackNavigationProp<RootNavigatorParams, T>;

export type RootStackRouteScreenProps<T extends keyof RootNavigatorParams> =
  RouteProp<RootNavigatorParams, T>;

export type RootStackRoutesType = StackRoutesType<RootNavigatorParams>;
