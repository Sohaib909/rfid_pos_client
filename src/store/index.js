import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import storeReducer from '../features/store/storeSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    store: storeReducer,
  },
});

export default store;
