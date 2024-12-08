import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getStoreConfig } from '../utils/subdomain';
import axiosInstance from '../utils/axiosInstance';

export const createTemplate = createAsyncThunk('report/template', async (templateData) => {
  const config = getStoreConfig();
  const response = await axiosInstance.post('/report/template', templateData, config);
  return response.data;
});

export const fetchTemplates = createAsyncThunk('report/fetchTemplates', async (id) => {
  const config = getStoreConfig();
  const response = await axiosInstance.get(`/report/templates`, config);
  return response.data;
});

export const downloadReport = createAsyncThunk('report/download', async (reportData) => {
  const config = getStoreConfig();
  const response = await axiosInstance.get(`report/${reportData.reportType}/${reportData.format}`, { ...reportData, ...config });
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
