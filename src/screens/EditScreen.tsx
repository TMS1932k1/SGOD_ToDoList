import {View, StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {MyDimension, MyStylers} from '../constants';
import {RootNavigatorParams} from '../navigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {EditInput, TextBtn} from '../components';
import {regexEditInput} from '../utils';
import {ToDo} from '../types';
import {useAppDispatch, useAppSelector} from '../store/store';
import {addNewTodo, updateTodo} from '../store/homeSlice';
import {storageSetToDoList} from '../utils/asyncStorageHepler';

interface Props {
  navigation: NativeStackNavigationProp<RootNavigatorParams, 'EditScreen'>;
  route: RouteProp<RootNavigatorParams, 'EditScreen'>;
}

export default function EditScreen({navigation, route}: Props) {
  const todos = useAppSelector(state => state.todoState.todos);
  const dispatch = useAppDispatch();

  const [titleText, setTitleText] = useState({value: '', isValid: false});
  const [contentText, setContentText] = useState({value: '', isValid: false});

  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params.todo ? 'Edit ToDo' : 'Add ToDo',
      headerRight: () => (
        <TextBtn
          onPress={
            route.params.todo
              ? () => handlerEditToDo(route.params.todo!.id)
              : handlerSaveToDo
          }>
          {route.params.todo ? 'EDIT' : 'SAVE'}
        </TextBtn>
      ),
    });
  }, [navigation, route, titleText, contentText]);

  useEffect(() => {
    if (route.params.todo) {
      let title = route.params.todo.title!;
      let content = route.params.todo.content!;
      setTitleText({value: title, isValid: regexEditInput(title)});
      setContentText({value: content, isValid: regexEditInput(content)});
    }
  }, [route]);

  // Handle save new todo
  const handlerSaveToDo = useCallback(async () => {
    if (titleText.isValid && contentText.isValid) {
      const todo: ToDo = {
        id: new Date().getTime().toString(),
        title: titleText.value,
        content: contentText.value,
        isDone: false,
      };

      if (await storageSetToDoList([todo, ...todos])) {
        dispatch(addNewTodo(todo));
        navigation.pop();
      }
    }
  }, [titleText, contentText, navigation]);

  // Handler edit todo
  const handlerEditToDo = useCallback(
    async (id: string) => {
      if (titleText.isValid && contentText.isValid) {
        let newTodo = todos.map(item => {
          if (item.id === id) {
            return {
              id: item.id,
              title: titleText.value,
              content: contentText.value,
              isDone: item.isDone,
            };
          }
          return item;
        });

        if (await storageSetToDoList(newTodo)) {
          dispatch(updateTodo(newTodo));
          navigation.pop();
        }
      }
    },
    [titleText, contentText, navigation],
  );

  // Set new title value
  const onChangeTitle = useCallback((value: string) => {
    setTitleText({
      value: value,
      isValid: regexEditInput(value),
    });
  }, []);

  // Set new content value
  const onChangeContent = useCallback((value: string) => {
    setContentText({
      value: value,
      isValid: regexEditInput(value),
    });
  }, []);

  return (
    <View style={[MyStylers.rootContainer, styles.container]}>
      <EditInput
        value={titleText.value}
        label="Title"
        placeholder="Input todo's title"
        isValid={titleText.isValid}
        onChangeText={onChangeTitle}
        mesInvalid="Please input todo's title"
      />
      <EditInput
        value={contentText.value}
        style={styles.inputContent}
        label="Content"
        placeholder="Input todo's content"
        isValid={contentText.isValid}
        onChangeText={onChangeContent}
        mesInvalid="Please input todo's content"
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
