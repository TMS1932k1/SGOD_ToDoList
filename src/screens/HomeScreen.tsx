import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useLayoutEffect} from 'react';
import {MyApp, MyDimension, MyStylers} from '../constants';

import {
  DropdownBtn,
  Indicator,
  InputText,
  TextBtn,
  TodoList,
} from '../components';
import {Filter, ToDo} from '../types';
import {useAppDispatch, useAppSelector} from '../store/store';
import {filterTodo, readTodos, searchTodo} from '../store/homeSlice';
import {startTransition} from 'react';
import {RootStackNavigationScreenProps} from '../configs/routes';

interface Props {
  navigation: RootStackNavigationScreenProps<'HomeScreen'>;
}

export default function HomeScreen({navigation}: Props) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.todoState.isLoading);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'TODO List',
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
      if (todo) {
        navigation.navigate('EditScreen', {todo: todo});
      } else {
        navigation.navigate('EditScreen');
      }
    },
    [navigation],
  );

  // Hanlde add button
  const onAddBtn = useCallback(() => {
    navigateToEditScreen();
  }, []);

  // Handle edit button
  const onEditTodo = useCallback((todo: ToDo) => {
    navigateToEditScreen(todo);
  }, []);

  // Handle search todo with text
  const onChangeSearch = (value: string) =>
    startTransition(() => {
      dispatch(searchTodo(value));
    });

  // Handle filter to with current item
  const onChangeDropdown = useCallback(
    (item: {label: Filter; value: Filter}) => {
      dispatch(filterTodo(item.label));
    },
    [dispatch],
  );

  if (isLoading) {
    return <Indicator />;
  }

  return (
    <View style={[MyStylers.rootContainer, styles.container]}>
      <InputText placeholder="Search to do..." onChangeText={onChangeSearch} />
      <DropdownBtn
        style={styles.dropdown}
        data={MyApp.filter}
        onChange={onChangeDropdown}
      />
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
  dropdown: {
    marginTop: MyDimension.pandingLarge,
  },
});
