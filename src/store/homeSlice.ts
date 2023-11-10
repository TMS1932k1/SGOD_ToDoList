import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Filter, ToDo} from '../types';
import {FulfilledAction, PendingAction, RejectedAction} from './store';
import {createPermissionNotification, fcmGetToken, get} from '../utils';
import {ColorSchemeName} from 'react-native';

interface HomeState {
  todos: ToDo[];
  filtedTodos: ToDo[];
  searchText: string;
  filter: Filter;
  token?: string;
  isLoading: boolean;
  theme: ColorSchemeName;
  themeDefault: boolean;
}

const initialState: HomeState = {
  todos: [],
  filtedTodos: [],
  isLoading: false,
  searchText: '',
  filter: Filter.All,
  theme: 'light',
  themeDefault: false,
};

export const getTheme = createAsyncThunk('theme', async () => {
  return {theme: await get('@theme'), isDefault: await get('@isdefault')};
});

export const readTodos = createAsyncThunk('todos', async () => get('@todos'));

export const fetchToken = createAsyncThunk('token', async () => {
  await createPermissionNotification();
  const token = await get('@token');
  if (token) {
    return token;
  } else {
    return await fcmGetToken();
  }
});

const getFiltedTodos = (todos: ToDo[], searchText: string, filter: Filter) => {
  return todos.filter(item => {
    switch (filter) {
      case Filter.DONE:
        return (
          item.title.toLocaleLowerCase().includes(searchText) && item.isDone
        );
      case Filter.TODO:
        return (
          item.title.toLocaleLowerCase().includes(searchText) && !item.isDone
        );
      default:
        return item.title.toLocaleLowerCase().includes(searchText);
    }
  });
};

const todosSlice = createSlice({
  name: 'edit',
  initialState: initialState,
  reducers: {
    addNewTodo: (state, action: PayloadAction<ToDo>) => {
      state.todos = [action.payload, ...state.todos];
      state.filtedTodos = getFiltedTodos(
        state.todos,
        state.searchText,
        state.filter,
      );
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(item => {
        return item.id !== action.payload;
      });
      state.filtedTodos = getFiltedTodos(
        state.todos,
        state.searchText,
        state.filter,
      );
    },
    updateTodo: (state, action: PayloadAction<ToDo[]>) => {
      state.todos = action.payload;
      state.filtedTodos = getFiltedTodos(
        state.todos,
        state.searchText,
        state.filter,
      );
    },
    searchTodo: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload.toLocaleLowerCase();
      state.filtedTodos = getFiltedTodos(
        state.todos,
        state.searchText,
        state.filter,
      );
    },
    filterTodo: (state, action: PayloadAction<Filter>) => {
      state.filter = action.payload;
      state.filtedTodos = getFiltedTodos(
        state.todos,
        state.searchText,
        state.filter,
      );
    },
  },
  extraReducers(builder) {
    builder
      .addCase(readTodos.fulfilled, (state, action) => {
        if (action.payload) {
          state.todos = action.payload;
          state.filtedTodos = getFiltedTodos(
            state.todos,
            state.searchText,
            state.filter,
          );
        }
      })
      .addCase(fetchToken.fulfilled, (state, action) => {
        if (action.payload) {
          state.token = action.payload;
        }
      })
      .addCase(getTheme.fulfilled, (state, action) => {
        if (action.payload) {
          state.theme = action.payload.theme;
          state.themeDefault = action.payload.isDefault;
          console.log(state.theme, state.themeDefault);
        }
      })
      .addMatcher<PendingAction>(
        action => action.type.endsWith('/pending'),
        (state, action) => {
          state.isLoading = true;
        },
      )
      .addMatcher<RejectedAction>(
        action => action.type.endsWith('/rejected'),
        (state, action) => {
          state.isLoading = false;
        },
      )
      .addMatcher<FulfilledAction>(
        action => action.type.endsWith('/fulfilled'),
        (state, action) => {
          state.isLoading = false;
        },
      );
  },
});

export const {addNewTodo, removeTodo, updateTodo, searchTodo, filterTodo} =
  todosSlice.actions;
export default todosSlice.reducer;
