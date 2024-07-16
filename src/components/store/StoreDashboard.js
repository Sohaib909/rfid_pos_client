import React from 'react';
import { useSelector } from 'react-redux';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const StoreDashboard = () => {
  const stores = useSelector((state) => state.store.stores);

  return (
    <Container>
      <Typography variant="h4">Stores</Typography>
      <h1>Store Dashboard</h1>
      {stores.map((store) => (
        <Typography key={store.id} variant="body1">
          {store.name}
        </Typography>
      ))}
    </Container>
  );
};

export default StoreDashboard;
