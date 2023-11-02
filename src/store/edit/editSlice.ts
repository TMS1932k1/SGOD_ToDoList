import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {ToDo} from '../../types';

interface EditState {
  isLoading: boolean;
}

const initialState: EditState = {isLoading: false};

export const saveToDo = createAsyncThunk('edit/save', async (todo: ToDo) => {});

const editSlice = createSlice({
  name: 'edit',
  initialState: initialState,
  reducers: {},
});

export const {} = editSlice.actions;
export default editSlice.reducer;
