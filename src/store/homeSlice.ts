import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Filter, ToDo} from '../types';
import {storageReadTodoList} from '../utils/asyncStorageHepler';
import {FulfilledAction, PendingAction, RejectedAction} from './store';

interface HomeState {
  todos: ToDo[];
  filtedTodos: ToDo[];
  searchText?: string;
  filter?: Filter;
  isLoading: boolean;
}

const initialState: HomeState = {todos: [], filtedTodos: [], isLoading: false};

export const readTodos = createAsyncThunk('todos', async () =>
  storageReadTodoList(),
);

const todosSlice = createSlice({
  name: 'edit',
  initialState: initialState,
  reducers: {
    addNewTodo: (state, action: PayloadAction<ToDo>) => {
      state.todos = [action.payload, ...state.todos];
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(item => {
        return item.id !== action.payload;
      });
    },
    updateTodo: (state, action: PayloadAction<ToDo[]>) => {
      state.todos = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(readTodos.fulfilled, (state, action) => {
        if (action.payload) {
          state.todos = action.payload;
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

export const {addNewTodo, removeTodo, updateTodo} = todosSlice.actions;
export default todosSlice.reducer;
