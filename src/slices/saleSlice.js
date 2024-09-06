import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProductsDataForSales = createAsyncThunk('sale/fetchProductsDataForSales', async (val) => {
  const response = await axios.get(`/sale/products_data`, { params: { searchTerm: val } })
  return response.data;
});

export const createSale = createAsyncThunk('sale/createSale', async (saleData) => {
  const response = await axios.post('/sale', saleData);
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
      .addCase(fetchProductsDataForSales.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductsDataForSales.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(fetchProductsDataForSales.rejected, (state, action) => {
        state.status = 'failed';
      })
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
