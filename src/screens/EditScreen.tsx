import {View, StyleSheet} from 'react-native';
import React, {useCallback, useLayoutEffect} from 'react';
import {MyDimension, MyStylers} from '../constants';
import {DeadlineSession, EditInput, TextBtn} from '../components';
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
import {cancleNotifee, createTriggerNotification} from '../utils';

interface Props {
  navigation: RootStackNavigationScreenProps<'EditScreen'>;
}

export default function EditScreen({navigation}: Props) {
  const route = useRoute<RootStackRouteScreenProps<'EditScreen'>>();

  const todos = useAppSelector(state => state.todoState.todos);
  const dispatch = useAppDispatch();

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
          deadline: data.deadline?.toString() ?? new Date().toString(),
        };

        if (await storageSetToDoList([todo, ...todos])) {
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

        if (await storageSetToDoList(newTodos)) {
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
    <View style={[MyStylers.rootContainer, styles.container]}>
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
      />
      <DeadlineSession control={control} style={styles.deadline} />
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
  deadline: {
    marginTop: MyDimension.pandingLarge,
  },
});
