import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSubdomainConfig } from '../utils/subdomain';
import axiosInstance from '../utils/axiosInstance';

export const createSale = createAsyncThunk('sale/createSale', async (saleData) => {
  const config = getSubdomainConfig();
  const response = await axiosInstance.post('/sale', saleData, config);
  return response.data;
});

const saleSlice = createSlice({
  name: 'sale',
  initialState: {
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createSale.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createSale.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(createSale.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default saleSlice.reducer;
