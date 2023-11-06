import {View, StyleSheet} from 'react-native';
import React, {useCallback, useLayoutEffect} from 'react';
import {MyDimension, MyStylers} from '../constants';
import {EditInput, TextBtn} from '../components';
import {InputsEdit, ToDo} from '../types';
import {useAppDispatch, useAppSelector} from '../store/store';
import {addNewTodo, updateTodo} from '../store/homeSlice';
import {storageSetToDoList} from '../utils/asyncStorageHepler';

import {useRoute} from '@react-navigation/native';
import {
  RootStackNavigationScreenProps,
  RootStackRouteScreenProps,
} from '../configs/routes';
import {useForm} from 'react-hook-form';

interface Props {
  navigation: RootStackNavigationScreenProps<'EditScreen'>;
}

export default function EditScreen({navigation}: Props) {
  const route = useRoute<RootStackRouteScreenProps<'EditScreen'>>();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<InputsEdit>({
    defaultValues: {
      title: route.params?.todo.title ?? '',
      content: route.params?.todo.content ?? '',
    },
  });

  const todos = useAppSelector(state => state.todoState.todos);
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params?.todo ? 'Edit ToDo' : 'Add ToDo',
      headerRight: () => (
        <TextBtn
          onPress={route.params?.todo ? handlerEditToDo() : handlerSaveToDo()}>
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
        };

        if (await storageSetToDoList([todo, ...todos])) {
          dispatch(addNewTodo(todo));
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
        let newTodo = todos.map(item => {
          if (item.id === id) {
            return {
              id: item.id,
              title: data.title,
              content: data.content,
              isDone: item.isDone,
            };
          }
          return item;
        });

        if (await storageSetToDoList(newTodo)) {
          dispatch(updateTodo(newTodo));
          navigation.pop();
        }
      }),
    [navigation, route],
  );

  return (
    <View style={[MyStylers.rootContainer, styles.container]}>
      <EditInput
        name="title"
        control={control}
        label="Title"
        placeholder="Input todo's title"
        isValid={errors.title ? false : true}
        mesInvalid="Please input todo's title"
        rules={{required: true, minLength: 1}}
      />
      <EditInput
        name="content"
        control={control}
        style={styles.inputContent}
        label="Content"
        placeholder="Input todo's content"
        isValid={errors.content ? false : true}
        mesInvalid="Please input todo's content"
        rules={{required: true, minLength: 1}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: MyDimension.pandingSmall,
  },
  inputContent: {
    marginTop: MyDimension.pandingMedium,
  },
});
