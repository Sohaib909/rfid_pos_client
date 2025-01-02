import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
import { setStore } from './storeSlice';
import { getStoreConfig } from '../utils/subdomain';

export const signup = createAsyncThunk('auth/signup', async (data) => {
  const response = await axiosInstance.post('/auth/signup', data);
  return response.data;
});

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const config = getStoreConfig(credentials.storeId);
      const response = await axiosInstance.post('/auth/login', credentials, config);
      const user = response.data;

      dispatch(setStore(user.store));

      return user;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue('An unexpected error occurred');
      }
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  const response = await axiosInstance.post('/auth/logout');
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
        window.location.pathname = "login"
        // state.user = action.payload;
        // localStorage.setItem('user', JSON.stringify(action.payload));
        
        // Redirect to the user's subdomain after signup
        // const subdomain = action.payload.stores && action.payload.stores.length > 0
        //   ? action.payload.subdomain
        //   : null;
        
        // if (subdomain) {
        //   window.location.href = `http://${subdomain}.visusctrl.com/`; // Replace example.com with your main domain
        // }
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
        state.error = action.payload;
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
