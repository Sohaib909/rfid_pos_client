import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import storeReducer from '../slices/storeSlice';
import employeeReducer from '../slices/employeeSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    store: storeReducer,
    employee: employeeReducer
  },
});

export default store;
