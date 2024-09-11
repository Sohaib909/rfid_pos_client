import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSubdomainConfig } from '../utils/subdomain';
import axios from 'axios';

// Thunk to create a new product
export const createProduct = createAsyncThunk('product/createProduct', async (productData) => {
  const config = getSubdomainConfig();
  const response = await axios.post('/product', productData, config);
  return response.data;
});

export const fetchProducts = createAsyncThunk('product/fetchProducts', async () => {
  const config = getSubdomainConfig();
  const response = await axios.get('/product', config);
  return response.data;
});

export const deleteProduct = createAsyncThunk('product/deleteProduct', async (id) => {
  const config = getSubdomainConfig();
  const response = await axios.delete(`/product/${id}`, config);
  return response.data;
});

export const fetchProduct = createAsyncThunk('product/fetchProduct', async (id) => {
  const config = getSubdomainConfig();
  const response = await axios.get(`/product/${id}`, config);
  return response.data;
});

export const updateProduct = createAsyncThunk('product/updateProduct', async (productData) => {
  const config = getSubdomainConfig();
  const response = await axios.put(`/product/${productData.id}`, productData.formData, config);
  return response.data;
});

export const searchProducts = createAsyncThunk('product/searchProducts', async (val) => {
  const config = getSubdomainConfig();
  const response = await axios.get('/product/products_data', { params: { searchTerm: val }, ...config })
  return response.data;
});

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(searchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.status = 'failed';
      });
  },
});

export default productSlice.reducer;
