import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import store from './store';
import TopNavbar from './components/navbar/TopNavbar';
import SideNavbar from './components/navbar/SideNavbar';

import Router from './routes/sections';

const theme = createTheme();

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router/>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
