import {StyleSheet, View, KeyboardAvoidingView, Platform} from 'react-native';
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
import {
  fetchToken,
  filterTodo,
  readTodos,
  searchTodo,
} from '../store/homeSlice';
import {startTransition} from 'react';
import {Header} from 'react-native/Libraries/NewAppScreen';
import {RootStackNavigationScreenProps} from '../routes';
import {fcmSendMessage} from '../utils';

interface Props {
  navigation: RootStackNavigationScreenProps<'HomeScreen'>;
}

export default function HomeScreen({navigation}: Props) {
  const dispatch = useAppDispatch();
  const token = useAppSelector(state => state.todoState.token);
  const isLoading = useAppSelector(state => state.todoState.isLoading);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'TODO List',
      headerRight: () => (
        <View style={{flexDirection: 'row'}}>
          <TextBtn onPress={onAddBtn}>ADD</TextBtn>
          {token && (
            <TextBtn style={styles.action} onPress={onUpdateBtn}>
              UPDATE
            </TextBtn>
          )}
        </View>
      ),
    });
  }, [navigation, token]);

  useEffect(() => {
    dispatch(fetchToken());
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

  // Handle add button
  const onAddBtn = useCallback(() => {
    navigateToEditScreen();
  }, []);

  // Handle update btn
  const onUpdateBtn = useCallback(async () => {
    await fcmSendMessage(token!);
  }, [token]);

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
    <KeyboardAvoidingView
      style={MyStylers.rootContainer}
      keyboardVerticalOffset={Header.height + 47}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[MyStylers.rootContainer, styles.container]}>
        <InputText
          placeholder="Search to do..."
          onChangeText={onChangeSearch}
        />
        <DropdownBtn
          style={styles.dropdown}
          data={MyApp.filter}
          onChange={onChangeDropdown}
        />
        <TodoList style={styles.list} onPressItem={onEditTodo} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: MyDimension.pandingSmall,
  },
  actionRight: {
    flexDirection: 'row',
  },
  action: {
    marginLeft: MyDimension.pandingSmall,
  },
  list: {
    marginTop: MyDimension.pandingLarge,
    flex: 1,
  },
  dropdown: {
    marginTop: MyDimension.pandingLarge,
  },
});
