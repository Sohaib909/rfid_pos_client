import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstance';
import { setCurrentStore } from './storeSlice';
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

      if (user.stores && user.stores.length > 0) {
        dispatch(setCurrentStore(user.stores[0]));
      }

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

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  } catch (error) {
    // Even if the server request fails, we should still clear local storage
    console.warn('Logout request failed, but clearing local session:', error);
    return {};
  }
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
        // Save stores array for fallback in getStoreConfig
        if (action.payload && action.payload.stores) {
          localStorage.setItem('stores', JSON.stringify(action.payload.stores));
        }
        localStorage.setItem('user', JSON.stringify(action.payload));
        console.log("action.payload === =", action.payload);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = null;
        localStorage.removeItem('user');
        localStorage.removeItem('stores');
        // Redirect to login page
        window.location.href = '/login';
      })
      .addCase(logout.rejected, (state, action) => {
        // Even if logout fails on server, clear local session
        state.status = 'succeeded';
        state.user = null;
        localStorage.removeItem('user');
        localStorage.removeItem('stores');
        // Redirect to login page
        window.location.href = '/login';
      });
  },
});

// export const { logout } = authSlice.actions;
export default authSlice.reducer;
