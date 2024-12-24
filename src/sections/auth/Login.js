import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../slices/authSlice';
import { Navigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

const Login = () => {
  const [storeId, setStoreId] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [ownerLogin, setOwnerLogin] = useState('');
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({storeId, userName, password, isOwner: ownerLogin}));
  };

  const handleToggleLogin = (e) => {
    e.preventDefault();
    setOwnerLogin(!ownerLogin)
  };

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <Container maxWidth="xs">
      <form onSubmit={handleSubmit}>
        <Typography variant="h4">Login</Typography>
        {ownerLogin ? (<TextField
          label="Email"
          type="email"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          fullWidth
          margin="normal"
          fullWidth
          margin="normal"
        />): 
        (<div><TextField
          label="Store ID"
          type="text"
          value={storeId}
          onChange={(e) => setStoreId(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Employee ID"
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          fullWidth
          margin="normal"
        /></div>)
      }
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth disabled={status === 'loading'}>
          {status === 'loading' ? <CircularProgress size={24} /> : 'Login'}
        </Button>
        {error && <Typography color="error">{error}</Typography>}
      </form>

      <Button onClick={handleToggleLogin}>{ownerLogin ? "Sign in as Employee" : "Sign in as Owner"}</Button>
    </Container>
  );
};

export default Login;
