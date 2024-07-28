import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import Iconify from '../../components/iconify';
import './style/SalesDashboard.css';
import { fetchProductsDataForSales, createSale } from '../../slices/saleSlice';

const SalesDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const products = useSelector((state) => state.sale.productsData);
  const status = useSelector((state) => state.sale.status);
  const error = useSelector((state) => state.sale.error);
  const [formData, setFormData] = useState({
    customerName: '',
    customerContact: '',
    totalAmount: '',
    items: []
  });
  const [addItemModal, setAddItemModal] = useState(false);
  const [proceedSaleModal, setProceedSaleModal] = useState(false);
  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [errorText, setErrorText] = useState('');
  const [taxAmount, setTaxAmount] = useState(0);

  useEffect(() => {
    dispatch(fetchProductsDataForSales());
  }, [dispatch]);

  useEffect(() => {
    const subTotal = subTotalAmount();
    const amountIncTax = subTotal * 0.16;
    const totalAmount = subTotal + amountIncTax;
    setTaxAmount(amountIncTax);
    setFormData({
      ...formData,
      totalAmount: totalAmount
    });
  }, [formData.items]);

  const openAddItemModal = () => {
    setAddItemModal(true);
  };

  const closeAddItemModal = () => {
    setAddItemModal(false);
    setSku('');
    setQuantity(1);
    setErrorText('');
  };

  const addItemToCart = () => {
    const product = products.find((p) => p.sku === sku);
    if (!sku) {
      setErrorText('Please enter valid product SKU number.');
      return;
    }
    if (!product) {
      setErrorText('Product with given SKU not found.');
      return;
    }

    if (quantity < 1) {
      setErrorText('Quantity should be greater than 1');
      return;
    }

    const existingItem = formData.items.find((item) => item.sku === sku);
    if (existingItem) {
      setFormData({
        ...formData,
        items: formData.items.map((item) => item.sku === sku ? { ...item, quantity: item.quantity + quantity } : item)
      });
    } else {
      setFormData({
        ...formData,
        items: [...formData.items, { ...product, quantity }]
      });
    }

    closeAddItemModal();
    console.log('Items after adding:', formData.items);
  };

  const handleQuantityChange = (sku, delta) => {
    setFormData({
      ...formData,
      items: formData.items.map(item =>
        item.sku === sku ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      )
    });
    console.log('Items after quantity change:', formData);
  };

  const subTotalAmount = () => {
    return formData.items.reduce((total, item) => total + item.quantity * item.price, 0);
  };

  const openProceedSaleModal = () => {
    setProceedSaleModal(true);
    setFormData({
      ...formData,
      customerName: '',
      customerContact: '',
    });
  };

  const closeProceedSaleModal = () => {
    setProceedSaleModal(false);
  }

  const saveSale = () => {
    if(!formData.items.length) {
      setErrorText('Please select products to proceed.');
      return;
    }

    dispatch(createSale(formData));
  }

  const setCustomerInformation = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(formData)
  };

  return (
    <Container className="dashboard-container">
      <Box className="dashboard-header">
        <Typography variant="h4">Hello {user.firstName} {user.lastName} 👋</Typography>
        <Typography variant="subtitle1">Good Morning</Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper className="dashboard-card">
            <Typography variant="h6">Total Sale Amount</Typography>
            <Typography variant="h3">560</Typography>
            <Typography variant="body2">Update: July 16, 2023</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper className="dashboard-card">
            <Typography variant="h6">Total Product</Typography>
            <Typography variant="h3">1050</Typography>
            <Typography variant="body2">Update: July 14, 2023</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper className="dashboard-card">
            <Typography variant="h6">Subtotal</Typography>
            <Typography variant="h3">${subTotalAmount()}</Typography>
            <Typography variant="body2">Discounts: -$8.00</Typography>
            <Typography variant="body2">Tax: ${taxAmount}</Typography>
            <Typography variant="h4" className="total-amount">Total: ${formData.totalAmount}</Typography>
            {formData.items && formData.items.length > 0 ? (
              <Button variant="contained" color="inherit" onClick={openProceedSaleModal}>
                Proceed
              </Button>
            ) : null}
          </Paper>
        </Grid>
      </Grid>
      <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={openAddItemModal}>
        Add Item
      </Button>
      <Dialog open={addItemModal} onClose={closeAddItemModal}>
        <DialogTitle>Add Item</DialogTitle>
        <DialogContent>
          <TextField
            label="SKU"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            fullWidth
            margin="normal"
          />
          {errorText && <Typography color="error">{errorText}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAddItemModal} color="primary">
            Cancel
          </Button>
          <Button onClick={addItemToCart} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={proceedSaleModal} onClose={closeProceedSaleModal}>
        <DialogTitle>Proceed</DialogTitle>
        <DialogContent>
          <TextField
            name="customerName"
            label="Customer Name (optional)"
            value={formData.customerName}
            onChange={setCustomerInformation}
            fullWidth
            margin="normal"
          />
          <TextField
            name="customerContact"
            label="Customer Contact (optional)"
            value={formData.customerContact}
            onChange={setCustomerInformation}
            fullWidth
            margin="normal"
          />
          {errorText && <Typography color="error">{errorText}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeProceedSaleModal} color="primary">
            Cancel
          </Button>
          <Button onClick={saveSale} color="primary">
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
      <TableContainer component={Paper} className="sales-table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.NO</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formData.items ? formData.items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleQuantityChange(item.sku, -1)}><RemoveCircle /></IconButton>
                  {item.quantity}
                  <IconButton onClick={() => handleQuantityChange(item.sku, 1)}><AddCircle /></IconButton>
                </TableCell>
                <TableCell>{item.quantity * item.price}</TableCell>
                <TableCell>
                  <Button variant="contained" color="secondary">Delete</Button>
                </TableCell>
              </TableRow>
            )) : null}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default SalesDashboard;
