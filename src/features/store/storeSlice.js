import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch stores
export const fetchStores = createAsyncThunk('store/fetchStores', async () => {
  const response = await axios.get('/store');
  return response.data;
});

// Async thunk to create a new store
export const createStore = createAsyncThunk('store/createStore', async (storeData) => {
  const response = await axios.post('/store', storeData);
  return response.data;
});

const storeSlice = createSlice({
  name: 'store',
  initialState: { stores: [], status: 'idle', error: null },
  reducers: {
    setStores: (state, action) => {
      state.stores = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStores.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStores.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stores = action.payload;
      })
      .addCase(fetchStores.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createStore.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createStore.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stores.push(action.payload);
      })
      .addCase(createStore.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setStores } = storeSlice.actions;
export default storeSlice.reducer;
