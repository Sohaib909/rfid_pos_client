import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getStoreConfig } from '../utils/subdomain';
import axiosInstance from '../utils/axiosInstance';

export const transferWarehouseToStore = createAsyncThunk(
  'productTransfer/warehouseToStore',
  async ({ productId, toStoreId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/product-transfer/warehouse-to-store', {
        productId,
        toStoreId,
        quantity
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to transfer product');
    }
  }
);

export const transferStoreToStore = createAsyncThunk(
  'productTransfer/storeToStore',
  async ({ productId, fromStoreId, toStoreId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/product-transfer/store-to-store', {
        productId,
        fromStoreId,
        toStoreId,
        quantity
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to transfer product');
    }
  }
);

export const fetchWarehouseInventory = createAsyncThunk(
  'productTransfer/fetchWarehouseInventory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/product-transfer/warehouse-inventory');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch warehouse inventory');
    }
  }
);

export const fetchTransferHistory = createAsyncThunk(
  'productTransfer/fetchTransferHistory',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/product-transfer/transfer-history/${productId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch transfer history');
    }
  }
);

const productTransferSlice = createSlice({
  name: 'productTransfer',
  initialState: {
    warehouseInventory: [],
    transferHistory: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    clearTransferHistory: (state) => {
      state.transferHistory = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWarehouseInventory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWarehouseInventory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.warehouseInventory = action.payload;
      })
      .addCase(fetchWarehouseInventory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchTransferHistory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTransferHistory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.transferHistory = action.payload;
      })
      .addCase(fetchTransferHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(transferWarehouseToStore.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(transferWarehouseToStore.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(transferWarehouseToStore.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(transferStoreToStore.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(transferStoreToStore.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(transferStoreToStore.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearTransferHistory } = productTransferSlice.actions;
export default productTransferSlice.reducer; 