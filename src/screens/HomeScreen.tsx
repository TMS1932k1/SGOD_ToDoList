import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useLayoutEffect} from 'react';
import {MyDimension, MyStylers} from '../constants';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootNavigatorParams} from '../navigator';
import {Indicator, InputText, TextBtn, TodoList} from '../components';
import {ToDo} from '../types';
import {useAppDispatch, useAppSelector} from '../store/store';
import {readTodos} from '../store/homeSlice';

interface Props {
  navigation: NativeStackNavigationProp<RootNavigatorParams, 'HomeScreen'>;
}

export default function HomeScreen({navigation}: Props) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.todoState.isLoading);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <TextBtn onPress={onAddBtn}>ADD</TextBtn>,
    });
  }, [navigation]);

  useEffect(() => {
    dispatch(readTodos());
  }, []);

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
  const onAddBtn = useCallback(() => {
    navigateToEditScreen();
  }, []);

  // Handler edit button
  const onEditTodo = useCallback((todo: ToDo) => {
    navigateToEditScreen(todo);
  }, []);

  if (isLoading) {
    return <Indicator />;
  }

  return (
    <View style={[MyStylers.rootContainer, styles.container]}>
      <InputText placeholder="Search to do..." />
      <TodoList style={styles.list} onPressItem={onEditTodo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: MyDimension.pandingSmall,
  },
  list: {
    marginTop: MyDimension.pandingLarge,
    flex: 1,
  },
});
