import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setStores } from './storeSlice';

export const signup = createAsyncThunk('auth/signup', async (data) => {
  const response = await axios.post('/auth/signup', data);
  return response.data;
});

export const login = createAsyncThunk('auth/login', async (credentials, { dispatch }) => {
  const response = await axios.post('/auth/login', credentials);
  const user = response.data;
  dispatch(setStores(user.stores));  // Dispatch the setStores action
  return user;
});

export const logout = createAsyncThunk('auth/logout', async () => {
  const response = await axios.post('/auth/logout');
  // const user = response.data;
  // dispatch(setStores(user.stores));  // Dispatch the setStores action
  return {};
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    status: 'idle',
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = null;
        localStorage.removeItem('user');
      });
  },
});

// export const { logout } = authSlice.actions;
export default authSlice.reducer;
