import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createEmployee = createAsyncThunk('employee/addEmployee', async (employeeData) => {
  const formData = new FormData();
  for (const key in employeeData) {
    formData.append(key, employeeData[key]);
  }
  const response = await axios.post('/employee', formData);
  return response.data;
});

export const fetchEmployees = createAsyncThunk('employee/fetchEmployees', async () => {
  const response = await axios.get('/employee');
  return response.data;
});

export const deleteEmployee = createAsyncThunk('employee/deleteEmployee', async (id) => {
  const response = await axios.delete(`/employee/${id}`);
  return response.data;
});

export const fetchEmployee = createAsyncThunk('employee/fetchEmployee', async (id) => {
  const response = await axios.get(`/employee/${id}`);
  return response.data;
});

export const updateEmployee = createAsyncThunk('employee/updateEmployee', async (employeeData) => {
  const response = await axios.put(`/employee/${employeeData.id}`, employeeData.formData);
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
