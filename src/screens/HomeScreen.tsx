import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useLayoutEffect} from 'react';
import {MyDimension, MyStylers} from '../constants';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootNavigatorParams} from '../navigator';
import {InputText, TextBtn} from '../components';
import {ToDo} from '../types';

interface Props {
  navigation: NativeStackNavigationProp<RootNavigatorParams, 'HomeScreen'>;
}

export default function HomeScreen({navigation}: Props) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <TextBtn onPress={onAddBtn}>ADD</TextBtn>,
    });
  }, [navigation]);

  // Navigate to Edit Screen with params:
  //  + todo?: ToDo  todo is need edit, won't pass param will is add todo
  const navigateToEditScreen = useCallback(
    (todo?: ToDo) => {
      navigation.navigate('EditScreen', {
        todo: todo,
      });
    },
    [navigation],
  );

  // Hanlder add button
  const onAddBtn = () => {
    navigateToEditScreen();
  };

  return (
    <View style={[MyStylers.rootContainer, styles.container]}>
      <InputText placeholder="Search to do..." />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: MyDimension.pandingSmall,
  },
});
