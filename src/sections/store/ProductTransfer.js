import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../../utils/axiosInstance';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import { CSVLink } from 'react-csv';

const ProductTransfer = () => {
  const currentStore = useSelector((state) => state.store.currentStore);
  const stores = useSelector((state) => state.store.stores);
  const [products, setProducts] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [form, setForm] = useState({ product: '', toStore: '', quantity: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    if (currentStore) {
      axiosInstance.get(`/product?storeId=${currentStore._id}`)
        .then(res => setProducts(res.data))
        .catch(() => setProducts([]));
      axiosInstance.get('/transfer')
        .then(res => {
          const filtered = res.data.filter(t => t.fromStore._id === currentStore._id);
          setTransfers(filtered);
          setCsvData(filtered.map(t => ({
            Product: products.find(p => p._id === t.product)?.name || 'Product',
            'To Store': stores.find(s => s._id === t.toStore._id)?.name || 'Store',
            Quantity: t.quantity,
            Date: new Date(t.transferDate).toLocaleString()
          })));
        })
        .catch(() => setTransfers([]));
    }
  }, [currentStore, products, stores]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.post('/transfer', {
        fromStore: currentStore._id,
        toStore: form.toStore,
        product: form.product,
        quantity: Number(form.quantity),
      });
      setForm({ product: '', toStore: '', quantity: 1 });
      // Refresh transfers and products
      const [prodRes, transRes] = await Promise.all([
        axiosInstance.get(`/product?storeId=${currentStore._id}`),
        axiosInstance.get('/transfer'),
      ]);
      setProducts(prodRes.data);
      const filtered = transRes.data.filter(t => t.fromStore._id === currentStore._id);
      setTransfers(filtered);
      setCsvData(filtered.map(t => ({
        Product: prodRes.data.find(p => p._id === t.product)?.name || 'Product',
        'To Store': stores.find(s => s._id === t.toStore._id)?.name || 'Store',
        Quantity: t.quantity,
        Date: new Date(t.transferDate).toLocaleString()
      })));
    } catch (err) {
      setError('Transfer failed.');
    }
    setLoading(false);
  };

  return (
    <Container>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Product Transfer - {currentStore?.name}</Typography>
        <Button variant="outlined" color="inherit" onClick={() => window.history.back()}>Back</Button>
      </Box>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" mb={1}>Inventory</Typography>
        <Box display="flex" flexDirection="column" gap={1}>
          {products.length === 0 && <Typography>No products in this store.</Typography>}
          {products.map(product => (
            <Box key={product._id} display="flex" justifyContent="space-between" alignItems="center">
              <Typography>{product.name} (SKU: {product.sku})</Typography>
              <Typography>Qty: {product.quantity}</Typography>
            </Box>
          ))}
        </Box>
      </Paper>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" mb={1}>Transfer Products to Store/Warehouse</Typography>
        <form onSubmit={handleTransfer}>
          <TextField
            select
            label="Product"
            name="product"
            value={form.product || ''}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          >
            {products.map(product => (
              <MenuItem key={product._id} value={product._id}>
                {product.name} (Qty: {product.quantity})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Destination Store/Warehouse"
            name="toStore"
            value={form.toStore || ''}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          >
            {stores.filter(s => s._id !== currentStore._id).map(store => (
              <MenuItem key={store._id} value={store._id}>
                {store.name} ({store.type})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Quantity"
            name="quantity"
            type="number"
            value={form.quantity || ''}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            inputProps={{ min: 1 }}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button type="submit" variant="contained" color="primary" disabled={loading || products.length === 0}>
              {loading ? 'Transferring...' : 'Transfer'}
            </Button>
          </Box>
        </form>
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="subtitle1">Recent Transfers</Typography>
          <CSVLink data={csvData} filename={`store-transfers-${currentStore?.name}.csv`}>
            <Button variant="outlined" color="primary">Export Transfers</Button>
          </CSVLink>
        </Box>
        <Box display="flex" flexDirection="column" gap={1}>
          {transfers.length === 0 && <Typography>No transfers from this store yet.</Typography>}
          {transfers.map(transfer => (
            <Box key={transfer._id} display="flex" justifyContent="space-between" alignItems="center">
              <Typography>
                {products.find(p => p._id === transfer.product)?.name || 'Product'} → {stores.find(s => s._id === transfer.toStore._id)?.name || 'Store'}
              </Typography>
              <Typography>Qty: {transfer.quantity}</Typography>
              <Typography>{new Date(transfer.transferDate).toLocaleString()}</Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default ProductTransfer; 