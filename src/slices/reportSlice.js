import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSubdomainConfig } from '../utils/subdomain';
import axios from 'axios';

export const createTemplate = createAsyncThunk('report/template', async (templateData) => {
  const config = getSubdomainConfig();
  const response = await axios.post('/report/template', templateData, config);
  return response.data;
});

export const fetchTemplates = createAsyncThunk('report/fetchTemplates', async (id) => {
  const config = getSubdomainConfig();
  const response = await axios.get(`/report/templates`, config);
  return response.data;
});

export const downloadReport = createAsyncThunk('report/download', async (reportData) => {
  const config = getSubdomainConfig();
  const response = await axios.get(`report/${reportData.reportType}/${reportData.format}`, { ...reportData, ...config });
  return response.data;
});

const saleSlice = createSlice({
  name: 'report',
  initialState: {
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTemplate.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchTemplates.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.templates = action.payload;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(downloadReport.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(downloadReport.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.payload = action.payload;
      })
      .addCase(downloadReport.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default saleSlice.reducer;
