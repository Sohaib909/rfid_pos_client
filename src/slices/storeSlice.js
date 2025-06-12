import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';

// Async thunk to fetch stores
export const fetchStores = createAsyncThunk('store/fetchStores', async () => {
  const response = await axiosInstance.get('/store');
  return response.data;
});

// Async thunk to create a new store
export const createStore = createAsyncThunk('store/createStore', async (storeData) => {
  const response = await axiosInstance.post('/store', storeData);
  return response.data;
});

export const selectStore = createAsyncThunk('store/selectStore', async (storeId, { getState }) => {
  const { stores } = getState().store;
  return stores.find(store => store._id === storeId);
});

const storeSlice = createSlice({
  name: 'store',
  initialState: { stores: [], currentStore: null, status: 'idle', error: null },
  reducers: {
    setCurrentStore: (state, action) => {
      state.currentStore = action.payload;
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
        if (!state.currentStore && action.payload && action.payload.length === 1) {
          state.currentStore = action.payload[0];
        }
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
      })
      .addCase(selectStore.fulfilled, (state, action) => {
        state.currentStore = action.payload;
      });
  },
});

export const { setCurrentStore } = storeSlice.actions;
export default storeSlice.reducer;
