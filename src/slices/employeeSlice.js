import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSubdomainConfig } from '../utils/subdomain';
import axiosInstance from '../utils/axiosInstance';

export const createEmployee = createAsyncThunk('employee/addEmployee', async (employeeData) => {
  const config = getSubdomainConfig();
  const formData = new FormData();
  for (const key in employeeData) {
    formData.append(key, employeeData[key]);
  }
  const response = await axiosInstance.post('/employee', formData, config);
  return response.data;
});

export const fetchEmployees = createAsyncThunk('employee/fetchEmployees', async () => {
  const config = getSubdomainConfig();
  const response = await axiosInstance.get('/employee', config);
  return response.data;
});

export const deleteEmployee = createAsyncThunk('employee/deleteEmployee', async (id) => {
  const config = getSubdomainConfig();
  const response = await axiosInstance.delete(`/employee/${id}`, config);
  return response.data;
});

export const fetchEmployee = createAsyncThunk('employee/fetchEmployee', async (id) => {
  const config = getSubdomainConfig();
  const response = await axiosInstance.get(`/employee/${id}`, config);
  return response.data;
});

export const updateEmployee = createAsyncThunk('employee/updateEmployee', async (employeeData) => {
  const config = getSubdomainConfig();
  const response = await axiosInstance.put(`/employee/${employeeData.id}`, employeeData.formData, config);
  return response.data;
});

const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    employees: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createEmployee.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employees.push(action.payload);
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchEmployees.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteEmployee.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employees = action.payload;
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchEmployee.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEmployee.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(fetchEmployee.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateEmployee.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default employeeSlice.reducer;
