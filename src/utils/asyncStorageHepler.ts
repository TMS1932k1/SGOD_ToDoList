import AsyncStorage from '@react-native-async-storage/async-storage';
import {ToDo} from '../types';

export const storageSetToDoList = async (todos: ToDo[]): Promise<boolean> => {
  try {
    const jsonValue = JSON.stringify(todos);
    await AsyncStorage.setItem('@todos', jsonValue);
    return true;
  } catch (e) {
    console.log(e);
  }
  return false;
};

export const storageReadTodoList = async (): Promise<ToDo[] | undefined> => {
  try {
    const jsonValue = await AsyncStorage.getItem('@todos');
    return jsonValue != null ? JSON.parse(jsonValue) : undefined;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};
