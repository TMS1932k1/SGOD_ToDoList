import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ColorSchemeName,
} from 'react-native';
import React, {useCallback, useEffect, useLayoutEffect, useMemo} from 'react';
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
import {Colors} from '../theme';

interface Props {
  navigation: RootStackNavigationScreenProps<'HomeScreen'>;
}

export default function HomeScreen({navigation}: Props) {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(state => state.todoState.theme);
  const token = useAppSelector(state => state.todoState.token);
  const isLoading = useAppSelector(state => state.todoState.isLoading);

  const styles = useMemo(() => styling(theme), [theme]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'TODO List',
      headerRight: () => (
        <View style={{flexDirection: 'row'}}>
          <TextBtn onPress={onAddBtn} styleText={styles.textColor}>
            ADD
          </TextBtn>
          {token && (
            <TextBtn
              style={styles.action}
              onPress={onUpdateBtn}
              styleText={styles.textColor}>
              UPDATE
            </TextBtn>
          )}
          <TextBtn
            style={styles.action}
            onPress={onSettingBtn}
            styleText={styles.textColor}>
            SETTING
          </TextBtn>
        </View>
      ),
    });
  }, [navigation, token, theme]);

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

  // Handle setting button
  const onSettingBtn = useCallback(() => {
    navigation.navigate('SettingScreen');
  }, [navigation]);

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

  const colorPlacehoder = useMemo(
    () =>
      theme === 'dark'
        ? Colors['dark'].colors.inputBackgroundColor
        : Colors['light'].colors.inputBackgroundColor,
    [theme],
  );

  const colorOnBackground = useMemo(
    () =>
      theme === 'dark'
        ? Colors['dark'].colors.onBackground
        : Colors['light'].colors.onBackground,
    [theme],
  );

  if (isLoading) {
    return <Indicator />;
  }

  return (
    <KeyboardAvoidingView
      style={[MyStylers.rootContainer]}
      keyboardVerticalOffset={Header.height + 47}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[MyStylers.rootContainer, styles.container]}>
        <InputText
          placeholder="Search to do..."
          onChangeText={onChangeSearch}
          colorPlaceHolder={colorPlacehoder}
        />
        <DropdownBtn
          style={styles.dropdown}
          data={MyApp.filter}
          color={colorOnBackground}
          onChange={onChangeDropdown}
        />
        <TodoList style={styles.list} onPressItem={onEditTodo} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styling = (theme: ColorSchemeName) =>
  StyleSheet.create({
    container: {
      padding: MyDimension.pandingSmall,
    },
    actionRight: {
      flexDirection: 'row',
    },
    action: {
      marginLeft: MyDimension.pandingSmall,
    },
    textColor: {
      color: Colors[theme === 'light' ? 'light' : 'dark'].colors.onBackground,
    },
    textInput: {
      color: Colors[theme === 'dark' ? 'light' : 'dark'].colors.onBackground,
    },
    list: {
      marginTop: MyDimension.pandingLarge,
      flex: 1,
    },
    dropdown: {
      marginTop: MyDimension.pandingLarge,
    },
  });
