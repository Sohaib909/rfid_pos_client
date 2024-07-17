import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import store from './store';
import TopNavbar from './components/navbar/TopNavbar';
import SideNavbar from './components/navbar/SideNavbar';

import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './components/store/index.js';
import PrivateRoute from './components/PrivateRoutes';
import AddEmployee from './components/employee/AddEmployee';
import EmployeeList from './components/employee/EmployeeList';

const theme = createTheme();

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

function AppContent() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div style={{ display: 'flex' }}>
      {user && <SideNavbar />}
      <div style={{ flex: 1, marginLeft: user ? '15%' : 0 }}>
      {user && <TopNavbar />}
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <PrivateRoute path="/employees/new" component={AddEmployee} />
        <PrivateRoute path="/employees" component={EmployeeList} />
        <PrivateRoute path="/" component={Dashboard} />
      </Switch>
      </div>
    </div>
  );
}

export default App;
