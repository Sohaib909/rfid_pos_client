import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const addEmployee = createAsyncThunk('employee/addEmployee', async (employeeData) => {
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
      .addCase(addEmployee.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employees.push(action.payload);
      })
      .addCase(addEmployee.rejected, (state, action) => {
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
      });
  },
});

export default employeeSlice.reducer;
