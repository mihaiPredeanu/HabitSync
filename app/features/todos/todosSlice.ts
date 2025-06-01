import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ToDo } from '../../types';

interface TodosState {
  todos: ToDo[];
}

const initialState: TodosState = {
  todos: [],
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo(state, action: PayloadAction<ToDo>) {
      state.todos.push(action.payload);
    },
    updateTodo(state, action: PayloadAction<ToDo>) {
      const idx = state.todos.findIndex(t => t.id === action.payload.id);
      if (idx !== -1) state.todos[idx] = action.payload;
    },
    deleteTodo(state, action: PayloadAction<string>) {
      state.todos = state.todos.filter(t => t.id !== action.payload);
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.todos.find(t => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
  },
});

export const { addTodo, updateTodo, deleteTodo, toggleTodo } = todosSlice.actions;
export default todosSlice.reducer;
