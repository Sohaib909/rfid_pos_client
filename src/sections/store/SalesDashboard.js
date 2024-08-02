import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button, TextField, Autocomplete, Divider } from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import Iconify from '../../components/iconify';
import './style/SalesDashboard.css';
import { fetchProductsDataForSales, createSale } from '../../slices/saleSlice';
import debounce from 'lodash.debounce';
import axios from 'axios';

const SalesDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  // const products = useSelector((state) => state.sale.productsData);
  const status = useSelector((state) => state.sale.status);
  const error = useSelector((state) => state.sale.error);
  const [formData, setFormData] = useState({
    customerName: '',
    customerContact: '',
    totalAmount: 0,
    items: []
  });
  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [errorText, setErrorText] = useState('');
  const [taxAmount, setTaxAmount] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

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


  const resetManualItemAddData = () => {
    setSku('');
    setQuantity(1);
    setErrorText('');
    setSelectedProduct(null);
    setFilteredProducts([])
  };


  const handleProductsSearch = debounce(async (e) => {
    const searchText = e.target.value;
    setSku(searchText);
    if (searchText.length > 0) {
      try {
        const response = await axios.get(`/sale/products_data`, { params: { sku: searchText } })
        console.log(response.data)
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    } else {
      setFilteredProducts([]);
    }
  }, 300);

  const addItemToCart = () => {
    if (!selectedProduct) {
      setErrorText('Please select a product.');
      return;
    }

    if (quantity < 1) {
      setErrorText('Quantity should be greater than 1');
      return;
    }

    const existingItem = formData.items.find((item) => item.sku === selectedProduct.sku);
    if (existingItem) {
      setFormData({
        ...formData,
        items: formData.items.map((item) => item.sku === selectedProduct.sku ? { ...item, quantity: item.quantity + quantity } : item)
      });
    } else {
      setFormData({
        ...formData,
        items: [...formData.items, { ...selectedProduct, quantity }]
      });
    }
    console.log(formData)
    resetManualItemAddData();
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

  const saveSale = () => {
    if(!formData.items.length) {
      setErrorText('Please select products to proceed.');
      return;
    }

    dispatch(createSale(formData)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        setFormData({
          customerName: '',
          customerContact: '',
          totalAmount: 0,
          items: []
        })
      }
    });;
  }

  const setCustomerInformation = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(formData)
  };

  const removeItemFromCart = (sku) => {
    console.log("remove item")
    const filteredItems = formData.items.filter(item => item.sku != sku);
    setFormData({
      ...formData,
      items: filteredItems
    });

  };

  return (
    <Container className="dashboard-container">
      <Box className="dashboard-header">
        <Typography variant="h4">Hello {user.firstName} {user.lastName} 👋</Typography>
        <Typography variant="subtitle1">Good Morning</Typography>
      </Box>
      <Grid container spacing={1}>
        <Grid item xs={12} md={12}>
          <Paper
            className="dashboard-card"
            style={{
              backgroundColor: '#7B61FF',
              color: 'white',
              padding: '16px',
              borderRadius: '8px'
            }}
          >
            <Grid container spacing={2}>
              {/* Left side with amounts */}
              <Grid item xs={12} md={6} display="flex">
                <Grid container direction="column" spacing={1} justifyContent="center">
                  <Grid item>
                    <Grid container justifyContent="space-between">
                      <Typography variant="body1">Subtotal</Typography>
                      <Typography variant="body1">${subTotalAmount().toFixed(2)}</Typography>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Grid container justifyContent="space-between">
                      <Typography variant="body1">Discounts</Typography>
                      <Typography variant="body1">- $8.00</Typography>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Grid container justifyContent="space-between">
                      <Typography variant="body1">Tax</Typography>
                      <Typography variant="body1">${taxAmount.toFixed(2)}</Typography>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <hr style={{ borderColor: 'white', margin: '8px 0' }} />
                  </Grid>
                  <Grid item>
                    <Grid container justifyContent="space-between">
                      <Typography variant="h6">Total</Typography>
                      <Typography variant="h6">${formData.totalAmount.toFixed(2)}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item style={{ padding: "0 0 0 1.5rem" }}>
                  <Divider orientation="vertical" style={{ backgroundColor: 'white', height: '100%', width: '1px' }} />
                </Grid>
              </Grid>
              
              {/* Divider */}

              {/* Right side with text fields */}
              <Grid item xs={12} md={6} style={{ padding: "16px 0 0 1.5rem" }}>
                <TextField
                  name="customerName"
                  label="Customer Name (optional)"
                  value={formData.customerName}
                  onChange={setCustomerInformation}
                  fullWidth
                  margin="normal"
                  style={{ backgroundColor: 'white', borderRadius: '4px', marginTop: '0' }}
                />
                <TextField
                  name="customerContact"
                  label="Customer Contact (optional)"
                  value={formData.customerContact}
                  onChange={setCustomerInformation}
                  fullWidth
                  margin="normal"
                  style={{ backgroundColor: 'white', borderRadius: '4px', marginTop: '0' }}
                />
                <Button onClick={saveSale} color="primary" style={{ backgroundColor: 'white', borderRadius: '4px', width: '100%' }}>
                  Checkout
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Autocomplete
        options={filteredProducts}
        getOptionLabel={(option) => `${option.sku}: ${option.name}`}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Add Product by SKU"
            value={sku}
            onChange={handleProductsSearch}
            fullWidth
            margin="normal"
          />
        )}
        onChange={(event, newValue) => {
          setSelectedProduct(newValue);
        }}
        value={selectedProduct}
      />
      <Button variant="contained" color="primary" startIcon={<Iconify icon="eva:plus-fill" />} onClick={addItemToCart}>
        Add
      </Button>
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
                  <Button
                    variant="contained"
                    onClick={() => removeItemFromCart(item.sku)}
                    sx={{ backgroundColor: 'red', color: 'white', '&:hover': { backgroundColor: 'darkred' } }}
                  >
                    Remove
                  </Button>
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
