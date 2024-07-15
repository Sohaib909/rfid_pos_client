import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import store from './store';
import Login from './features/auth/Login';
import Signup from './features/auth/Signup';
import StoreDashboard from './features/store/StoreDashboard';
import PrivateRoute from './components/PrivateRoutes';

const theme = createTheme();

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <PrivateRoute path="/" component={StoreDashboard} />
          </Switch>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
