import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ColorSchemeName,
} from 'react-native';
import React, {useCallback, useLayoutEffect, useMemo} from 'react';
import {MyColors, MyDimension, MyStylers} from '../constants';
import {DeadlineSession, EditInput, TextBtn} from '../components';
import {InputsEdit, ToDo} from '../types';
import {useAppDispatch, useAppSelector} from '../store/store';
import {addNewTodo, updateTodo} from '../store/homeSlice';
import {useRoute} from '@react-navigation/native';
import {useForm} from 'react-hook-form';
import {cancleNotifee, createTriggerNotification, save} from '../utils';
import {Header} from 'react-native/Libraries/NewAppScreen';
import {
  RootStackNavigationScreenProps,
  RootStackRouteScreenProps,
} from '../routes';
import {Colors} from '../theme';

interface Props {
  navigation: RootStackNavigationScreenProps<'EditScreen'>;
}

export default function EditScreen({navigation}: Props) {
  const route = useRoute<RootStackRouteScreenProps<'EditScreen'>>();

  const todos = useAppSelector(state => state.todoState.todos);
  const theme = useAppSelector(state => state.todoState.theme);
  const dispatch = useAppDispatch();

  const styles = useMemo(() => styling(theme), [theme]);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<InputsEdit>({
    defaultValues: {
      title: route.params?.todo.title ?? '',
      content: route.params?.todo.content ?? '',
      deadline: route.params?.todo.deadline
        ? new Date(route.params!.todo.deadline)
        : new Date(new Date().getTime() + 6 * 60000),
    },
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params?.todo ? 'Edit ToDo' : 'Add ToDo',
      headerRight: () => (
        <TextBtn
          onPress={route.params?.todo ? handlerEditToDo() : handlerSaveToDo()}
          styleText={styles.textColor}>
          {route.params?.todo ? 'EDIT' : 'SAVE'}
        </TextBtn>
      ),
    });
  }, [navigation, route]);

  // Handle save new todo
  const handlerSaveToDo = useCallback(
    () =>
      handleSubmit(async data => {
        const todo: ToDo = {
          id: new Date().getTime().toString(),
          title: data.title,
          content: data.content,
          isDone: false,
          deadline: data.deadline?.toString() ?? new Date().toString(),
        };

        if (await save('@todos', [todo, ...todos])) {
          dispatch(addNewTodo(todo));
          if (
            new Date().getTime() <
            new Date(todo.deadline).getTime() - 5 * 60000
          ) {
            await createTriggerNotification(todo);
          }
          navigation.pop();
        }
      }),
    [navigation],
  );

  // Handler edit todo
  const handlerEditToDo = useCallback(
    () =>
      handleSubmit(async data => {
        let id = route.params!.todo.id;
        let isDone = route.params!.todo.isDone;
        let todo = {
          id: id,
          title: data.title,
          content: data.content,
          isDone: isDone,
          deadline: data.deadline!.toString(),
        };
        let newTodos = todos.map(item => {
          if (item.id === id) {
            return todo;
          }
          return item;
        });

        if (await save('@todos', newTodos)) {
          dispatch(updateTodo(newTodos));
          if (
            !isDone &&
            new Date().getTime() < new Date(todo.deadline).getTime() - 5 * 60000
          ) {
            await createTriggerNotification(todo);
          } else {
            await cancleNotifee(todo.id);
          }

          navigation.pop();
        }
      }),
    [navigation, route],
  );

  return (
    <KeyboardAvoidingView
      style={MyStylers.rootContainer}
      keyboardVerticalOffset={Header.height + 47}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[MyStylers.rootContainer, styles.container]}>
        <View style={styles.inputContainer}>
          <EditInput
            controllerProps={{
              name: 'title',
              rules: {required: true, minLength: 1},
              control,
            }}
            label="Title"
            placeholder="Input todo's title"
            isValid={errors.title ? false : true}
            mesInvalid="Please input todo's title"
            placehoderColor={
              Colors[theme === 'dark' ? 'dark' : 'light'].colors.placeholder
            }
            styleText={styles.textColor}
          />
          <EditInput
            controllerProps={{
              name: 'content',
              rules: {required: true, minLength: 1},
              control,
            }}
            style={styles.inputContent}
            label="Content"
            placeholder="Input todo's content"
            isValid={errors.content ? false : true}
            mesInvalid="Please input todo's content"
            placehoderColor={
              Colors[theme === 'dark' ? 'dark' : 'light'].colors.placeholder
            }
            styleText={styles.textColor}
          />
          <DeadlineSession
            control={control}
            style={styles.deadline}
            styleText={styles.textColor}
          />
        </View>
        {route.params?.todo && <TextBtn>Delete</TextBtn>}
      </View>
    </KeyboardAvoidingView>
  );
}

const styling = (theme: ColorSchemeName) =>
  StyleSheet.create({
    container: {
      padding: MyDimension.pandingSmall,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    inputContainer: {
      width: '100%',
    },
    textColor: {
      color: Colors[theme === 'light' ? 'light' : 'dark'].colors.onBackground,
    },
    inputContent: {
      marginTop: MyDimension.pandingMedium,
    },
    deadline: {
      marginTop: MyDimension.pandingLarge,
    },
  });
