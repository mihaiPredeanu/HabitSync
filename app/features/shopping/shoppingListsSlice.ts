import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShoppingList } from '../../types';
import {
  fetchShoppingLists,
  addShoppingListToDB,
  updateShoppingListInDB,
  deleteShoppingListFromDB,
} from './shoppingListsThunks';

interface ShoppingListsState {
  lists: ShoppingList[];
}

const initialState: ShoppingListsState = {
  lists: [],
};

const shoppingListsSlice = createSlice({
  name: 'shoppingLists',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchShoppingLists.fulfilled, (state, action: PayloadAction<ShoppingList[]>) => {
        state.lists = action.payload;
      })
      .addCase(addShoppingListToDB.fulfilled, (state, action) => {
        if (action.payload) {
          state.lists.push(action.payload);
        }
      })
      .addCase(updateShoppingListInDB.fulfilled, (state, action) => {
        if (action.payload) {
          const idx = state.lists.findIndex(l => l.id === action.payload.id);
          if (idx !== -1) state.lists[idx] = action.payload;
        }
      })
      .addCase(deleteShoppingListFromDB.fulfilled, (state, action) => {
        if (action.payload) {
          state.lists = state.lists.filter(l => l.id !== action.payload);
        }
      });
  },
});

export default shoppingListsSlice.reducer;
