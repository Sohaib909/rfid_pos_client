import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from './authSlice';
import { createStore } from '../store/storeSlice';
import { Container, TextField, Button, Typography, Grid, Paper } from '@mui/material';
import { Redirect } from 'react-router-dom';
import './style/Signup.css'; // Import the CSS file

const Signup = () => {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.auth);

  const handleNext = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      handleNext(e);
    } else {
      dispatch(signup({ firstName, lastName, email, password })).then((result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          dispatch(createStore({ name: storeName }));
        }
      });
    }
  };

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <Grid container className="signup-root">
      <Grid item className="signup-image" xs={false} sm={4} md={7} />
      <Grid item xs={12} sm={8} md={5} className="signup-form-container">
        <Paper className="signup-paper">
          <Typography component="h1" variant="h5" className="signup-title">
            Welcome 👋
          </Typography>
          <Typography component="h2" variant="h6" className="signup-subtitle">
            {step === 1 ? 'Owner Information' : 'Tell us about your Store'}
          </Typography>
          <form className="signup-form" noValidate onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      name="firstName"
                      autoComplete="fname"
                      autoFocus
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="signup-input"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      autoComplete="lname"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="signup-input"
                    />
                  </Grid>
                </Grid>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="signup-input"
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="signup-input"
                />
              </>
            )}
            {step === 2 && (
              <>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="storeName"
                  label="Store Name"
                  name="storeName"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="signup-input"
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="subdomain"
                  label="Claim Your Own Custom store.pos.com Site"
                  name="subdomain"
                  value={`${storeName.toLowerCase().replace(/\s+/g, '')}.pos.com`}
                  disabled
                  className="signup-input"
                />
              </>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="signup-button"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Loading...' : step === 1 ? 'Next' : 'Create Store'}
            </Button>
            {error && <Typography color="error">{error}</Typography>}
          </form>
          <div className="signup-step-indicator">
            <div className={step === 1 ? 'active' : ''}></div>
            <div className={step === 2 ? 'active' : ''}></div>
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Signup;
