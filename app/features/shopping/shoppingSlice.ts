import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShoppingItem } from '../../types';

interface ShoppingState {
  items: ShoppingItem[];
}

const initialState: ShoppingState = {
  items: [],
};

const shoppingSlice = createSlice({
  name: 'shopping',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<ShoppingItem>) {
      state.items.push(action.payload);
    },
    updateItem(state, action: PayloadAction<ShoppingItem>) {
      const idx = state.items.findIndex(i => i.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    deleteItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    toggleChecked(state, action: PayloadAction<string>) {
      const item = state.items.find(i => i.id === action.payload);
      if (item) item.checked = !item.checked;
    },
  },
});

export const { addItem, updateItem, deleteItem, toggleChecked } = shoppingSlice.actions;
export default shoppingSlice.reducer;
