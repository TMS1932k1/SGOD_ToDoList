import AsyncStorage from '@react-native-async-storage/async-storage';
import {ToDo} from '../types';

export const storageSetToDo = async (
  todo: ToDo,
  onSuccess?: () => void,
  onError?: () => void,
) => {
  try {
    const jsonValue = JSON.stringify(todo);
    await AsyncStorage.setItem('@todos', jsonValue);
    onSuccess && onSuccess();
  } catch (e) {
    console.log(e);
    onError && onError();
  }
};

export const readTodoList = async (): Promise<ToDo[] | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem('@todos');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log(e);
    return null;
  }
};
