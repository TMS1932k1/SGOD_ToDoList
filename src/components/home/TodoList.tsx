import {View, ViewStyle, StyleProp, FlatList} from 'react-native';
import React from 'react';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {TodoItem} from './TodoItem';
import {ToDo} from '../../types';
import {storageSetToDoList} from '../../utils';
import {updateTodo} from '../../store/homeSlice';

interface Props {
  style?: StyleProp<ViewStyle>;
  onPressItem?: (item: ToDo) => void;
}

export default function TodoList({style, onPressItem}: Props) {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(state => state.todoState.todos);
  const fileredTodos = useAppSelector(state => state.todoState.filtedTodos);

  const delTodo = async (id: string) => {
    let newTodo = todos.filter(item => {
      if (item.id !== id) return item;
    });

    if (await storageSetToDoList(newTodo)) {
      dispatch(updateTodo(newTodo));
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
        };
      }
      return item;
    });

    if (await storageSetToDoList(newTodo)) {
      dispatch(updateTodo(newTodo));
    }
  };

  return (
    <View style={[style]}>
      <FlatList
        keyExtractor={item => item.id}
        data={fileredTodos}
        renderItem={({item}) => (
          <TodoItem
            todo={item}
            onPress={() => {
              if (onPressItem) onPressItem(item);
            }}
            onDelete={delTodo}
            onDone={doneTodo}
          />
        )}
      />
    </View>
  );
}
