import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { setCurrentStore, fetchStores, createStore } from '../../slices/storeSlice';

const StoreDashboard = () => {
  const dispatch = useDispatch();
  const stores = useSelector((state) => state.store.stores);
  const currentStore = useSelector((state) => state.store.currentStore);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', subdomain: '', type: 'retail' });
  const [showAll, setShowAll] = useState(null);

  useEffect(() => {
    if ((!currentStore || !currentStore._id) && stores && stores.length === 1 && !showAll) {
      dispatch(setCurrentStore(stores[0]));
    }
  }, [stores, currentStore, dispatch, showAll]);

  const handleSelectStore = (store) => {
    dispatch(setCurrentStore(store));
    setShowAll(null);
  };

  const handleShowAllStores = async () => {
    await dispatch(fetchStores());
    setShowAll('stores');
  };
  const handleShowAllWarehouses = async () => {
    await dispatch(fetchStores());
    setShowAll('warehouses');
  };
  const handleBack = () => setShowAll(null);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    const result = await dispatch(createStore(form));
    await dispatch(fetchStores());
    setForm({ name: '', subdomain: '', type: 'retail' });
    setModalOpen(false);
    setShowAll(null);
    if (result.meta && result.meta.requestStatus === 'fulfilled' && result.payload) {
      dispatch(setCurrentStore(result.payload));
    }
  };

  return (
    <Container>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h4">
          {showAll ? (showAll === 'stores' ? 'All Retail Stores' : 'All Warehouses') : currentStore ? `${currentStore.type === 'warehouse' ? 'Warehouse' : 'Store'} Dashboard - ${currentStore.name}` : 'Stores'}
        </Typography>
        {currentStore && !showAll && (
          <Button variant="outlined" color="inherit" onClick={() => setShowAll(null)}>Back</Button>
        )}
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center" gap={2} my={2}>
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Add Store
        </Button>
        <Button variant="outlined" color="primary" onClick={handleShowAllStores}>
          All Stores
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleShowAllWarehouses}>
          All Warehouses
        </Button>
        {currentStore && !showAll && (
          <Button variant="outlined" color="inherit" onClick={() => setShowAll('stores')}>
            Switch Store
          </Button>
        )}
        {currentStore && (
          <Typography variant="subtitle1" color="secondary">
            Current Store: {currentStore.name} ({currentStore.type === 'warehouse' ? 'Warehouse' : 'Retail'})
          </Typography>
        )}
      </Box>
      {showAll === 'stores' && (
        <Box mb={2}>
          <Button onClick={handleBack} size="small">Back</Button>
          <Typography variant="h6">All Retail Stores</Typography>
          {stores.filter(s => s.type === 'retail').length === 0 && <Typography>No retail stores found.</Typography>}
          {stores.filter(s => s.type === 'retail').map(store => (
            <Box key={store._id} display="flex" alignItems="center" gap={2}>
              <Button
                variant={currentStore && currentStore._id === store._id ? 'contained' : 'outlined'}
                color="primary"
                onClick={() => handleSelectStore(store)}
              >
                {store.name}
              </Button>
              <Typography variant="body2" color="textSecondary">
                {store.subdomain}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
      {showAll === 'warehouses' && (
        <Box mb={2}>
          <Button onClick={handleBack} size="small">Back</Button>
          <Typography variant="h6">All Warehouses</Typography>
          {stores.filter(s => s.type === 'warehouse').length === 0 && <Typography>No warehouses found.</Typography>}
          {stores.filter(s => s.type === 'warehouse').map(store => (
            <Box key={store._id} display="flex" alignItems="center" gap={2}>
              <Button
                variant={currentStore && currentStore._id === store._id ? 'contained' : 'outlined'}
                color="secondary"
                onClick={() => handleSelectStore(store)}
              >
                {store.name} (Warehouse)
              </Button>
              <Typography variant="body2" color="textSecondary">
                {store.subdomain}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
      <Box display="flex" flexDirection="column" gap={2}>
        {!showAll && stores.map((store) => (
          <Box key={store._id} display="flex" alignItems="center" gap={2}>
            <Button
              variant={currentStore && currentStore._id === store._id ? 'contained' : 'outlined'}
              color={store.type === 'warehouse' ? 'secondary' : 'primary'}
              onClick={() => handleSelectStore(store)}
            >
              {store.name} {store.type === 'warehouse' && '(Warehouse)'}
            </Button>
            <Typography variant="body2" color="textSecondary">
              {store.subdomain}
            </Typography>
          </Box>
        ))}
      </Box>
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 24, minWidth: 300 }}>
          <Typography variant="h6" mb={2}>Add New Store</Typography>
          <form onSubmit={handleCreateStore}>
            <TextField
              label="Store Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Subdomain"
              name="subdomain"
              value={form.subdomain}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              select
              label="Type"
              name="type"
              value={form.type}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              <MenuItem value="retail">Retail</MenuItem>
              <MenuItem value="warehouse">Warehouse</MenuItem>
            </TextField>
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button onClick={handleCloseModal} color="secondary" sx={{ mr: 1 }}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">Create</Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Container>
  );
};

export default StoreDashboard;
