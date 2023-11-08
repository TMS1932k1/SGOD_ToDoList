import {
  View,
  ViewStyle,
  StyleProp,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, {useCallback} from 'react';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {ToDo} from '../../types';
import {
  cancleNotifee,
  createTriggerNotification,
  storageSetToDoList,
} from '../../utils';
import {readTodos, updateTodo} from '../../store/homeSlice';
import TodoItem from './TodoItem';

interface Props {
  style?: StyleProp<ViewStyle>;
  onPressItem?: (item: ToDo) => void;
}

export default function TodoList({style, onPressItem}: Props) {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(state => state.todoState.todos);
  const fileredTodos = useAppSelector(state => state.todoState.filtedTodos);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      // Read again todolist
      dispatch(readTodos());
      setRefreshing(false);
    }, 2000);
  }, []);

  const delTodo = async (id: string) => {
    let newTodo = todos.filter(item => {
      if (item.id !== id) return item;
    });

    if (await storageSetToDoList(newTodo)) {
      dispatch(updateTodo(newTodo));
      await cancleNotifee(id);
    }
  };

  const doneTodo = async (isDone: boolean, id: string) => {
    let newTodo = todos.map(item => {
      if (item.id === id) {
        return {
          id: item.id,
          title: item.title,
          content: item.content,
          isDone: isDone,
          deadline: item.deadline,
        };
      }
      return item;
    });

    if (await storageSetToDoList(newTodo)) {
      dispatch(updateTodo(newTodo));
      let index = newTodo.findIndex(item => item.id === id);
      if (
        !isDone &&
        new Date().getTime() <
          new Date(newTodo[index].deadline).getTime() - 5 * 60000
      ) {
        await createTriggerNotification(newTodo[index]);
      } else {
        await cancleNotifee(id);
      }
    }
  };

  const renderItem = useCallback(
    (item: ToDo) => (
      <TodoItem
        todo={item}
        onPress={() => {
          if (onPressItem) onPressItem(item);
        }}
        onDelete={delTodo}
        onDone={doneTodo}
      />
    ),
    [delTodo, doneTodo],
  );

  return (
    <View style={[style]}>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyExtractor={item => item.id}
        data={fileredTodos}
        renderItem={({item}) => renderItem(item)}
      />
    </View>
  );
}
